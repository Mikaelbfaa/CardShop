import swaggerJsdoc from 'swagger-jsdoc';
import { components, paths } from './docs';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CardShop API',
            version: '1.0.0',
            description:
                'API REST para e-commerce de cartas colecionáveis (Yu-Gi-Oh! e Magic: The Gathering)',
            contact: {
                name: 'CardShop',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento',
            },
        ],
        tags: [
            { name: 'Products', description: 'Gerenciamento de produtos (cartas)' },
            { name: 'Cart', description: 'Carrinho de compras' },
            { name: 'Orders', description: 'Pedidos do usuário' },
            { name: 'Admin', description: 'Operações administrativas' },
            { name: 'Users', description: 'Autenticação e gerenciamento de usuários' },
        ],
        components,
        paths,
    },
    apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
