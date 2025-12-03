import express from 'express';
import orderController from './order';

const router = express.Router();

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Listar todos os pedidos
 *     tags: [Admin]
 *     description: Retorna todos os pedidos do sistema. Requer permissão de administrador.
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   patch:
 *     summary: Atualizar status do pedido
 *     tags: [Admin]
 *     description: |
 *       Atualiza o status de um pedido. Requer permissão de administrador.
 *
 *       Fluxo de status válido:
 *       - PENDING → PROCESSING ou CANCELLED
 *       - PROCESSING → SHIPPED ou CANCELLED
 *       - SHIPPED → DELIVERED
 *       - DELIVERED e CANCELLED são estados finais
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *                 example: PROCESSING
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Status atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Transição de status inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/status', orderController.updateStatus);

export default router;
