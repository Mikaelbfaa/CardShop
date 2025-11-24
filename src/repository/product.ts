import { Product, ProductFilters, CreateProductDTO, UpdateProductDTO } from '../models/product';

/**
 * Repository de Produtos
 * Camada responsável pelo acesso direto aos dados
 * Por enquanto usa dados em memória, mas será substituído por PostgreSQL
 */

class ProductRepository {
    private products: Product[];
    private nextId: number;

    constructor() {
        this.products = [
            {
                id: 1,
                name: 'Black Lotus',
                description: 'Carta lendária de Magic: The Gathering',
                price: 50000.00,
                stock: 1,
                game: 'mtg',
                category: 'Power Nine',
                rarity: 'Rare',
                image: null
            },
            {
                id: 2,
                name: 'Blue-Eyes White Dragon',
                description: 'Dragão Branco de Olhos Azuis',
                price: 150.00,
                stock: 5,
                game: 'yugioh',
                category: 'Monster',
                rarity: 'Ultra Rare',
                image: null
            }
        ];
        this.nextId = 3;
    }

    /**
     * Buscar todos os produtos com filtros opcionais
     */
    async findAll(filters: ProductFilters = {}): Promise<Product[]> {
        let results = [...this.products];

        if (filters.game) {
            results = results.filter(p => p.game === filters.game);
        }

        if (filters.category) {
            results = results.filter(p => p.category === filters.category);
        }

        return results;
    }

    /**
     * Buscar produto por ID
     */
    async findById(id: string): Promise<Product | undefined> {
        return this.products.find(p => p.id === parseInt(id));
    }

    /**
     * Buscar produto por nome
     */
    async findByName(name: string): Promise<Product | undefined> {
        return this.products.find(p => p.name.toLowerCase() === name.toLowerCase());
    }

    /**
     * Criar novo produto
     */
    async create(productData: CreateProductDTO): Promise<Product> {
        const newProduct = {
            id: this.nextId++,
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.products.push(newProduct);
        return newProduct;
    }

    /**
     * Atualizar produto
     */
    async update(id: string, updateData: UpdateProductDTO): Promise<Product | null> {
        const index = this.products.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            return null;
        }

        this.products[index] = {
            ...this.products[index],
            ...updateData,
            updatedAt: new Date()
        };

        return this.products[index];
    }

    /**
     * Deletar produto
     */
    async delete(id: string): Promise<boolean> {
        const index = this.products.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            return false;
        }

        this.products.splice(index, 1);
        return true;
    }
}

export default new ProductRepository();
