# Script de Teste da API CardShop (PowerShell)
# Execute com: .\scripts\test-api.ps1
# Requer: PowerShell 5+, servidor rodando em localhost:3000

$BASE_URL = "http://localhost:3000/api"
$CONTENT_TYPE = "application/json"

# Contadores
$script:PASSED = 0
$script:FAILED = 0

# Token JWT para rotas autenticadas
$script:AUTH_TOKEN = $null

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Title -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
}

function Write-Test {
    param([string]$Name)
    Write-Host ">> $Name" -ForegroundColor Yellow -NoNewline
}

function Test-Response {
    param(
        [string]$Response,
        [string]$Expected,
        [string]$TestName
    )

    if ($Response -match $Expected) {
        Write-Host " PASSOU" -ForegroundColor Green
        $script:PASSED++
        return $true
    } else {
        Write-Host " FALHOU" -ForegroundColor Red
        Write-Host "   Esperado: $Expected" -ForegroundColor Red
        Write-Host "   Resposta: $($Response.Substring(0, [Math]::Min(200, $Response.Length)))..." -ForegroundColor Red
        $script:FAILED++
        return $false
    }
}

function Invoke-Api {
    param(
        [string]$Method = "GET",
        [string]$Endpoint,
        [string]$Body = $null,
        [string]$Token = $null
    )

    $uri = "$BASE_URL$Endpoint"

    try {
        $headers = @{}
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }

        $params = @{
            Uri = $uri
            Method = $Method
            ContentType = $CONTENT_TYPE
            ErrorAction = "Stop"
        }

        if ($headers.Count -gt 0) {
            $params.Headers = $headers
        }

        if ($Body) {
            $params.Body = $Body
        }

        $response = Invoke-WebRequest @params
        return $response.Content
    } catch [Microsoft.PowerShell.Commands.HttpResponseException] {
        # PowerShell 7+ - captura o corpo da resposta de erro
        return $_.ErrorDetails.Message
    } catch {
        # Fallback para outras versoes
        if ($_.Exception.Response) {
            try {
                $result = $_.Exception.Response.Content.ReadAsStringAsync().Result
                return $result
            } catch {
                # Ignorar
            }
        }
        return "{`"success`":false,`"message`":`"$($_.Exception.Message)`"}"
    }
}

# Verificar se o servidor esta rodando
Write-Host "Verificando se o servidor esta rodando..." -ForegroundColor Yellow
try {
    $null = Invoke-WebRequest -Uri "$BASE_URL/products" -Method GET -ErrorAction Stop
    Write-Host "Servidor OK!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Servidor nao esta rodando em $BASE_URL" -ForegroundColor Red
    Write-Host "Execute 'npm run dev' antes de rodar os testes" -ForegroundColor Yellow
    exit 1
}

# Timestamp para nomes unicos
$TIMESTAMP = Get-Date -Format "HHmmss"


# TESTES DE USUARIOS
Write-Header "TESTES DE USUARIOS"

$TEST_EMAIL = "teste_$TIMESTAMP@cardshop.com"
$TEST_PASSWORD = "senha123"
$RANDOM_DIGITS = Get-Random -Minimum 10000000 -Maximum 99999999
$TEST_CPF = "$RANDOM_DIGITS$TIMESTAMP".Substring(0, 11)
$TEST_CPF = "$($TEST_CPF.Substring(0,3)).$($TEST_CPF.Substring(3,3)).$($TEST_CPF.Substring(6,3))-$($TEST_CPF.Substring(9,2))"

# 1. Registrar usuario
Write-Test "POST /users/register - Registrar novo usuario"
$body = "{`"name`":`"Usuario Teste $TIMESTAMP`",`"email`":`"$TEST_EMAIL`",`"password`":`"$TEST_PASSWORD`",`"cpf`":`"$TEST_CPF`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/users/register" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Registrar usuario"
if ($response -match '"id":\s*(\d+)') { $script:TEST_USER_ID = $matches[1] }

# 2. Registrar usuario duplicado (deve falhar)
Write-Test "POST /users/register - Email duplicado (deve falhar)"
$response = Invoke-Api -Method "POST" -Endpoint "/users/register" -Body $body
Test-Response -Response $response -Expected '"success":\s*false|j. registrado|409' -TestName "Email duplicado"

