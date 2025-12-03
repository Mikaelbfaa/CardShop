# CardShop

O CardShop é uma plataforma de e-commerce voltada para o comércio de cartas colecionáveis de Trading Card Games (TCG), com foco inicial em Yu-Gi-Oh! e Magic: The Gathering.

---

## Autores

- Mikael Brasileiro Ferreira de Almeida Amaral
- Ana Kethylen Sousa Fernandes

## Visão Geral

O sistema permite que usuários naveguem por um catálogo de cartas, adicionem produtos ao carrinho de compras e finalizem pedidos. Administradores podem gerenciar o catálogo de produtos e acompanhar/atualizar o status dos pedidos.

### Principais Funcionalidades

- **Catálogo de Produtos**: Listagem e busca de cartas com filtros por jogo e tipo
- **Carrinho de Compras**: Adicionar, atualizar e remover itens
- **Pedidos**: Finalização de compras e acompanhamento de status
- **Administração**: Gerenciamento de produtos e pedidos

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Backend** | Node.js + Express 5 + TypeScript |
| **Banco de Dados** | PostgreSQL |
| **ORM** | Prisma 7 com @prisma/adapter-pg |
| **Documentação API** | Swagger (OpenAPI 3.0) |
| **Frontend** | React (planejado) |
| **Autenticação** | JWT (planejado) |

## Estrutura de Diretórios

```
CardShop/
├── prisma/
│   ├── schema.prisma          # Definição do banco de dados
│   ├── seed.ts                # Script de seed do banco
│   └── migrations/            # Histórico de migrações
│
├── src/
│   ├── server.ts              # Ponto de entrada da aplicação
│   ├── app.ts                 # Configuração do Express e middlewares
│   │
│   ├── config/
│   │   ├── server.ts          # Configurações (porta, JWT)
│   │   └── swagger.ts         # Configuração do Swagger
│   │
│   ├── database/
│   │   └── prisma.ts          # Instância do Prisma Client
│   │
│   ├── models/
│   │   └── product.ts         # DTOs e tipos
│   │
│   ├── controllers/
│   │   ├── product.ts         # Controller de produtos
│   │   ├── product_routes.ts  # Rotas de produtos
│   │   ├── cart.ts            # Controller do carrinho
│   │   ├── cart_routes.ts     # Rotas do carrinho
│   │   ├── order.ts           # Controller de pedidos
│   │   ├── order_routes.ts    # Rotas de pedidos (usuário)
│   │   └── admin_order_routes.ts  # Rotas de pedidos (admin)
│   │
│   ├── services/
│   │   ├── product.ts         # Lógica de negócio de produtos
│   │   ├── cart.ts            # Lógica de negócio do carrinho
│   │   └── order.ts           # Lógica de negócio de pedidos
│   │
│   ├── repository/
│   │   ├── product.ts         # Acesso a dados de produtos
│   │   ├── cart.ts            # Acesso a dados do carrinho
│   │   └── order.ts           # Acesso a dados de pedidos
│   │
│   └── middleware/
│       ├── auth.ts            # Middleware de autenticação
│       └── validation.ts      # Middleware de validação
│
├── scripts/
│   ├── test-api.sh            # Script de teste (Bash)
│   └── test-api.ps1           # Script de teste (PowerShell)
│
├── docs/
│   └── DIAGRAMAS.md           # Diagramas do sistema (Mermaid)
│
├── diagrams/
│   └── Diagrama Entidade Relacionamento.png
│
├── public/                    # Arquivos estáticos
├── client/                    # Frontend React (planejado)
├── tests/                     # Testes automatizados
│
├── REQUISITOS.md              # Documentação de requisitos
├── ARQUITETURA.md             # Documentação de arquitetura
├── CLAUDE.md                  # Instruções para Claude Code
└── package.json
```

---

## Fluxo de Requisição

A aplicação segue uma **arquitetura em camadas (N-Tier)**:

![Fluxo de Requisição](diagrams/fluxograma.png)

### Exemplo de Fluxo: Criar Pedido

1. **Cliente** envia `POST /api/orders` com `{ userId, shippingAddress }`
2. **Routes** direciona para `orderController.createOrder`
3. **Controller** extrai dados e chama `orderService.createOrder()`
4. **Service** valida regras de negócio:
   - Verifica se o carrinho existe e tem itens
   - Valida estoque dos produtos
   - Calcula preço total
5. **Repository** executa transação no banco:
   - Cria o pedido e itens
   - Atualiza estoque dos produtos
   - Limpa o carrinho
6. **Response** retorna o pedido criado com status 201

---

## Diagrama Entidade Relacionamento

![Diagrama Entidade Relacionamento](diagrams/Diagrama%20Entidade%20Relacionamento.png)

### Entidades Principais

| Entidade | Descrição |
|----------|-----------|
| **User** | Usuários do sistema (clientes e administradores) |
| **Product** | Cartas disponíveis para venda |
| **Cart** | Carrinho de compras (um por usuário) |
| **CartItem** | Itens no carrinho |
| **Order** | Pedidos finalizados |
| **OrderItem** | Itens de um pedido |

