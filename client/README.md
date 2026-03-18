# CardShop — Frontend

Interface web do CardShop, construída com **Next.js 16**, **React 19**, **TypeScript** e **CSS Modules**.

## Como executar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (porta 3001)
npm run dev

# Build de produção
npm run build
```

> O backend deve estar rodando em `http://localhost:3000`. O proxy em `next.config.ts` redireciona `/api/:path*` automaticamente.

## Estrutura de pastas

```
client/
├── src/
│   ├── app/              # Páginas (App Router)
│   │   ├── (main)/       # Layout principal (Navbar, Footer, AnnouncementBar)
│   │   ├── (auth)/       # Layout de login/registro (simplificado)
│   │   └── (admin)/      # Layout do painel admin (AdminSidebar)
│   ├── components/       # Componentes organizados por feature
│   ├── contexts/         # AuthContext, CartContext, SearchContext
│   └── lib/              # api.ts, types.ts, constants.ts, utils.ts
├── public/               # Imagens e arquivos estáticos
└── package.json
```
