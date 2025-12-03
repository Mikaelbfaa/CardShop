# Diagramas do CardShop

## 1. Modelo Entidade Relacionamento (MER) - Conceitual

```mermaid
erDiagram
    USUARIO ||--o| CARRINHO : possui
    USUARIO ||--o{ PEDIDO : realiza
    CARRINHO ||--o{ ITEM_CARRINHO : contem
    PRODUTO ||--o{ ITEM_CARRINHO : adicionado_em
    PEDIDO ||--o{ ITEM_PEDIDO : contem
    PRODUTO ||--o{ ITEM_PEDIDO : incluido_em

    USUARIO {
        string nome
        string email
        string senha
        string cpf
        string telefone
        string endereco
        enum papel
    }

    PRODUTO {
        string nome
        string descricao
        decimal preco
        int estoque
        enum jogo
        enum tipo_carta
        string raridade
        string imagem
    }

    CARRINHO {
        datetime criado_em
        datetime atualizado_em
    }

    ITEM_CARRINHO {
        int quantidade
    }

    PEDIDO {
        decimal preco_total
        enum status
        string endereco_entrega
    }

    ITEM_PEDIDO {
        int quantidade
        decimal preco_unitario
    }
```

## 2. Diagrama Entidade Relacionamento (DER) - Físico

```mermaid
erDiagram
    users ||--o| carts : possui
    users ||--o{ orders : realiza
    carts ||--o{ cart_items : contem
    products ||--o{ cart_items : pertence
    orders ||--o{ order_items : contem
    products ||--o{ order_items : pertence

    users {
        int id PK
        varchar name
        varchar email UK
        varchar password
        varchar cpf UK
        varchar phone
        varchar address
        enum role
        timestamp createdAt
        timestamp updatedAt
    }

    products {
        int id PK
        varchar name UK
        text description
        decimal price
        int stock
        enum game
        enum cardType
        varchar rarity
        varchar image
        timestamp createdAt
        timestamp updatedAt
    }

    carts {
        int id PK
        int userId FK
        timestamp createdAt
        timestamp updatedAt
    }

    cart_items {
        int id PK
        int cartId FK
        int productId FK
        int quantity
        timestamp createdAt
    }

    orders {
        int id PK
        int userId FK
        decimal totalPrice
        enum status
        varchar shippingAddress
        timestamp createdAt
        timestamp updatedAt
    }

    order_items {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        decimal unitPrice
    }
```

**Legenda dos Enums:**
- `role`: CUSTOMER, ADMIN
- `game`: mtg, yugioh
- `cardType`: MONSTER, SPELL, TRAP (Yu-Gi-Oh!) / CREATURE, INSTANT, SORCERY, ENCHANTMENT, ARTIFACT, LAND, PLANESWALKER (MTG)
- `status`: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

## 3. Diagrama de Arquitetura - N-Tier

```mermaid
flowchart TB
    subgraph Cliente["Cliente (Frontend)"]
        Browser[Navegador/App]
    end

    subgraph API["API REST (Backend)"]
        subgraph Routes["Camada de Rotas"]
            R1[product_routes.ts]
            R2[cart_routes.ts]
            R3[order_routes.ts]
            R4[admin_order_routes.ts]
        end

        subgraph Controllers["Camada de Controllers"]
            C1[product.ts]
            C2[cart.ts]
            C3[order.ts]
        end

        subgraph Services["Camada de Services"]
            S1[product.ts]
            S2[cart.ts]
            S3[order.ts]
        end

        subgraph Repository["Camada de Repository"]
            RP1[product.ts]
            RP2[cart.ts]
            RP3[order.ts]
        end

        subgraph Middleware["Middlewares"]
            M1[auth.ts]
            M2[validation.ts]
        end
    end

    subgraph Database["Banco de Dados"]
        Prisma[Prisma ORM]
        PG[(PostgreSQL)]
    end

    Browser -->|HTTP Request| Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Repository
    Repository --> Prisma
    Prisma --> PG
```

## 4. Diagrama de Arquitetura - Componentes

```mermaid
flowchart LR
    subgraph Frontend["Frontend (Planejado)"]
        React[React App]
    end

    subgraph Backend["Backend"]
        Express[Express.js]

        subgraph Modules["Módulos"]
            Products[Produtos]
            Cart[Carrinho]
            Orders[Pedidos]
            Users[Usuários]
        end
    end

    subgraph Data["Dados"]
        Prisma[Prisma Client]
        PostgreSQL[(PostgreSQL)]
    end

    subgraph External["Externos (Futuro)"]
        JWT[JWT Auth]
        Payment[Pagamento]
    end

    React -->|REST API| Express
    Express --> Modules
    Modules --> Prisma
    Prisma --> PostgreSQL
    Express -.->|Futuro| JWT
    Express -.->|Futuro| Payment
```

## 5. Fluxograma - Processo de Compra

