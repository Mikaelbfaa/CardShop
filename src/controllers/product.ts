import { Request, Response, NextFunction } from 'express';
import productService from '../services/product';

/**
 * Controller de Produtos
 * Camada responsável por receber requisições HTTP,
 * validar dados de entrada e retornar respostas apropriadas
 */

class ProductController {
    /**
     * Listar todos os produtos
     */
    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { game, category } = req.query;
            const filters = { game, category };

            const products = await productService.getAllProducts(filters);

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Buscar produto por ID
     */
    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const product = await productService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Criar novo produto
     */
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productData = req.body;

            const newProduct = await productService.createProduct(productData);

            res.status(201).json({
                success: true,
                message: 'Produto criado com sucesso',
                data: newProduct
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualizar produto
     */
    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedProduct = await productService.updateProduct(id, updateData);

            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Produto atualizado com sucesso',
                data: updatedProduct
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Deletar produto
     */
    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const deleted = await productService.deleteProduct(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Produto não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Produto deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
