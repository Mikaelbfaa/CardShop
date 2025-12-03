import express from 'express';
import orderController from './order';

const router = express.Router();

/**
 * @route GET /api/admin/orders
 * @desc Listar todos os pedidos
 * @access Admin
 */
router.get('/', orderController.getAllOrders);

/**
 * @route PATCH /api/admin/orders/:id/status
 * @desc Atualizar status do pedido
 * @access Admin
 */
router.patch('/:id/status', orderController.updateStatus);

export default router;
