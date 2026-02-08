import express from 'express';
import cartController from '../controllers/cart';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', AuthMiddleware.verifyToken, cartController.getCart);
router.post('/items', AuthMiddleware.verifyToken, cartController.addItem);
router.put('/items/:productId', AuthMiddleware.verifyToken, cartController.updateItem);
router.delete('/items/:productId', AuthMiddleware.verifyToken, cartController.removeItem);
router.delete('/', AuthMiddleware.verifyToken, cartController.clearCart);

export default router;
