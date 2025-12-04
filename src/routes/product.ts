import express from 'express';
import productController from '../controllers/product';

const router = express.Router();

/** @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Products]
 */
router.get('/', productController.getAllProducts);

/** @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Products]
 */
router.get('/:id', productController.getProductById);

/** @swagger
 * /api/products:
 *   post:
 *     summary: Criar novo produto
 *     tags: [Products]
 */
router.post('/', productController.createProduct);

/** @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Products]
 */
router.put('/:id', productController.updateProduct);

/** @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deletar produto
 *     tags: [Products]
 */
router.delete('/:id', productController.deleteProduct);

export default router;
