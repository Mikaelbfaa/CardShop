import express from 'express';
import cartController from './cart';

const router = express.Router();

/**
 * @route GET /api/cart?userId=
 * @desc Visualizar carrinho do usuário
 * @access Public (requer userId)
 */
router.get('/', cartController.getCart);

/**
 * @route POST /api/cart/items
 * @desc Adicionar item ao carrinho
 * @access Public (requer userId no body)
 */
router.post('/items', cartController.addItem);

/**
 * @route PUT /api/cart/items/:productId?userId=
 * @desc Atualizar quantidade de item no carrinho
 * @access Public (requer userId)
 */
router.put('/items/:productId', cartController.updateItem);

/**
 * @route DELETE /api/cart/items/:productId?userId=
 * @desc Remover item do carrinho
 * @access Public (requer userId)
 */
router.delete('/items/:productId', cartController.removeItem);

/**
 * @route DELETE /api/cart?userId=
 * @desc Limpar carrinho
 * @access Public (requer userId)
 */
router.delete('/', cartController.clearCart);

export default router;
