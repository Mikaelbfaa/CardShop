import express from 'express';
import orderController from './order';

const router = express.Router();

/**
 * @route GET /api/orders?userId=
 * @desc Listar pedidos do usuário
 * @access Public (requer userId)
 */
router.get('/', orderController.getOrdersByUser);

/**
 * @route GET /api/orders/:id
 * @desc Buscar pedido por ID
 * @access Public
 */
router.get('/:id', orderController.getOrderById);

/**
 * @route POST /api/orders
 * @desc Criar pedido a partir do carrinho
 * @access Public (requer userId no body)
 */
router.post('/', orderController.createOrder);

export default router;
