import express from 'express';
import productController from '../controllers/product';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

// Rotas públicas (não exigem autenticação)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rotas administrativas (exigem autenticação + role ADMIN)
router.post(
    '/',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    productController.createProduct
);
router.put(
    '/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    productController.updateProduct
);
router.delete(
    '/:id',
    AuthMiddleware.verifyToken,
    AuthMiddleware.isAdmin,
    productController.deleteProduct
);

export default router;
