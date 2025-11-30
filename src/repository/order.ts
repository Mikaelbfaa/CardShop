import prisma from '../database/prisma';
import { OrderStatus, Prisma } from '@prisma/client';

export interface OrderFilters {
    userId?: number;
    status?: OrderStatus;
}

export interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
    unitPrice: number;
}

export interface CreateOrderDTO {
    userId: number;
    shippingAddress: string;
    totalPrice: number;
    items: CreateOrderItemDTO[];
}

export type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

class OrderRepository {
    /**
     * Buscar todos os pedidos com filtros opcionais
     */
    async findAll(filters: OrderFilters = {}): Promise<OrderWithItems[]> {
        const where: Prisma.OrderWhereInput = {};

        if (filters.userId) {
            where.userId = filters.userId;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Buscar pedido por ID
     */
    async findById(id: number): Promise<OrderWithItems | null> {
        return prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    /**
     * Buscar pedidos de um usuário
     */
    async findByUserId(userId: number): Promise<OrderWithItems[]> {
        return prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Criar pedido com itens (usando transação)
     */
    async create(data: CreateOrderDTO): Promise<OrderWithItems> {
        return prisma.order.create({
            data: {
                userId: data.userId,
                shippingAddress: data.shippingAddress,
                totalPrice: new Prisma.Decimal(data.totalPrice),
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: new Prisma.Decimal(item.unitPrice),
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    /**
     * Atualizar status do pedido
     */
    async updateStatus(id: number, status: OrderStatus): Promise<OrderWithItems | null> {
        const existingOrder = await prisma.order.findUnique({ where: { id } });

        if (!existingOrder) {
            return null;
        }

        return prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
}

export default new OrderRepository();
