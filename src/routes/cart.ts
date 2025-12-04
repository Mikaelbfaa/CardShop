import express from 'express';
import cartController from '../controllers/cart';

const router = express.Router();

/** @swagger
 * /api/cart:
 *   get:
 *     summary: Visualizar carrinho do usuário
 *     tags: [Cart]
 */
router.get('/', cartController.getCart);

/** @swagger
 * /api/cart/items:
 *   post:
 *     summary: Adicionar item ao carrinho
 *     tags: [Cart]
 */
router.post('/items', cartController.addItem);

/** @swagger
 * /api/cart/items/{productId}:
 *   put:
 *     summary: Atualizar quantidade de item
 *     tags: [Cart]
 */
router.put('/items/:productId', cartController.updateItem);

/** @swagger
 * /api/cart/items/{productId}:
 *   delete:
 *     summary: Remover item do carrinho
 *     tags: [Cart]
 */
router.delete('/items/:productId', cartController.removeItem);

/** @swagger
 * /api/cart:
 *   delete:
 *     summary: Limpar carrinho
 *     tags: [Cart]
 */
router.delete('/', cartController.clearCart);

export default router;
