import express from 'express';
import productController from './product';

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Listar todos os produtos
 * @access Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Buscar produto específico por ID
 * @access Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route POST /api/products
 * @desc Criar novo produto
 * @access Private (Admin only)
 */
router.post('/', productController.createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Atualizar produto
 * @access Private (Admin only)
 */
router.put('/:id', productController.updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Deletar produto
 * @access Private (Admin only)
 */
router.delete('/:id', productController.deleteProduct);

export default router;
