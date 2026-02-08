import express from 'express';
import orderController from '../controllers/order';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// User routes (any authenticated user, ownership enforced in controller)
router.get('/', AuthMiddleware.verifyToken, orderController.getOrdersByUser);
router.post('/', AuthMiddleware.verifyToken, orderController.createOrder);

// Admin-only routes
router.get(
    '/all',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    orderController.getAllOrders
);
router.patch(
    '/:id/status',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    orderController.updateStatus
);
router.delete(
    '/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    orderController.deleteOrder
);

// User route with param (after /all to avoid conflict)
router.get('/:id', AuthMiddleware.verifyToken, orderController.getOrderById);

export default router;
