import productRepository, {
    ProductFilters,
    CreateProductDTO,
    UpdateProductDTO,
} from '../repository/product';
import { Product } from '@prisma/client';

class ProductService {
    /**
     * Listar todos os produtos com filtros opcionais
     * @param filters - Filtros opcionais para busca (game, category)
     * @returns Promise com array de produtos
     * @throws Error se houver falha ao buscar produtos
     */
    async getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
        try {
            const products = await productRepository.findAll(filters);
            return products;
        } catch (error) {
            throw new Error(`Erro ao buscar produtos: ${(error as Error).message}`);
        }
    }

    /**
     * Buscar produto por ID
     * @param productId - ID do produto a ser buscado
     * @returns Promise com produto encontrado ou null
     * @throws Error se ID não for fornecido ou houver falha na busca
     */
    async getProductById(productId: string): Promise<Product | null> {
        try {
            if (!productId) {
                throw new Error('ID do produto é obrigatório');
            }

            const product = await productRepository.findById(productId);
            return product;
        } catch (error) {
            throw new Error(`Erro ao buscar produto: ${(error as Error).message}`);
        }
    }

    /**
     * Criar novo produto
     * @param productData - Dados do produto a ser criado
     * @returns Promise com produto criado
     * @throws Error se dados inválidos, produto duplicado ou falha na criação
     */
    async createProduct(productData: CreateProductDTO): Promise<Product> {
        try {
            this.validateProductData(productData);

            const existingProduct = await productRepository.findByName(productData.name);
            if (existingProduct) {
                throw new Error('Já existe um produto com este nome');
            }

            const newProduct = await productRepository.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error(`Erro ao criar produto: ${(error as Error).message}`);
        }
    }

    /**
     * Atualizar produto
     * @param productId - ID do produto a ser atualizado
     * @param updateData - Dados a serem atualizados
     * @returns Promise com produto atualizado ou null se não encontrado
     * @throws Error se dados inválidos ou falha na atualização
     */
    async updateProduct(productId: string, updateData: UpdateProductDTO): Promise<Product | null> {
        try {
            const existingProduct = await productRepository.findById(productId);
            if (!existingProduct) {
                return null;
            }

            if (updateData.price !== undefined && updateData.price < 0) {
                throw new Error('Preço não pode ser negativo');
            }

            if (updateData.stock !== undefined && updateData.stock < 0) {
                throw new Error('Estoque não pode ser negativo');
            }

            const updatedProduct = await productRepository.update(productId, updateData);
            return updatedProduct;
        } catch (error) {
            throw new Error(`Erro ao atualizar produto: ${(error as Error).message}`);
        }
    }

    /**
     * Deletar produto
     * @param productId - ID do produto a ser deletado
     * @returns Promise com true se deletado, null se não encontrado
     * @throws Error se houver falha ao deletar
     */
    async deleteProduct(productId: string): Promise<boolean | null> {
        try {
            const existingProduct = await productRepository.findById(productId);
            if (!existingProduct) {
                return null;
            }

            const deleted = await productRepository.delete(productId);
            return deleted;
        } catch (error) {
            throw new Error(`Erro ao deletar produto: ${(error as Error).message}`);
        }
    }

    /**
     * Validar dados do produto
     * @param productData - Dados do produto a serem validados
     * @throws Error se dados inválidos (campos obrigatórios, valores negativos, jogo inválido)
     */
    validateProductData(productData: CreateProductDTO): void {
        const requiredFields: (keyof CreateProductDTO)[] = ['name', 'price', 'stock', 'game'];

        for (const field of requiredFields) {
            if (productData[field] === undefined || productData[field] === null) {
                throw new Error(`Campo ${field} é obrigatório`);
            }
        }

        if (productData.price < 0) {
            throw new Error('Preço não pode ser negativo');
        }

        if (productData.stock < 0) {
            throw new Error('Estoque não pode ser negativo');
        }

        const validGames = ['MTG', 'YUGIOH'];
        if (!validGames.includes(productData.game.toUpperCase())) {
            throw new Error('Jogo inválido. Opções: MTG, YUGIOH');
        }
    }
}

export default new ProductService();
