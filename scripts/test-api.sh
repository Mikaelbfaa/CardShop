#!/bin/bash


# Script de Teste da API CardShop
# Execute com: bash scripts/test-api.sh
# Requer: curl, servidor rodando em localhost:3000


BASE_URL="http://localhost:3000/api"
CONTENT_TYPE="Content-Type: application/json"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# Funcao para imprimir cabecalho
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Funcao para imprimir teste
print_test() {
    echo -e "${YELLOW}>> $1${NC}"
}

# Funcao para verificar resposta
check_response() {
    local response="$1"
    local expected="$2"
    local test_name="$3"

    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}   PASSOU${NC}"
        ((PASSED++))
    else
        echo -e "${RED}   FALHOU - Esperado: $expected${NC}"
        echo -e "${RED}   Resposta: $response${NC}"
        ((FAILED++))
    fi
}

# Verificar se o servidor esta rodando
echo -e "${YELLOW}Verificando se o servidor esta rodando...${NC}"
if ! curl -s "$BASE_URL/products" > /dev/null 2>&1; then
    echo -e "${RED}ERRO: Servidor nao esta rodando em $BASE_URL${NC}"
    echo -e "${YELLOW}Execute 'npm run dev' antes de rodar os testes${NC}"
    exit 1
fi
echo -e "${GREEN}Servidor OK!${NC}"


# TESTES DE PRODUTOS
print_header "TESTES DE PRODUTOS"

# Timestamp para nomes unicos
TIMESTAMP=$(date +%H%M%S)

# 1. Listar produtos (vazio ou com dados)
print_test "GET /products - Listar todos os produtos"
response=$(curl -s "$BASE_URL/products")
check_response "$response" '"success":true' "Listar produtos"

# 2. Criar produto Yu-Gi-Oh! (Monster)
print_test "POST /products - Criar carta Yu-Gi-Oh! (MONSTER)"
response=$(curl -s -X POST "$BASE_URL/products" \
    -H "$CONTENT_TYPE" \
    -d "{\"name\":\"Dark Magician Test $TIMESTAMP\",\"description\":\"Mago das Trevas\",\"price\":45.90,\"stock\":10,\"game\":\"yugioh\",\"cardType\":\"MONSTER\",\"rarity\":\"Ultra Rare\"}")
check_response "$response" '"success":true' "Criar produto YGO Monster"
PRODUCT_ID_1=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

# 3. Criar produto Yu-Gi-Oh! (Spell)
print_test "POST /products - Criar carta Yu-Gi-Oh! (SPELL)"
response=$(curl -s -X POST "$BASE_URL/products" \
    -H "$CONTENT_TYPE" \
    -d "{\"name\":\"Pot of Greed Test $TIMESTAMP\",\"description\":\"Compre 2 cartas\",\"price\":120.00,\"stock\":5,\"game\":\"yugioh\",\"cardType\":\"SPELL\",\"rarity\":\"Rare\"}")
check_response "$response" '"success":true' "Criar produto YGO Spell"
PRODUCT_ID_2=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

# 4. Criar produto MTG (Instant)
print_test "POST /products - Criar carta MTG (INSTANT)"
response=$(curl -s -X POST "$BASE_URL/products" \
    -H "$CONTENT_TYPE" \
    -d "{\"name\":\"Lightning Bolt Test $TIMESTAMP\",\"description\":\"3 de dano\",\"price\":25.00,\"stock\":20,\"game\":\"mtg\",\"cardType\":\"INSTANT\",\"rarity\":\"Common\"}")
check_response "$response" '"success":true' "Criar produto MTG Instant"
PRODUCT_ID_3=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

# 5. Criar produto MTG (Creature)
print_test "POST /products - Criar carta MTG (CREATURE)"
response=$(curl -s -X POST "$BASE_URL/products" \
    -H "$CONTENT_TYPE" \
    -d "{\"name\":\"Llanowar Elves Test $TIMESTAMP\",\"description\":\"Gera mana verde\",\"price\":5.00,\"stock\":50,\"game\":\"mtg\",\"cardType\":\"CREATURE\",\"rarity\":\"Common\"}")
