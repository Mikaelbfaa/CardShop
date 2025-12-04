import express from 'express';
import orderController from '../controllers/order';
import * as UserController from '../controllers/user';

const router = express.Router();

/** @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Listar todos os pedidos (admin)
 *     tags: [Admin]
 */
router.get('/orders', orderController.getAllOrders);

/** @swagger
 * /api/admin/orders/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido (admin)
 *     tags: [Admin]
 */
router.patch('/orders/:id/status', orderController.updateStatus);

/** @swagger
 * /api/admin/orders/{id}:
 *   delete:
 *     summary: Deletar pedido (admin)
 *     tags: [Admin]
 */
router.delete('/orders/:id', orderController.deleteOrder);

/** @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Deletar usuário (admin)
 *     tags: [Admin]
 */
router.delete('/users/:id', UserController.deleteUser);

export default router;
