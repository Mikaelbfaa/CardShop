import { OpenAPIV3 } from 'openapi-types';

export const userPaths: OpenAPIV3.PathsObject = {
    '/api/users/register': {
        post: {
            tags: ['Users'],
            summary: 'Registrar usuário',
            description:
                'Cria uma nova conta de usuário no sistema. O e-mail e CPF devem ser únicos.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateUser' },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Usuário cadastrado com sucesso',
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
                                            cpf: { type: 'string' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados de entrada inválidos (campos obrigatórios)',
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
                '409': {
                    description: 'Conflito - E-mail ou CPF já registrado',
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
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/users/login': {
        post: {
            tags: ['Users'],
            summary: 'Login',
            description:
                'Autentica o usuário e retorna um token JWT para acesso às rotas protegidas.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginRequest' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Login realizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    data: { $ref: '#/components/schemas/LoginResponse' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados de entrada inválidos',
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
                    description: 'Credenciais inválidas',
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
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/users/profile': {
        get: {
            tags: ['Users'],
            summary: 'Ver perfil',
            description: 'Retorna os dados do perfil do usuário autenticado.',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Perfil retornado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    data: { $ref: '#/components/schemas/User' },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Usuário não autenticado',
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
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
        patch: {
            tags: ['Users'],
            summary: 'Atualizar perfil',
            description:
                'Atualiza os dados do perfil do usuário autenticado. Todos os campos são opcionais.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateUser' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Perfil atualizado com sucesso',
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
                    description: 'Dados de entrada inválidos',
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
                    description: 'Usuário não autenticado',
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
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/users/logout': {
        post: {
            tags: ['Users'],
            summary: 'Logout',
            description:
                'Realiza o logout do usuário. O token JWT deve ser invalidado no cliente.',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Logout realizado com sucesso',
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
                    description: 'Usuário não autenticado',
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
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