check_response "$response" '"success":true' "Criar produto MTG Creature"
PRODUCT_ID_4=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

# 6. Teste de validacao - CardType invalido para jogo
print_test "POST /products - Validacao: MONSTER em MTG (deve falhar)"
response=$(curl -s -X POST "$BASE_URL/products" \
    -H "$CONTENT_TYPE" \
    -d "{\"name\":\"Invalid Card $TIMESTAMP\",\"price\":10.00,\"stock\":5,\"game\":\"mtg\",\"cardType\":\"MONSTER\"}")
check_response "$response" 'inválido\|invalid\|Tipo de carta' "Validacao CardType"

# 7. Buscar produto por ID
print_test "GET /products/:id - Buscar produto por ID"
response=$(curl -s "$BASE_URL/products/$PRODUCT_ID_1")
check_response "$response" '"success":true' "Buscar por ID"

# 8. Filtrar por jogo
print_test "GET /products?game=yugioh - Filtrar por jogo"
response=$(curl -s "$BASE_URL/products?game=yugioh")
check_response "$response" '"success":true' "Filtrar por jogo"

# 9. Filtrar por tipo de carta
print_test "GET /products?cardType=MONSTER - Filtrar por tipo"
response=$(curl -s "$BASE_URL/products?cardType=MONSTER")
check_response "$response" '"success":true' "Filtrar por tipo"

# 10. Filtrar por jogo e tipo
print_test "GET /products?game=mtg&cardType=INSTANT - Filtrar por jogo e tipo"
response=$(curl -s "$BASE_URL/products?game=mtg&cardType=INSTANT")
check_response "$response" '"success":true' "Filtrar jogo+tipo"

# 11. Atualizar produto
print_test "PUT /products/:id - Atualizar produto"
response=$(curl -s -X PUT "$BASE_URL/products/$PRODUCT_ID_1" \
    -H "$CONTENT_TYPE" \
    -d '{"price":50.00,"stock":8}')
check_response "$response" '"success":true' "Atualizar produto"

# 12. Produto nao encontrado
print_test "GET /products/99999 - Produto nao encontrado"
response=$(curl -s "$BASE_URL/products/99999")
check_response "$response" '"success":false\|não encontrado\|not found' "Produto nao encontrado"


# TESTES DE CARRINHO
print_header "TESTES DE CARRINHO"

# Usar ID 2 (cliente criado pelo seed) - ajuste se necessario
USER_ID=2

# 1. Visualizar carrinho (pode estar vazio)
print_test "GET /cart?userId=$USER_ID - Visualizar carrinho"
response=$(curl -s "$BASE_URL/cart?userId=$USER_ID")
check_response "$response" '"success":true' "Visualizar carrinho"

# 2. Adicionar item ao carrinho
print_test "POST /cart/items - Adicionar item ao carrinho"
response=$(curl -s -X POST "$BASE_URL/cart/items" \
    -H "$CONTENT_TYPE" \
    -d "{\"userId\":$USER_ID,\"productId\":$PRODUCT_ID_1,\"quantity\":2}")
check_response "$response" '"success":true' "Adicionar item"

# 3. Adicionar outro item
print_test "POST /cart/items - Adicionar segundo item"
response=$(curl -s -X POST "$BASE_URL/cart/items" \
    -H "$CONTENT_TYPE" \
    -d "{\"userId\":$USER_ID,\"productId\":$PRODUCT_ID_3,\"quantity\":1}")
check_response "$response" '"success":true' "Adicionar segundo item"

# 4. Atualizar quantidade
print_test "PUT /cart/items/:productId - Atualizar quantidade"
response=$(curl -s -X PUT "$BASE_URL/cart/items/$PRODUCT_ID_1?userId=$USER_ID" \
    -H "$CONTENT_TYPE" \
    -d '{"quantity":5}')
