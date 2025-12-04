import prisma from '../database/prisma';
import { OrderStatus, Prisma } from '@prisma/client';

/**
 * Interface para filtros de busca de pedidos.
 */
export interface OrderFilters {
    userId?: number;
    status?: OrderStatus;
}

/**
 * DTO para criação de item do pedido.
 */
export interface CreateOrderItemDTO {
    productId: number;
    quantity: number;
    unitPrice: number;
}

/**
 * DTO para criação de pedido.
 */
export interface CreateOrderDTO {
    userId: number;
    shippingAddress: string;
    totalPrice: number;
    items: CreateOrderItemDTO[];
}

/**
 * Tipo de pedido com itens e produtos incluídos.
 */
export type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

/**
 * Repository de Pedidos.
 * Camada responsável pelo acesso direto aos dados via Prisma.
 */
class OrderRepository {
    /**
     * Buscar todos os pedidos com filtros opcionais.
     * @param filters - Filtros de busca (userId, status).
     * @returns Lista de pedidos com itens.
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
     * Buscar pedido por ID.
     * @param id - ID do pedido.
     * @returns Pedido com itens ou null se não encontrado.
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
     * Buscar pedidos de um usuário.
     * @param userId - ID do usuário.
     * @returns Lista de pedidos do usuário.
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
     * Criar pedido com itens.
     * @param data - Dados do pedido a ser criado.
     * @returns Pedido criado com itens.
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
     * Atualizar status do pedido.
     * @param id - ID do pedido.
     * @param status - Novo status do pedido.
     * @returns Pedido atualizado ou null se não encontrado.
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

    /**
     * Deletar pedido (cascade deleta order_items).
     * @param id - ID do pedido.
     */
    async delete(id: number): Promise<void> {
        await prisma.order.delete({
            where: { id },
        });
    }
}

export default new OrderRepository();
