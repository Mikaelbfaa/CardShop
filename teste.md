# Testes das Rotas da API CardShop

## Base URL
```
http://localhost:3000/api
```

---

## 1. Produtos (`/api/products`)

### 1.1 Listar todos os produtos
```bash
GET /api/products
GET /api/products?game=yugioh
GET /api/products?game=mtg
GET /api/products?cardType=MONSTER
GET /api/products?game=yugioh&cardType=SPELL
```

### 1.2 Buscar produto por ID
```bash
GET /api/products/:id
```

### 1.3 Criar produto (Admin)

**Carta de Yu-Gi-Oh! (Monster)**
```json
{
  "name": "Dark Magician",
  "description": "O mago definitivo em termos de ataque e defesa",
  "price": 45.90,
  "stock": 10,
  "game": "yugioh",
  "cardType": "MONSTER",
  "rarity": "Ultra Rare"
}
```

**Carta de Yu-Gi-Oh! (Spell)**
```json
{
  "name": "Pot of Greed",
  "description": "Compre 2 cartas do seu deck",
  "price": 120.00,
  "stock": 5,
  "game": "yugioh",
  "cardType": "SPELL",
  "rarity": "Secret Rare"
}
```

**Carta de Yu-Gi-Oh! (Trap)**
```json
{
  "name": "Mirror Force",
  "description": "Quando um monstro adversário declarar um ataque: destrua todos os monstros de ataque do oponente",
  "price": 35.00,
  "stock": 8,
  "game": "yugioh",
  "cardType": "TRAP",
  "rarity": "Rare"
}
```

**Carta de Magic: The Gathering (Creature)**
```json
{
  "name": "Llanowar Elves",
  "description": "Criatura elfo que gera mana verde",
  "price": 5.00,
  "stock": 50,
  "game": "mtg",
  "cardType": "CREATURE",
  "rarity": "Common"
}
```

**Carta de Magic: The Gathering (Instant)**
```json
{
  "name": "Lightning Bolt",
  "description": "Instant clássico que causa 3 de dano",
  "price": 25.00,
  "stock": 20,
  "game": "mtg",
  "cardType": "INSTANT",
  "rarity": "Common"
}
```

**Carta de Magic: The Gathering (Sorcery)**
```json
{
  "name": "Wrath of God",
  "description": "Destrói todas as criaturas. Elas não podem ser regeneradas",
  "price": 45.00,
  "stock": 10,
  "game": "mtg",
  "cardType": "SORCERY",
  "rarity": "Rare"
}
```

**Carta de Magic: The Gathering (Artifact)**
```json
{
  "name": "Sol Ring",
  "description": "Artefato essencial para Commander",
  "price": 89.90,
  "stock": 15,
  "game": "mtg",
  "cardType": "ARTIFACT",
  "rarity": "Uncommon"
}
```

**Carta de Magic: The Gathering (Enchantment)**
```json
{
  "name": "Rhystic Study",
  "description": "Sempre que um oponente conjura uma magia, você pode comprar uma carta a menos que ele pague 1",
  "price": 150.00,
  "stock": 3,
  "game": "mtg",
  "cardType": "ENCHANTMENT",
  "rarity": "Rare"
}
```

**Carta de Magic: The Gathering (Land)**
```json
{
  "name": "Command Tower",
  "description": "Terreno que gera mana de qualquer cor da identidade do seu comandante",
  "price": 2.50,
  "stock": 100,
  "game": "mtg",
  "cardType": "LAND",
  "rarity": "Common"
}
```

**Carta de Magic: The Gathering (Planeswalker)**
```json
{
  "name": "Jace, the Mind Sculptor",
  "description": "Planeswalker lendário com 4 habilidades",
  "price": 280.00,
  "stock": 2,
  "game": "mtg",
  "cardType": "PLANESWALKER",
  "rarity": "Mythic Rare"
}
```

### 1.4 Atualizar produto (Admin)
```bash
PUT /api/products/:id
```
```json
{
  "price": 55.00,
  "stock": 8
}
```

### 1.5 Deletar produto (Admin)
```bash
DELETE /api/products/:id
```

---

## 2. Carrinho (`/api/cart`)

### 2.1 Visualizar carrinho
```bash
GET /api/cart?userId=1
```

