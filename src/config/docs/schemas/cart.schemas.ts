import { OpenAPIV3 } from 'openapi-types';

export const CartItem: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID único do item no carrinho',
        },
        productId: {
            type: 'integer',
            description: 'ID do produto',
        },
        quantity: {
            type: 'integer',
            description: 'Quantidade do item no carrinho',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de adição ao carrinho',
        },
        product: {
            $ref: '#/components/schemas/Product',
        },
    },
    required: ['id', 'productId', 'quantity'],
};

export const Cart: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID único do carrinho',
        },
        userId: {
            type: 'integer',
            description: 'ID do usuário dono do carrinho',
        },
        items: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/CartItem',
            },
            description: 'Lista de itens no carrinho',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do carrinho',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização',
        },
    },
    required: ['id', 'userId', 'items'],
};

export const AddCartItem: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        userId: {
            type: 'integer',
            description: 'ID do usuário',
        },
        productId: {
            type: 'integer',
            description: 'ID do produto a adicionar',
        },
        quantity: {
            type: 'integer',
            description: 'Quantidade a adicionar (padrão: 1)',
            default: 1,
        },
    },
    required: ['userId', 'productId'],
};

export const UpdateCartItem: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        quantity: {
            type: 'integer',
            minimum: 1,
            description: 'Nova quantidade do item (mínimo: 1)',
        },
    },
    required: ['quantity'],
};

export const cartSchemas = {
    Cart,
    CartItem,
    AddCartItem,
    UpdateCartItem,
};
