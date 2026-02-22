import orderRepository, { OrderFilters, OrderWithItems } from '../repository/order';
import cartRepository from '../repository/cart';
import prisma from '../database/prisma';
import { OrderStatus } from '@prisma/client';

/**
 * Mapa de transições de status válidas.
 * Define quais status podem ser alcançados a partir de cada status atual.
 */
const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

/**
 * Service de Pedidos.
 * Camada responsável pela lógica de negócio e validações.
 */
class OrderService {
    /**
     * Listar todos os pedidos (admin).
     * @param filters - Filtros opcionais (status).
     * @returns Lista de pedidos.
     */
    async getAllOrders(filters: OrderFilters = {}): Promise<OrderWithItems[]> {
        try {
            return await orderRepository.findAll(filters);
        } catch (error) {
            throw new Error(`Erro ao buscar pedidos: ${(error as Error).message}`);
        }
    }

    /**
     * Buscar pedido por ID.
     * @param orderId - ID do pedido.
     * @returns Pedido encontrado ou null.
     */
    async getOrderById(orderId: number): Promise<OrderWithItems | null> {
        try {
            // Validação de parâmetro obrigatório
            if (!orderId) {
                throw new Error('orderId é obrigatório');
            }

            return await orderRepository.findById(orderId);
        } catch (error) {
            throw new Error(`Erro ao buscar pedido: ${(error as Error).message}`);
        }
    }

    /**
     * Listar pedidos de um usuário.
     * @param userId - ID do usuário.
     * @returns Lista de pedidos do usuário.
     * @throws Error se o usuário não existir.
     */
    async getOrdersByUser(userId: number): Promise<OrderWithItems[]> {
        try {
            // Validação de parâmetro obrigatório
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            // Acesso direto ao Prisma (bypassa UserRepository) para verificação de existência
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
     * Criar pedido a partir do carrinho.
     * Valida estoque, cria pedido, decrementa estoque e limpa carrinho.
     * @param userId - ID do usuário.
     * @param shippingAddress - Endereço de entrega.
     * @returns Pedido criado.
     * @throws Error se carrinho vazio ou estoque insuficiente.
     */
    async createOrder(userId: number, shippingAddress: string): Promise<OrderWithItems> {
        try {
            // Validação de parâmetros obrigatórios
            if (!userId) {
                throw new Error('userId é obrigatório');
            }

            // Rejeita string vazia ou composta apenas de espaços
            if (!shippingAddress || shippingAddress.trim() === '') {
                throw new Error('Endereço de entrega é obrigatório');
            }

            // Verifica se o usuário existe no banco antes de prosseguir
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Não permite criar pedido se o carrinho estiver vazio ou não existir
            const cart = await cartRepository.findByUserId(userId);
            if (!cart || cart.items.length === 0) {
                throw new Error('Carrinho está vazio');
            }

            // Pré-validação de estoque antes de iniciar a transação (evita lock desnecessário)
            for (const item of cart.items) {
                if (item.quantity > item.product.stock) {
                    throw new Error(
                        `Estoque insuficiente para "${item.product.name}". Disponível: ${item.product.stock}`
                    );
                }
            }

            // Calcula total convertendo Decimal (Prisma) para number com Number()
            const totalPrice = cart.items.reduce((sum, item) => {
                return sum + Number(item.product.price) * item.quantity;
            }, 0);

            // Transação atômica: criar pedido + decrementar estoque + limpar carrinho
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

                // Remove apenas os itens do carrinho, não o carrinho em si (será reutilizado)
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
     * Atualizar status do pedido.
     * Valida transições de status permitidas.
     * @param orderId - ID do pedido.
     * @param status - Novo status do pedido.
     * @returns Pedido atualizado.
     * @throws Error se transição de status inválida.
     */
    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderWithItems> {
        try {
            // Validação de parâmetros obrigatórios
            if (!orderId) {
                throw new Error('orderId é obrigatório');
            }

            if (!status) {
                throw new Error('status é obrigatório');
            }

            // Primeiro valida se o status é um valor válido do enum OrderStatus
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

            // Depois valida a máquina de estados: verifica se a transição é permitida
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

    /**
     * Deletar pedido (admin).
     * @param orderId - ID do pedido.
     * @returns True se deletado, false se não encontrado.
     */
    async deleteOrder(orderId: number): Promise<boolean> {
        try {
            // Validação de parâmetro obrigatório
            if (!orderId) {
                throw new Error('orderId é obrigatório');
            }

            // Retorna false ao invés de lançar erro quando não encontrado (padrão do controller)
            const order = await orderRepository.findById(orderId);
            if (!order) {
                return false;
            }

            await orderRepository.delete(orderId);
            return true;
        } catch (error) {
            throw new Error(`Erro ao deletar pedido: ${(error as Error).message}`);
        }
    }
}

export default new OrderService();
