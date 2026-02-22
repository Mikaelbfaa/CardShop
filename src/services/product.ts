import productRepository, {
    ProductFilters,
    CreateProductDTO,
    UpdateProductDTO,
} from '../repository/product';
import { Product, CardType } from '@prisma/client';

// Tipos de carta válidos por jogo — usados para validação cruzada game ↔ cardType
const YUGIOH_CARD_TYPES: CardType[] = ['MONSTER', 'SPELL', 'TRAP'];
const MTG_CARD_TYPES: CardType[] = [
    'CREATURE',
    'INSTANT',
    'SORCERY',
    'ENCHANTMENT',
    'ARTIFACT',
    'LAND',
    'PLANESWALKER',
];

class ProductService {
    /**
     * Listar todos os produtos com filtros opcionais
     * @param filters - Filtros opcionais para busca (game, cardType)
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
            // Validação de parâmetro obrigatório
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
            // Valida campos obrigatórios, valores e compatibilidade game/cardType
            this.validateProductData(productData);

            // Verifica duplicidade de nome (campo unique no banco)
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
            // Rejeita requisição sem dados de atualização (body vazio)
            if (!updateData || Object.keys(updateData).length === 0) {
                throw new Error('Dados de atualização são obrigatórios');
            }

            // Retorna null se produto não existe (controller converte para 404)
            const existingProduct = await productRepository.findById(productId);
            if (!existingProduct) {
                return null;
            }

            // Valida preço e estoque apenas se foram enviados (update parcial)
            if (updateData.price !== undefined && updateData.price < 0) {
                throw new Error('Preço não pode ser negativo');
            }

            if (updateData.stock !== undefined && updateData.stock < 0) {
                throw new Error('Estoque não pode ser negativo');
            }

            // Mescla game/cardType do update com os valores existentes para validação cruzada
            // (ex: alterar só o cardType ainda precisa ser compatível com o game atual)
            const finalGame = updateData.game || existingProduct.game;
            const finalCardType = updateData.cardType ?? existingProduct.cardType;

            if (finalCardType) {
                this.validateCardTypeForGame(finalCardType, finalGame);
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
     * @throws Error se houver falha ao deletar (ex: produto em uso)
     */
    async deleteProduct(productId: string): Promise<boolean | null> {
        try {
            // Retorna null se produto não existe (controller converte para 404)
            const existingProduct = await productRepository.findById(productId);
            if (!existingProduct) {
                return null;
            }

            await productRepository.delete(productId);
            return true;
        } catch (error) {
            const err = error as Error;
            const msg = err.message.toLowerCase();
            // Prisma não expõe violação de FK como erro tipado no delete — detectamos via string
            if (msg.includes('foreign key') || msg.includes('fkey') || msg.includes('restrict')) {
                throw new Error(
                    'Produto não pode ser deletado pois está em uso (carrinho ou pedido)'
                );
            }
            throw new Error(`Erro ao deletar produto: ${err.message}`);
        }
    }

    /**
     * Validar dados do produto
     * @param productData - Dados do produto a serem validados
     * @throws Error se dados inválidos (campos obrigatórios, valores negativos, jogo inválido, tipo de carta incompatível)
     */
    validateProductData(productData: CreateProductDTO): void {
        // Itera sobre campos obrigatórios e lança erro no primeiro ausente
        const requiredFields: (keyof CreateProductDTO)[] = ['name', 'price', 'stock', 'game'];

        for (const field of requiredFields) {
            if (productData[field] === undefined || productData[field] === null) {
                throw new Error(`Campo ${field} é obrigatório`);
            }
        }

        // Validação de regras de negócio: preço e estoque não negativos
        if (productData.price < 0) {
            throw new Error('Preço não pode ser negativo');
        }

        if (productData.stock < 0) {
            throw new Error('Estoque não pode ser negativo');
        }

        // Valida se o jogo informado é um dos suportados pela plataforma
        const validGames = ['mtg', 'yugioh'];
        if (!validGames.includes(productData.game.toLowerCase())) {
            throw new Error('Jogo inválido. Opções: mtg, yugioh');
        }

        // cardType é opcional, mas se informado deve ser compatível com o jogo
        if (productData.cardType) {
            this.validateCardTypeForGame(productData.cardType, productData.game);
        }
    }

    /**
     * Validar se o tipo de carta é compatível com o jogo
     * @param cardType - Tipo da carta
     * @param game - Jogo (mtg ou yugioh)
     * @throws Error se tipo de carta incompatível com o jogo
     */
    validateCardTypeForGame(cardType: CardType, game: 'mtg' | 'yugioh'): void {
        const gameLower = game.toLowerCase();

        if (gameLower === 'yugioh' && !YUGIOH_CARD_TYPES.includes(cardType)) {
            throw new Error(
                `Tipo de carta inválido para Yugioh. Opções: ${YUGIOH_CARD_TYPES.join(', ')}`
            );
        }

        if (gameLower === 'mtg' && !MTG_CARD_TYPES.includes(cardType)) {
            throw new Error(
                `Tipo de carta inválido para Magic the Gathering. Opções: ${MTG_CARD_TYPES.join(', ')}`
            );
        }
    }
}

export default new ProductService();
