import express from 'express';
import orderController from '../controllers/order';

const router = express.Router();

/** @swagger
 * /api/orders:
 *   get:
 *     summary: Listar pedidos do usuário
 *     tags: [Orders]
 */
router.get('/', orderController.getOrdersByUser);

/** @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Orders]
 */
router.get('/:id', orderController.getOrderById);

/** @swagger
 * /api/orders:
 *   post:
 *     summary: Criar pedido a partir do carrinho
 *     tags: [Orders]
 */
router.post('/', orderController.createOrder);

export default router;
