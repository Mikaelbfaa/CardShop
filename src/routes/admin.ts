import express from 'express';
import orderController from '../controllers/order';
import * as UserController from '../controllers/user';

const router = express.Router();

router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateStatus);
router.delete('/orders/:id', orderController.deleteOrder);
router.delete('/users/:id', UserController.deleteUser);

export default router;
