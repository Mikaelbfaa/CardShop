import { OpenAPIV3 } from 'openapi-types';

export const cartPaths: OpenAPIV3.PathsObject = {
    '/api/cart': {
        get: {
            tags: ['Cart'],
            summary: 'Ver carrinho',
            description:
                'Retorna o carrinho de compras do usuário com todos os itens e informações dos produtos.',
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
                    description: 'Carrinho retornado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    data: { $ref: '#/components/schemas/Cart' },
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
                '404': {
                    description: 'Carrinho não encontrado',
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
        delete: {
            tags: ['Cart'],
            summary: 'Limpar carrinho',
            description: 'Remove todos os itens do carrinho do usuário.',
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
                    description: 'Carrinho limpo com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Cart' },
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
                '404': {
                    description: 'Carrinho não encontrado',
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
    '/api/cart/items': {
        post: {
            tags: ['Cart'],
            summary: 'Adicionar item',
            description:
                'Adiciona um produto ao carrinho do usuário. Se o produto já existir no carrinho, a quantidade é incrementada.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AddCartItem' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Item adicionado ao carrinho',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Cart' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados de entrada inválidos (userId ou productId obrigatório)',
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
                    description: 'Produto não encontrado ou sem estoque',
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
    '/api/cart/items/{productId}': {
        put: {
            tags: ['Cart'],
            summary: 'Atualizar quantidade',
            description: 'Atualiza a quantidade de um item específico no carrinho.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'productId',
                    in: 'path',
                    description: 'ID do produto no carrinho',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
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
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateCartItem' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Quantidade atualizada com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Cart' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados inválidos (userId, productId ou quantidade mínima)',
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
                    description: 'Item não encontrado no carrinho',
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
        delete: {
            tags: ['Cart'],
            summary: 'Remover item',
            description: 'Remove um item específico do carrinho.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'productId',
                    in: 'path',
                    description: 'ID do produto a remover',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
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
                    description: 'Item removido do carrinho',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Cart' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados inválidos (userId ou productId)',
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
                    description: 'Item não encontrado no carrinho',
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