```mermaid
flowchart TD
    A[Início] --> B[Usuário acessa catálogo]
    B --> C[Visualiza produtos]
    C --> D{Produto disponível?}
    D -->|Não| C
    D -->|Sim| E[Adiciona ao carrinho]
    E --> F{Continuar comprando?}
    F -->|Sim| C
    F -->|Não| G[Visualiza carrinho]
    G --> H{Carrinho OK?}
    H -->|Não| I[Ajusta quantidades]
    I --> G
    H -->|Sim| J{Usuário autenticado?}
    J -->|Não| K[Fazer login/cadastro]
    K --> J
    J -->|Sim| L[Informar endereço de entrega]
    L --> M[Finalizar pedido]
    M --> N[Pedido criado - Status: PENDING]
    N --> O[Fim]
```

## 6. Fluxograma - Ciclo de Vida do Pedido

```mermaid
flowchart LR
    A[PENDING] -->|Admin processa| B[PROCESSING]
    B -->|Admin envia| C[SHIPPED]
    C -->|Entrega confirmada| D[DELIVERED]

    A -->|Cancelamento| E[CANCELLED]
    B -->|Cancelamento| E

    style A fill:#ffd700
    style B fill:#87ceeb
    style C fill:#98fb98
    style D fill:#90ee90
    style E fill:#ff6b6b
```

## 7. Fluxograma - Validação de Produto

```mermaid
flowchart TD
    A[Recebe dados do produto] --> B{Campos obrigatórios?}
    B -->|Não| C[Erro: Campo obrigatório]
    B -->|Sim| D{Preço >= 0?}
    D -->|Não| E[Erro: Preço inválido]
    D -->|Sim| F{Estoque >= 0?}
    F -->|Não| G[Erro: Estoque inválido]
    F -->|Sim| H{Jogo válido?}
    H -->|Não| I[Erro: Jogo inválido]
    H -->|Sim| J{CardType compatível com jogo?}
    J -->|Não| K[Erro: Tipo de carta inválido para o jogo]
    J -->|Sim| L{Produto já existe?}
    L -->|Sim| M[Erro: Nome duplicado]
    L -->|Não| N[Criar produto]
    N --> O[Sucesso]
```

## 8. Diagrama de Sequência - Criar Pedido

```mermaid
sequenceDiagram
    participant C as Cliente
    participant API as API
    participant OS as OrderService
    participant OR as OrderRepository
    participant CR as CartRepository
    participant DB as PostgreSQL

    C->>API: POST /api/orders
    API->>OS: createOrder(userId, address)
    OS->>CR: getCartWithItems(userId)
    CR->>DB: SELECT cart, items
    DB-->>CR: Cart + Items
    CR-->>OS: Cart com itens

    alt Carrinho vazio
        OS-->>API: Erro: Carrinho vazio
        API-->>C: 400 Bad Request
    else Carrinho com itens
        OS->>OS: Calcular total
        OS->>OS: Validar estoque
        OS->>OR: create(orderData)
        OR->>DB: INSERT order + items
        OR->>DB: UPDATE product stock
        OR->>DB: DELETE cart items
        DB-->>OR: Order criado
        OR-->>OS: Order
        OS-->>API: Order
        API-->>C: 201 Created
    end
```

## 9. Modelo de Dados - Enums

```mermaid
classDiagram
    class Role {
        <<enumeration>>
        CUSTOMER
        ADMIN
    }

    class Game {
        <<enumeration>>
        mtg
        yugioh
    }

    class CardType {
        <<enumeration>>
        MONSTER
        SPELL
        TRAP
        CREATURE
        INSTANT
        SORCERY
        ENCHANTMENT
        ARTIFACT
        LAND
        PLANESWALKER
    }

    class OrderStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }

    note for CardType "Yu-Gi-Oh!: MONSTER, SPELL, TRAP\nMTG: CREATURE, INSTANT, SORCERY,\nENCHANTMENT, ARTIFACT, LAND, PLANESWALKER"
```

## 10. Diagrama de Classes - Camada de Services

```mermaid
classDiagram
    class ProductService {
        +getAllProducts(filters) Product[]
        +getProductById(id) Product
        +createProduct(data) Product
        +updateProduct(id, data) Product
        +deleteProduct(id) boolean
        -validateProductData(data) void
        -validateCardTypeForGame(cardType, game) void
    }

    class CartService {
        +getCart(userId) Cart
        +addToCart(userId, productId, quantity) CartItem
        +updateQuantity(userId, productId, quantity) CartItem
        +removeFromCart(userId, productId) void
        +clearCart(userId) void
    }

    class OrderService {
        +getOrdersByUser(userId) Order[]
        +getOrderById(id) Order
        +getAllOrders() Order[]
        +createOrder(userId, address) Order
        +updateStatus(id, status) Order
    }

    ProductService --> ProductRepository
    CartService --> CartRepository
    OrderService --> OrderRepository
```