### 2.2 Adicionar item ao carrinho
```bash
POST /api/cart/items
```
```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

### 2.3 Atualizar quantidade de item
```bash
PUT /api/cart/items/:productId?userId=1
```
```json
{
  "quantity": 5
}
```

### 2.4 Remover item do carrinho
```bash
DELETE /api/cart/items/:productId?userId=1
```

### 2.5 Limpar carrinho
```bash
DELETE /api/cart?userId=1
```

---

## 3. Pedidos (`/api/orders`)

### 3.1 Listar pedidos do usuário
```bash
GET /api/orders?userId=1
```

### 3.2 Buscar pedido por ID
```bash
GET /api/orders/:id
```

### 3.3 Criar pedido (a partir do carrinho)
```bash
POST /api/orders
```
```json
{
  "userId": 1,
  "shippingAddress": "Rua das Flores, 123 - São Paulo, SP - CEP 01234-567"
}
```

---

## 4. Pedidos - Admin (`/api/admin/orders`)

### 4.1 Listar todos os pedidos
```bash
GET /api/admin/orders
```

### 4.2 Atualizar status do pedido
```bash
PATCH /api/admin/orders/:id/status
```
```json
{
  "status": "PROCESSING"
}
```

**Status disponíveis:** `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### 4.3 Deletar usuário
```bash
DELETE /api/admin/users/:id
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

---

## 5. Usuários (`/api/users`)

### 5.1 Registrar novo usuário
```bash
POST /api/users/register
```
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "cpf": "123.456.789-00"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "cpf": "123.456.789-00"
  }
}
```

### 5.2 Login
```bash
POST /api/users/login
```
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "role": "CUSTOMER"
    }
  }
}
```

### 5.3 Visualizar perfil (autenticado)
```bash
GET /api/users/profile
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "cpf": "123.456.789-00",
    "role": "CUSTOMER",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5.4 Atualizar perfil (autenticado)
```bash
PATCH /api/users/profile
Authorization: Bearer <token>
```
```json
{
  "name": "João Silva Atualizado"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": {
    "id": 1,
    "name": "João Silva Atualizado",
    "email": "joao@exemplo.com"
  }
}
```

### 5.5 Logout (autenticado)
```bash
POST /api/users/logout
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## Exemplos com curl

### Produtos
```bash
# Listar todos
curl http://localhost:3000/api/products

# Filtrar por jogo
curl "http://localhost:3000/api/products?game=yugioh"

# Filtrar por tipo de carta
curl "http://localhost:3000/api/products?cardType=MONSTER"

# Filtrar por jogo e tipo
curl "http://localhost:3000/api/products?game=mtg&cardType=INSTANT"

# Buscar por ID
curl http://localhost:3000/api/products/1

# Criar produto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Dark Magician","price":45.90,"stock":10,"game":"yugioh","cardType":"MONSTER"}'

# Atualizar produto
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":50.00}'

# Deletar produto
curl -X DELETE http://localhost:3000/api/products/1
```

### Carrinho
```bash
# Visualizar carrinho
curl "http://localhost:3000/api/cart?userId=1"

# Adicionar item
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":1,"quantity":2}'

# Atualizar quantidade
curl -X PUT "http://localhost:3000/api/cart/items/1?userId=1" \
  -H "Content-Type: application/json" \
  -d '{"quantity":5}'

# Remover item
curl -X DELETE "http://localhost:3000/api/cart/items/1?userId=1"

# Limpar carrinho
curl -X DELETE "http://localhost:3000/api/cart?userId=1"
```

### Pedidos
```bash
# Listar pedidos do usuário
curl "http://localhost:3000/api/orders?userId=1"

# Buscar pedido por ID
curl http://localhost:3000/api/orders/1

# Criar pedido
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"shippingAddress":"Rua das Flores, 123 - São Paulo, SP"}'
```

### Admin - Pedidos
```bash
# Listar todos os pedidos
curl http://localhost:3000/api/admin/orders

# Atualizar status
curl -X PATCH http://localhost:3000/api/admin/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"PROCESSING"}'

# Deletar usuário
curl -X DELETE http://localhost:3000/api/admin/users/1
```

### Usuários
```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@exemplo.com","password":"senha123","cpf":"123.456.789-00"}'

# Login (guarde o token retornado)
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@exemplo.com","password":"senha123"}'

# Visualizar perfil (substitua <TOKEN> pelo token obtido no login)
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <TOKEN>"

# Atualizar perfil
curl -X PATCH http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"João Silva Atualizado"}'

# Logout
curl -X POST http://localhost:3000/api/users/logout \
  -H "Authorization: Bearer <TOKEN>"
```