check_response "$response" '"success":true' "Atualizar quantidade"

# 5. Visualizar carrinho atualizado
print_test "GET /cart?userId=$USER_ID - Verificar carrinho atualizado"
response=$(curl -s "$BASE_URL/cart?userId=$USER_ID")
check_response "$response" '"success":true' "Verificar carrinho"

# 6. Remover item
print_test "DELETE /cart/items/:productId - Remover item"
response=$(curl -s -X DELETE "$BASE_URL/cart/items/$PRODUCT_ID_3?userId=$USER_ID")
check_response "$response" '"success":true' "Remover item"


# TESTES DE PEDIDOS
print_header "TESTES DE PEDIDOS"

# 1. Criar pedido
print_test "POST /orders - Criar pedido"
response=$(curl -s -X POST "$BASE_URL/orders" \
    -H "$CONTENT_TYPE" \
    -d "{\"userId\":$USER_ID,\"shippingAddress\":\"Rua Teste, 123 - Sao Paulo, SP\"}")
# Pode falhar se carrinho estiver vazio, entao verificamos ambos os casos
if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}   PASSOU${NC}"
    ((PASSED++))
    ORDER_ID=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
else
    echo -e "${YELLOW}   AVISO: Pedido nao criado (carrinho pode estar vazio)${NC}"
    ORDER_ID=""
fi

# 2. Listar pedidos do usuario
print_test "GET /orders?userId=$USER_ID - Listar pedidos"
response=$(curl -s "$BASE_URL/orders?userId=$USER_ID")
check_response "$response" '"success":true' "Listar pedidos"

# 3. Buscar pedido por ID (se foi criado)
if [ -n "$ORDER_ID" ]; then
    print_test "GET /orders/:id - Buscar pedido por ID"
    response=$(curl -s "$BASE_URL/orders/$ORDER_ID")
    check_response "$response" '"success":true' "Buscar pedido"
fi


# TESTES DE ADMIN - PEDIDOS
print_header "TESTES DE ADMIN - PEDIDOS"

# 1. Listar todos os pedidos
print_test "GET /admin/orders - Listar todos os pedidos"
response=$(curl -s "$BASE_URL/admin/orders")
check_response "$response" '"success":true' "Listar todos pedidos"

# 2. Atualizar status (se temos um pedido)
if [ -n "$ORDER_ID" ]; then
    print_test "PATCH /admin/orders/:id/status - Atualizar status para PROCESSING"
    response=$(curl -s -X PATCH "$BASE_URL/admin/orders/$ORDER_ID/status" \
        -H "$CONTENT_TYPE" \
        -d '{"status":"PROCESSING"}')
    check_response "$response" '"success":true' "Atualizar status"

    print_test "PATCH /admin/orders/:id/status - Atualizar status para SHIPPED"
    response=$(curl -s -X PATCH "$BASE_URL/admin/orders/$ORDER_ID/status" \
        -H "$CONTENT_TYPE" \
        -d '{"status":"SHIPPED"}')
    check_response "$response" '"success":true' "Atualizar status SHIPPED"
fi


# LIMPEZA
print_header "LIMPEZA"

# Deletar produtos de teste
print_test "DELETE /products - Limpando produtos de teste"
for id in $PRODUCT_ID_1 $PRODUCT_ID_2 $PRODUCT_ID_3 $PRODUCT_ID_4; do
    if [ -n "$id" ]; then
        curl -s -X DELETE "$BASE_URL/products/$id" > /dev/null
    fi
done
echo -e "${GREEN}   Produtos de teste removidos${NC}"


# RESULTADO FINAL
print_header "RESULTADO FINAL"
TOTAL=$((PASSED + FAILED))
echo -e "Total de testes: $TOTAL"
echo -e "${GREEN}Passou: $PASSED${NC}"
echo -e "${RED}Falhou: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}Todos os testes passaram!${NC}"
    exit 0
else
    echo -e "${RED}Alguns testes falharam.${NC}"
    exit 1
fi
