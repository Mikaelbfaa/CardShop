import orderRepository, { OrderFilters, OrderWithItems } from '../repository/order';
import cartRepository from '../repository/cart';
import prisma from '../database/prisma';
import { OrderStatus } from '@prisma/client';

const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

class OrderService {
    /**
     * Listar todos os pedidos (admin)
     */
    async getAllOrders(filters: OrderFilters = {}): Promise<OrderWithItems[]> {
        try {
            return await orderRepository.findAll(filters);
        } catch (error) {
            throw new Error(`Erro ao buscar pedidos: ${(error as Error).message}`);
        }
    }

    /**
     * Buscar pedido por ID
     */
    async getOrderById(orderId: number): Promise<OrderWithItems | null> {
        try {
            if (!orderId) {
                throw new Error('orderId é obrigatório');
            }

            return await orderRepository.findById(orderId);
        } catch (error) {
            throw new Error(`Erro ao buscar pedido: ${(error as Error).message}`);
        }
    }

    /**
     * Listar pedidos de um usuário
     */
    async getOrdersByUser(userId: number): Promise<OrderWithItems[]> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return await orderRepository.findByUserId(userId);
        } catch (error) {
            throw new Error(`Erro ao buscar pedidos: ${(error as Error).message}`);
        }
    }

    /**
     * Criar pedido a partir do carrinho (RF16, RN06)
     */
    async createOrder(userId: number, shippingAddress: string): Promise<OrderWithItems> {
        try {
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            if (!shippingAddress || shippingAddress.trim() === '') {
                throw new Error('Endereço de entrega é obrigatório');
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const cart = await cartRepository.findByUserId(userId);
            if (!cart || cart.items.length === 0) {
                throw new Error('Carrinho está vazio');
            }

            for (const item of cart.items) {
                if (item.quantity > item.product.stock) {
                    throw new Error(
                        `Estoque insuficiente para "${item.product.name}". Disponível: ${item.product.stock}`
                    );
                }
            }

            const totalPrice = cart.items.reduce((sum, item) => {
                return sum + Number(item.product.price) * item.quantity;
            }, 0);

            const order = await prisma.$transaction(async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        userId,
                        shippingAddress: shippingAddress.trim(),
                        totalPrice,
                        items: {
                            create: cart.items.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: item.product.price,
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

                for (const item of cart.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }

                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id },
                });

                return newOrder;
            });

            return order;
        } catch (error) {
            throw new Error(`Erro ao criar pedido: ${(error as Error).message}`);
        }
    }

    /**
     * Atualizar status do pedido (RF20)
     */
    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderWithItems> {
        try {
            if (!orderId) {
                throw new Error('orderId é obrigatório');
            }

            if (!status) {
                throw new Error('status é obrigatório');
            }

            const validStatuses: OrderStatus[] = [
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
            ];
            if (!validStatuses.includes(status)) {
                throw new Error(`Status inválido. Opções: ${validStatuses.join(', ')}`);
            }

            const order = await orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Pedido não encontrado');
            }

            const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status];
            if (!allowedTransitions.includes(status)) {
                throw new Error(
                    `Transição inválida: ${order.status} → ${status}. Permitidas: ${allowedTransitions.join(', ') || 'nenhuma'}`
                );
            }

            const updatedOrder = await orderRepository.updateStatus(orderId, status);
            if (!updatedOrder) {
                throw new Error('Erro ao atualizar pedido');
            }

            return updatedOrder;
        } catch (error) {
            throw new Error(`Erro ao atualizar status: ${(error as Error).message}`);
        }
    }
}

export default new OrderService();
