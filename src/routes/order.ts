import express from 'express';
import orderController from '../controllers/order';

const router = express.Router();

router.get('/', orderController.getOrdersByUser);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);

export default router;
