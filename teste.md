# Testes das Rotas de Produtos

## Criar Produto (POST /api/products)

### Carta de Yu-Gi-Oh!
```json
{
  "name": "Dark Magician",
  "description": "O mago definitivo em termos de ataque e defesa",
  "price": 45.90,
  "stock": 10,
  "game": "yugioh",
  "category": "Monster",
  "rarity": "Ultra Rare"
}
```

### Carta de Magic: The Gathering
```json
{
  "name": "Lightning Bolt",
  "description": "Instant clássico que causa 3 de dano",
  "price": 25.00,
  "stock": 20,
  "game": "mtg",
  "category": "Instant",
  "rarity": "Common"
}
```

### Mais exemplos
```json
{
  "name": "Exodia the Forbidden One",
  "description": "Cabeça do Exodia - vitória instantânea ao reunir as 5 peças",
  "price": 350.00,
  "stock": 2,
  "game": "yugioh",
  "category": "Monster",
  "rarity": "Secret Rare"
}
```

```json
{
  "name": "Sol Ring",
  "description": "Artefato essencial para Commander",
  "price": 89.90,
  "stock": 15,
  "game": "mtg",
  "category": "Artifact",
  "rarity": "Uncommon"
}
```

---

## Atualizar Produto (PUT /api/products/:id)

```json
{
  "price": 55.00,
  "stock": 8
}
```

```json
{
  "description": "Descrição atualizada do produto",
  "rarity": "Secret Rare"
}
```

---

## Testar com curl

```bash
# Listar todos
curl http://localhost:3000/api/products

# Criar produto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Dark Magician","price":45.90,"stock":10,"game":"yugioh"}'

# Buscar por ID
curl http://localhost:3000/api/products/1

# Atualizar
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":50.00}'

# Deletar
curl -X DELETE http://localhost:3000/api/products/3

# Filtrar por jogo
curl "http://localhost:3000/api/products?game=yugioh"
```