### Enumerações

| Enum | Valores |
|------|---------|
| **Role** | `CUSTOMER`, `ADMIN` |
| **Game** | `mtg`, `yugioh` |
| **CardType** | Yu-Gi-Oh!: `MONSTER`, `SPELL`, `TRAP` / MTG: `CREATURE`, `INSTANT`, `SORCERY`, `ENCHANTMENT`, `ARTIFACT`, `LAND`, `PLANESWALKER` |
| **OrderStatus** | `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |

---

## Rotas da API

### Produtos (`/api/products`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products` | Listar produtos (filtros: `?game=`, `?cardType=`) |
| GET | `/api/products/:id` | Buscar produto por ID |
| POST | `/api/products` | Criar produto |
| PUT | `/api/products/:id` | Atualizar produto |
| DELETE | `/api/products/:id` | Deletar produto |

### Carrinho (`/api/cart`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/cart?userId=` | Visualizar carrinho |
| POST | `/api/cart/items` | Adicionar item |
| PUT | `/api/cart/items/:productId?userId=` | Atualizar quantidade |
| DELETE | `/api/cart/items/:productId?userId=` | Remover item |
| DELETE | `/api/cart?userId=` | Limpar carrinho |

### Pedidos (`/api/orders`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/orders?userId=` | Listar pedidos do usuário |
| GET | `/api/orders/:id` | Buscar pedido por ID |
| POST | `/api/orders` | Criar pedido |

### Admin (`/api/admin/orders`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/orders` | Listar todos os pedidos |
| PATCH | `/api/admin/orders/:id/status` | Atualizar status |

### Documentação Interativa

Acesse a documentação Swagger em: `http://localhost:3000/api-docs`

---

## Requisitos do Sistema

### Requisitos Funcionais

#### Gerenciamento de Usuários

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF01 | Cadastro de usuário | Alta |
| RF02 | Login de usuário | Alta |
| RF03 | Logout | Média |
| RF04 | Níveis de acesso (CUSTOMER/ADMIN) | Alta |
| RF05 | Visualizar perfil | Média |
| RF06 | Editar perfil | Média |

#### Gerenciamento de Produtos

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF07 | Listar produtos | Alta |
| RF08 | Visualizar detalhes do produto | Alta |
| RF09 | Filtrar produtos por jogo e tipo | Média |
| RF10 | Cadastrar produto (Admin) | Alta |
| RF11 | Editar produto (Admin) | Alta |
| RF12 | Remover produto (Admin) | Média |

#### Carrinho de Compras

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF13 | Adicionar ao carrinho | Alta |
| RF14 | Visualizar carrinho | Alta |
| RF15 | Atualizar quantidade | Alta |
| RF16 | Remover do carrinho | Alta |
| RF17 | Limpar carrinho | Baixa |

#### Gerenciamento de Pedidos

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF18 | Finalizar pedido | Alta |
| RF19 | Visualizar pedidos | Alta |
| RF20 | Visualizar detalhes do pedido | Alta |
| RF21 | Listar todos os pedidos (Admin) | Alta |
| RF22 | Atualizar status do pedido (Admin) | Média |

### Requisitos Não Funcionais

| Categoria | ID | Requisito |
|-----------|-----|-----------|
| Segurança | RNF01 | Autenticação JWT |
| Segurança | RNF02 | Criptografia de senhas |
| Segurança | RNF03 | Validação de entradas |
| Segurança | RNF04 | Autorização por rotas |
| Desempenho | RNF06 | Páginas carregam em até 3s |
| Desempenho | RNF07 | API responde em até 1s |
| Usabilidade | RNF09 | Interface responsiva |
| Usabilidade | RNF10 | Mensagens de erro em português |
| Escalabilidade | RNF13 | Arquitetura modular (MVC) |
| Escalabilidade | RNF14 | PostgreSQL |
| Escalabilidade | RNF15 | API REST stateless |
| Manutenibilidade | RNF16 | Código TypeScript |
| Manutenibilidade | RNF19 | Documentação da API |

### Regras de Negócio

| ID | Regra |
|----|-------|
| RN01 | Produto só pode ser adicionado ao carrinho se houver estoque |
| RN02 | Quantidade mínima no carrinho é 1 |
| RN03 | Apenas usuários autenticados podem finalizar pedidos |
| RN04 | Cada usuário possui apenas um carrinho ativo |
| RN05 | Apenas administradores podem alterar status de pedidos |
| RN06 | Preço do pedido é calculado na finalização e não pode ser alterado |
| RN07 | Tipo de carta deve ser compatível com o jogo (Yu-Gi-Oh! ou MTG) |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/CardShop.git
cd CardShop

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações de banco

# Gerar Prisma Client e aplicar schema
npm run db:push

# Popular banco com dados iniciais
npm run db:seed
```

### Executar

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build
npm start
```

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Compila TypeScript |
| `npm start` | Executa versão compilada |
| `npm run db:push` | Aplica schema ao banco |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:seed` | Popula banco com dados iniciais |
| `npm run db:studio` | Abre Prisma Studio (GUI) |

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
