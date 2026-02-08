import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import orderService from '../services/order';
import { OrderStatus } from '@prisma/client';

function resolveUserId(req: AuthenticatedRequest, source: 'query' | 'body'): number | null {
    const tokenUserId = req.userId!;
    const tokenRole = req.userRole;
    const paramUserId =
        source === 'query' ? parseInt(req.query.userId as string) : parseInt(req.body.userId);

    // No explicit userId provided, or same as token → use own
    if (!paramUserId || isNaN(paramUserId) || paramUserId === tokenUserId) {
        return tokenUserId;
    }
    // Different userId provided → admin only
    if (tokenRole === 'ADMIN') {
        return paramUserId;
    }
    // Non-admin trying to access another user's orders
    return null;
}

/**
 * Controller de Pedidos.
 * Camada responsável por receber requisições HTTP,
 * validar dados de entrada e retornar respostas apropriadas.
 */
class OrderController {
    /**
     * Listar pedidos do usuário.
     * @param req - Objeto de requisição Express (query: userId).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async getOrdersByUser(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = resolveUserId(req, 'query');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seus próprios pedidos.',
                });
                return;
            }

            const orders = await orderService.getOrdersByUser(userId);

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Buscar pedido por ID.
     * @param req - Objeto de requisição Express (params: id).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async getOrderById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = parseInt(req.params.id);

            if (!orderId || isNaN(orderId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido',
                });
                return;
            }

            const order = await orderService.getOrderById(orderId);

            if (!order) {
                res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado',
                });
                return;
            }

            if (order.userId !== req.userId! && req.userRole !== 'ADMIN') {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seus próprios pedidos.',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Criar pedido a partir do carrinho.
     * @param req - Objeto de requisição Express (body: userId, shippingAddress).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = resolveUserId(req, 'body');
            if (!userId) {
                res.status(403).json({
                    success: false,
                    message: 'Acesso negado. Você só pode acessar seus próprios pedidos.',
                });
                return;
            }

            const { shippingAddress } = req.body;

            if (!shippingAddress) {
                res.status(400).json({
                    success: false,
                    message: 'Endereço de entrega é obrigatório',
                });
                return;
            }

            const order = await orderService.createOrder(userId, shippingAddress);

            res.status(201).json({
                success: true,
                message: 'Pedido criado com sucesso',
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Listar todos os pedidos (admin).
     * @param req - Objeto de requisição Express (query: status).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async getAllOrders(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const status = req.query.status as OrderStatus | undefined;

            const orders = await orderService.getAllOrders({ status });

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualizar status do pedido (admin).
     * @param req - Objeto de requisição Express (params: id, body: status).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async updateStatus(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId = parseInt(req.params.id);
            const { status } = req.body;

            if (!orderId || isNaN(orderId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido',
                });
                return;
            }

            if (!status) {
                res.status(400).json({
                    success: false,
                    message: 'status é obrigatório',
                });
                return;
            }

            const order = await orderService.updateOrderStatus(orderId, status);

            res.status(200).json({
                success: true,
                message: 'Status atualizado com sucesso',
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deletar pedido (admin).
     * @param req - Objeto de requisição Express (params: id).
     * @param res - Objeto de resposta Express.
     * @param next - Função para passar erros ao middleware.
     */
    async deleteOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const orderId = parseInt(req.params.id);

            if (!orderId || isNaN(orderId)) {
                res.status(400).json({
                    success: false,
                    message: 'ID do pedido inválido',
                });
                return;
            }

            const deleted = await orderService.deleteOrder(orderId);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado',
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Pedido deletado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();
