import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CardShop API',
            version: '1.0.0',
            description:
                'API REST para e-commerce de cartas colecionáveis (Yugioh e Magic the Gathering)',
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
        ],
        components: {
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Dark Magician' },
                        description: { type: 'string', example: 'O mago definitivo' },
                        price: { type: 'number', format: 'decimal', example: 45.9 },
                        stock: { type: 'integer', example: 10 },
                        game: { type: 'string', enum: ['mtg', 'yugioh'], example: 'yugioh' },
                        cardType: {
                            type: 'string',
                            enum: [
                                'MONSTER',
                                'SPELL',
                                'TRAP',
                                'CREATURE',
                                'INSTANT',
                                'SORCERY',
                                'ENCHANTMENT',
                                'ARTIFACT',
                                'LAND',
                                'PLANESWALKER',
                            ],
                            example: 'MONSTER',
                        },
                        rarity: { type: 'string', example: 'Ultra Rare' },
                        image: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateProduct: {
                    type: 'object',
                    required: ['name', 'price', 'stock', 'game'],
                    properties: {
                        name: { type: 'string', example: 'Dark Magician' },
                        description: { type: 'string', example: 'O mago definitivo' },
                        price: { type: 'number', example: 45.9 },
                        stock: { type: 'integer', example: 10 },
                        game: { type: 'string', enum: ['mtg', 'yugioh'], example: 'yugioh' },
                        cardType: {
                            type: 'string',
                            enum: [
                                'MONSTER',
                                'SPELL',
                                'TRAP',
                                'CREATURE',
                                'INSTANT',
                                'SORCERY',
                                'ENCHANTMENT',
                                'ARTIFACT',
                                'LAND',
                                'PLANESWALKER',
                            ],
                            example: 'MONSTER',
                        },
                        rarity: { type: 'string', example: 'Ultra Rare' },
                        image: { type: 'string' },
                    },
                },
                Cart: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/CartItem' },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CartItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        productId: { type: 'integer', example: 1 },
                        quantity: { type: 'integer', example: 2 },
                        product: { $ref: '#/components/schemas/Product' },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        totalPrice: { type: 'number', format: 'decimal', example: 150.5 },
                        status: {
                            type: 'string',
                            enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
                            example: 'PENDING',
                        },
                        shippingAddress: {
                            type: 'string',
                            example: 'Rua das Flores, 123 - São Paulo, SP',
                        },
                        items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/OrderItem' },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                OrderItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        productId: { type: 'integer', example: 1 },
                        quantity: { type: 'integer', example: 2 },
                        unitPrice: { type: 'number', format: 'decimal', example: 45.9 },
                        product: { $ref: '#/components/schemas/Product' },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' },
                        message: { type: 'string' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Erro ao processar requisição' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
