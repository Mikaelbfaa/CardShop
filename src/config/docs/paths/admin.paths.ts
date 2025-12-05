import { OpenAPIV3 } from 'openapi-types';

export const adminPaths: OpenAPIV3.PathsObject = {
    '/api/admin/orders': {
        get: {
            tags: ['Admin'],
            summary: 'Listar todos os pedidos',
            description:
                'Retorna todos os pedidos do sistema. Endpoint exclusivo para administradores. Permite filtrar por status.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'status',
                    in: 'query',
                    description: 'Filtrar por status do pedido',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
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
                '401': {
                    description: 'Token de autenticação inválido ou ausente',
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
                '403': {
                    description: 'Acesso negado - Apenas administradores',
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
    '/api/admin/orders/{id}/status': {
        patch: {
            tags: ['Admin'],
            summary: 'Atualizar status',
            description:
                'Atualiza o status de um pedido. Endpoint exclusivo para administradores.',
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
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateOrderStatus' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Status atualizado com sucesso',
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
                    description: 'Dados inválidos (ID ou status)',
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
                '401': {
                    description: 'Token de autenticação inválido ou ausente',
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
                '403': {
                    description: 'Acesso negado - Apenas administradores',
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
    '/api/admin/orders/{id}': {
        delete: {
            tags: ['Admin'],
            summary: 'Deletar pedido',
            description: 'Remove um pedido do sistema. Endpoint exclusivo para administradores.',
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
                    description: 'Pedido deletado com sucesso',
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
                '401': {
                    description: 'Token de autenticação inválido ou ausente',
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
                '403': {
                    description: 'Acesso negado - Apenas administradores',
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
    '/api/admin/users/{id}': {
        delete: {
            tags: ['Admin'],
            summary: 'Deletar usuário',
            description: 'Remove um usuário do sistema. Endpoint exclusivo para administradores.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID do usuário',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Usuário deletado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            name: { type: 'string' },
                                            email: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'ID de usuário inválido',
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
                '401': {
                    description: 'Token de autenticação inválido ou ausente',
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
                '403': {
                    description: 'Acesso negado - Apenas administradores',
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
                    description: 'Usuário não encontrado',
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
