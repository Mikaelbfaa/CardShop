import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order';
import { OrderStatus } from '@prisma/client';

class OrderController {
    /**
     * Listar pedidos do usuário
     */
    async getOrdersByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = parseInt(req.query.userId as string);

            if (!userId || isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
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
     * Buscar pedido por ID
     */
    async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

            res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Criar pedido a partir do carrinho
     */
    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, shippingAddress } = req.body;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'userId é obrigatório',
                });
                return;
            }

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
     * Listar todos os pedidos (admin)
     */
    async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
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
     * Atualizar status do pedido (admin)
     */
    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
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
}

export default new OrderController();
