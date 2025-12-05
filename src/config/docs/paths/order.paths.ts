import { OpenAPIV3 } from 'openapi-types';

export const orderPaths: OpenAPIV3.PathsObject = {
    '/api/orders': {
        get: {
            tags: ['Orders'],
            summary: 'Listar pedidos do usuário',
            description: 'Retorna todos os pedidos de um usuário específico, incluindo itens e produtos.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'userId',
                    in: 'query',
                    description: 'ID do usuário',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Lista de pedidos retornada com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    count: { type: 'integer', description: 'Quantidade de pedidos' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Order' },
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'userId é obrigatório',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string' },
                                            status: { type: 'integer' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        post: {
            tags: ['Orders'],
            summary: 'Criar pedido',
            description:
                'Cria um novo pedido a partir dos itens no carrinho do usuário. O carrinho é esvaziado após a criação do pedido e o estoque dos produtos é decrementado.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateOrder' },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Pedido criado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Order' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados inválidos (userId ou shippingAddress obrigatórios, carrinho vazio)',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Carrinho não encontrado ou produto sem estoque suficiente',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string' },
                                            status: { type: 'integer' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/orders/{id}': {
        get: {
            tags: ['Orders'],
            summary: 'Buscar pedido por ID',
            description: 'Retorna os detalhes de um pedido específico, incluindo todos os itens e produtos.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID do pedido',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Pedido encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    data: { $ref: '#/components/schemas/Order' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'ID do pedido inválido',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Pedido não encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Erro interno do servidor',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'object',
                                        properties: {
                                            message: { type: 'string' },
                                            status: { type: 'integer' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
