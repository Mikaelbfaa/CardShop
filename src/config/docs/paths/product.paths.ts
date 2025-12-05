import { OpenAPIV3 } from 'openapi-types';

export const productPaths: OpenAPIV3.PathsObject = {
    '/api/products': {
        get: {
            tags: ['Products'],
            summary: 'Listar produtos',
            description:
                'Retorna a lista de todos os produtos cadastrados no sistema. Permite filtrar por jogo (mtg ou yugioh) e tipo de carta.',
            parameters: [
                {
                    name: 'game',
                    in: 'query',
                    description: 'Filtrar por jogo de cartas',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['mtg', 'yugioh'],
                    },
                },
                {
                    name: 'cardType',
                    in: 'query',
                    description:
                        'Filtrar por tipo de carta (Yu-Gi-Oh!: MONSTER, SPELL, TRAP / MTG: CREATURE, INSTANT, SORCERY, etc.)',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Lista de produtos retornada com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    count: { type: 'integer', description: 'Quantidade de produtos' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Product' },
                                    },
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
            tags: ['Products'],
            summary: 'Criar produto',
            description:
                'Cria um novo produto (carta) no catálogo. O tipo de carta deve ser compatível com o jogo selecionado.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateProduct' },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Produto criado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Dados de entrada inválidos (campos obrigatórios, valores negativos, tipo de carta incompatível)',
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
    '/api/products/{id}': {
        get: {
            tags: ['Products'],
            summary: 'Buscar produto por ID',
            description: 'Retorna os dados de um produto específico pelo seu ID.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID do produto',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Produto encontrado',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    data: { $ref: '#/components/schemas/Product' },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Produto não encontrado',
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
        put: {
            tags: ['Products'],
            summary: 'Atualizar produto',
            description:
                'Atualiza os dados de um produto existente. Todos os campos são opcionais, apenas os fornecidos serão atualizados.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID do produto',
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
                        schema: { $ref: '#/components/schemas/UpdateProduct' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Produto atualizado com sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean' },
                                    message: { type: 'string' },
                                    data: { $ref: '#/components/schemas/Product' },
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
                '404': {
                    description: 'Produto não encontrado',
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
            tags: ['Products'],
            summary: 'Deletar produto',
            description:
                'Remove um produto do catálogo. Não é possível deletar produtos que estão em carrinhos ou pedidos.',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID do produto',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Produto deletado com sucesso',
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
                    description: 'Produto não encontrado',
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
                    description: 'Conflito - Produto está em uso (carrinho ou pedido)',
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