# 3. Login do usuario
Write-Test "POST /users/login - Login do usuario"
$body = "{`"email`":`"$TEST_EMAIL`",`"password`":`"$TEST_PASSWORD`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/users/login" -Body $body
$result = Test-Response -Response $response -Expected '"success":\s*true' -TestName "Login"
if ($response -match '"token":\s*"([^"]+)"') {
    $script:AUTH_TOKEN = $matches[1]
    Write-Host "   Token obtido com sucesso" -ForegroundColor Cyan
}

# 4. Login com senha errada (deve falhar)
Write-Test "POST /users/login - Senha incorreta (deve falhar)"
$body = "{`"email`":`"$TEST_EMAIL`",`"password`":`"senhaerrada`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/users/login" -Body $body
Test-Response -Response $response -Expected '"success":\s*false|inv.lid|401' -TestName "Senha incorreta"

# 5. Visualizar perfil (autenticado)
Write-Test "GET /users/profile - Visualizar perfil"
$response = Invoke-Api -Method "GET" -Endpoint "/users/profile" -Token $script:AUTH_TOKEN
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Visualizar perfil"

# 6. Visualizar perfil sem token (deve falhar)
Write-Test "GET /users/profile - Sem token (deve falhar)"
$response = Invoke-Api -Method "GET" -Endpoint "/users/profile"
Test-Response -Response $response -Expected '"success":\s*false|401|Token' -TestName "Sem token"

# 7. Atualizar perfil
Write-Test "PATCH /users/profile - Atualizar nome"
$body = "{`"name`":`"Usuario Atualizado $TIMESTAMP`"}"
$response = Invoke-Api -Method "PATCH" -Endpoint "/users/profile" -Body $body -Token $script:AUTH_TOKEN
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Atualizar perfil"

# 8. Logout
Write-Test "POST /users/logout - Logout"
$response = Invoke-Api -Method "POST" -Endpoint "/users/logout" -Token $script:AUTH_TOKEN
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Logout"


# TESTES DE PRODUTOS
Write-Header "TESTES DE PRODUTOS"

# 1. Listar produtos
Write-Test "GET /products - Listar todos os produtos"
$response = Invoke-Api -Endpoint "/products"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Listar produtos"

# 2. Criar produto Yu-Gi-Oh! (Monster)
Write-Test "POST /products - Criar carta Yu-Gi-Oh! (MONSTER)"
$body = "{`"name`":`"Dark Magician Test $TIMESTAMP`",`"description`":`"Mago das Trevas`",`"price`":45.90,`"stock`":10,`"game`":`"yugioh`",`"cardType`":`"MONSTER`",`"rarity`":`"Ultra Rare`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/products" -Body $body
$result = Test-Response -Response $response -Expected '"success":\s*true' -TestName "Criar produto YGO Monster"
if ($response -match '"id":\s*(\d+)') { $script:PRODUCT_ID_1 = $matches[1] }

# 3. Criar produto Yu-Gi-Oh! (Spell)
Write-Test "POST /products - Criar carta Yu-Gi-Oh! (SPELL)"
$body = "{`"name`":`"Pot of Greed Test $TIMESTAMP`",`"description`":`"Compre 2 cartas`",`"price`":120.00,`"stock`":5,`"game`":`"yugioh`",`"cardType`":`"SPELL`",`"rarity`":`"Rare`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/products" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Criar produto YGO Spell"
if ($response -match '"id":\s*(\d+)') { $script:PRODUCT_ID_2 = $matches[1] }

# 4. Criar produto MTG (Instant)
Write-Test "POST /products - Criar carta MTG (INSTANT)"
$body = "{`"name`":`"Lightning Bolt Test $TIMESTAMP`",`"description`":`"3 de dano`",`"price`":25.00,`"stock`":20,`"game`":`"mtg`",`"cardType`":`"INSTANT`",`"rarity`":`"Common`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/products" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Criar produto MTG Instant"
if ($response -match '"id":\s*(\d+)') { $script:PRODUCT_ID_3 = $matches[1] }

