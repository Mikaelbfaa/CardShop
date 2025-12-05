import { OpenAPIV3 } from 'openapi-types';

const OrderStatusEnum: OpenAPIV3.SchemaObject = {
    type: 'string',
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    description:
        'Status do pedido: PENDING (aguardando), PROCESSING (processando), SHIPPED (enviado), DELIVERED (entregue), CANCELLED (cancelado)',
};

export const OrderItem: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID único do item do pedido',
        },
        productId: {
            type: 'integer',
            description: 'ID do produto',
        },
        quantity: {
            type: 'integer',
            description: 'Quantidade do item',
        },
        unitPrice: {
            type: 'number',
            format: 'decimal',
            description: 'Preço unitário no momento da compra',
        },
        product: {
            $ref: '#/components/schemas/Product',
        },
    },
    required: ['id', 'productId', 'quantity', 'unitPrice'],
};

export const Order: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'ID único do pedido',
        },
        userId: {
            type: 'integer',
            description: 'ID do usuário que fez o pedido',
        },
        totalPrice: {
            type: 'number',
            format: 'decimal',
            description: 'Preço total do pedido',
        },
        status: {
            ...OrderStatusEnum,
        },
        shippingAddress: {
            type: 'string',
            description: 'Endereço de entrega',
        },
        items: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/OrderItem',
            },
            description: 'Lista de itens do pedido',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criação do pedido',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última atualização',
        },
    },
    required: ['id', 'userId', 'totalPrice', 'status', 'shippingAddress', 'items'],
};

export const CreateOrder: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        userId: {
            type: 'integer',
            description: 'ID do usuário que está criando o pedido',
        },
        shippingAddress: {
            type: 'string',
            description: 'Endereço de entrega do pedido',
        },
    },
    required: ['userId', 'shippingAddress'],
};

export const UpdateOrderStatus: OpenAPIV3.SchemaObject = {
    type: 'object',
    properties: {
        status: {
            ...OrderStatusEnum,
        },
    },
    required: ['status'],
};

export const orderSchemas = {
    Order,
    OrderItem,
    CreateOrder,
    UpdateOrderStatus,
};