# 5. Criar produto MTG (Creature)
Write-Test "POST /products - Criar carta MTG (CREATURE)"
$body = "{`"name`":`"Llanowar Elves Test $TIMESTAMP`",`"description`":`"Gera mana verde`",`"price`":5.00,`"stock`":50,`"game`":`"mtg`",`"cardType`":`"CREATURE`",`"rarity`":`"Common`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/products" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Criar produto MTG Creature"
if ($response -match '"id":\s*(\d+)') { $script:PRODUCT_ID_4 = $matches[1] }

# 6. Teste de validacao - CardType invalido para jogo
Write-Test "POST /products - Validacao: MONSTER em MTG (deve falhar)"
$body = "{`"name`":`"Invalid Card $TIMESTAMP`",`"price`":10.00,`"stock`":5,`"game`":`"mtg`",`"cardType`":`"MONSTER`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/products" -Body $body
Test-Response -Response $response -Expected 'inv.lid|Tipo de carta' -TestName "Validacao CardType"

# 7. Buscar produto por ID
Write-Test "GET /products/:id - Buscar produto por ID"
$response = Invoke-Api -Endpoint "/products/$($script:PRODUCT_ID_1)"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Buscar por ID"

# 8. Filtrar por jogo
Write-Test "GET /products?game=yugioh - Filtrar por jogo"
$response = Invoke-Api -Endpoint "/products?game=yugioh"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Filtrar por jogo"

# 9. Filtrar por tipo de carta
Write-Test "GET /products?cardType=MONSTER - Filtrar por tipo"
$response = Invoke-Api -Endpoint "/products?cardType=MONSTER"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Filtrar por tipo"

# 10. Atualizar produto
Write-Test "PUT /products/:id - Atualizar produto"
$body = '{"price":50.00,"stock":8}'
$response = Invoke-Api -Method "PUT" -Endpoint "/products/$($script:PRODUCT_ID_1)" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Atualizar produto"

# 11. Produto nao encontrado
Write-Test "GET /products/99999 - Produto nao encontrado"
$response = Invoke-Api -Endpoint "/products/99999"
Test-Response -Response $response -Expected '"success":\s*false|n.o encontrado' -TestName "Produto nao encontrado"


# TESTES DE CARRINHO
Write-Header "TESTES DE CARRINHO"

# Usar ID 2 (cliente criado pelo seed) - ajuste se necessario
$USER_ID = 2

# 1. Visualizar carrinho
Write-Test "GET /cart?userId=$USER_ID - Visualizar carrinho"
$response = Invoke-Api -Endpoint "/cart?userId=$USER_ID"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Visualizar carrinho"

# 2. Adicionar item ao carrinho
Write-Test "POST /cart/items - Adicionar item ao carrinho"
$body = "{`"userId`":$USER_ID,`"productId`":$($script:PRODUCT_ID_1),`"quantity`":2}"
$response = Invoke-Api -Method "POST" -Endpoint "/cart/items" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Adicionar item"

# 3. Adicionar outro item
Write-Test "POST /cart/items - Adicionar segundo item"
$body = "{`"userId`":$USER_ID,`"productId`":$($script:PRODUCT_ID_3),`"quantity`":1}"
$response = Invoke-Api -Method "POST" -Endpoint "/cart/items" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Adicionar segundo item"

# 4. Atualizar quantidade
Write-Test "PUT /cart/items/:productId - Atualizar quantidade"
$body = '{"quantity":5}'
$response = Invoke-Api -Method "PUT" -Endpoint "/cart/items/$($script:PRODUCT_ID_1)?userId=$USER_ID" -Body $body
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Atualizar quantidade"

# 5. Remover item
Write-Test "DELETE /cart/items/:productId - Remover item"
$response = Invoke-Api -Method "DELETE" -Endpoint "/cart/items/$($script:PRODUCT_ID_3)?userId=$USER_ID"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Remover item"


# TESTES DE PEDIDOS
Write-Header "TESTES DE PEDIDOS"

# 1. Criar pedido
Write-Test "POST /orders - Criar pedido"
$body = "{`"userId`":$USER_ID,`"shippingAddress`":`"Rua Teste, 123 - Sao Paulo, SP`"}"
$response = Invoke-Api -Method "POST" -Endpoint "/orders" -Body $body
if ($response -match '"success":\s*true') {
    Write-Host " PASSOU" -ForegroundColor Green
    $script:PASSED++
    if ($response -match '"id":\s*(\d+)') { $ORDER_ID = $matches[1] }
} else {
    Write-Host " AVISO: Pedido nao criado (carrinho pode estar vazio)" -ForegroundColor Yellow
    $ORDER_ID = $null
}

# 2. Listar pedidos do usuario
Write-Test "GET /orders?userId=$USER_ID - Listar pedidos"
$response = Invoke-Api -Endpoint "/orders?userId=$USER_ID"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Listar pedidos"

# 3. Buscar pedido por ID
if ($ORDER_ID) {
    Write-Test "GET /orders/:id - Buscar pedido por ID"
    $response = Invoke-Api -Endpoint "/orders/$ORDER_ID"
    Test-Response -Response $response -Expected '"success":\s*true' -TestName "Buscar pedido"
}


# TESTES DE ADMIN - PEDIDOS
Write-Header "TESTES DE ADMIN - PEDIDOS"

# 1. Listar todos os pedidos
Write-Test "GET /admin/orders - Listar todos os pedidos"
$response = Invoke-Api -Endpoint "/admin/orders"
Test-Response -Response $response -Expected '"success":\s*true' -TestName "Listar todos pedidos"

# 2. Atualizar status
if ($ORDER_ID) {
    Write-Test "PATCH /admin/orders/:id/status - Atualizar status para PROCESSING"
    $body = '{"status":"PROCESSING"}'
    $response = Invoke-Api -Method "PATCH" -Endpoint "/admin/orders/$ORDER_ID/status" -Body $body
    Test-Response -Response $response -Expected '"success":\s*true' -TestName "Atualizar status"
}


# LIMPEZA
Write-Header "LIMPEZA"

# Ordem correta: Pedidos -> Carrinho -> Produtos -> Usuarios

# 1. Deletar pedido de teste (cascade deleta order_items)
if ($ORDER_ID) {
    Write-Host "Removendo pedido de teste (ID: $ORDER_ID)..." -ForegroundColor Yellow
    $null = Invoke-Api -Method "DELETE" -Endpoint "/admin/orders/$ORDER_ID"
}

# 2. Limpar carrinho (deleta cart_items)
Write-Host "Limpando carrinho do usuario de teste..." -ForegroundColor Yellow
$null = Invoke-Api -Method "DELETE" -Endpoint "/cart?userId=$USER_ID"

# 3. Deletar produtos de teste
Write-Host "Removendo produtos de teste..." -ForegroundColor Yellow
foreach ($id in @($script:PRODUCT_ID_1, $script:PRODUCT_ID_2, $script:PRODUCT_ID_3, $script:PRODUCT_ID_4)) {
    if ($id) {
        $null = Invoke-Api -Method "DELETE" -Endpoint "/products/$id"
    }
}
Write-Host "Produtos de teste removidos" -ForegroundColor Green

# 4. Deletar usuario de teste
if ($script:TEST_USER_ID) {
    Write-Test "DELETE /admin/users/:id - Deletar usuario de teste"
    $response = Invoke-Api -Method "DELETE" -Endpoint "/admin/users/$($script:TEST_USER_ID)"
    Test-Response -Response $response -Expected '"success":\s*true' -TestName "Deletar usuario"
} else {
    Write-Host "Nota: Usuario de teste nao foi removido (ID nao encontrado)" -ForegroundColor Yellow
}


# RESULTADO FINAL
Write-Header "RESULTADO FINAL"
$TOTAL = $script:PASSED + $script:FAILED
Write-Host "Total de testes: $TOTAL"
Write-Host "Passou: $($script:PASSED)" -ForegroundColor Green
Write-Host "Falhou: $($script:FAILED)" -ForegroundColor Red

if ($script:FAILED -eq 0) {
    Write-Host "Todos os testes passaram!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Alguns testes falharam." -ForegroundColor Red
    exit 1
}
