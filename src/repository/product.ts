import prisma from '../database/prisma';
import { Product, Game, CardType, Prisma } from '@prisma/client';

/**
 * Interface para filtros de busca de produtos
 */
export interface ProductFilters {
    game?: string;
    cardType?: string;
}

/**
 * DTO para criação de produto
 */
export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    stock: number;
    game: 'mtg' | 'yugioh';
    cardType?: CardType;
    rarity?: string;
    image?: string;
}

/**
 * DTO para atualização de produto
 */
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    game?: 'mtg' | 'yugioh';
    cardType?: CardType;
    rarity?: string;
    image?: string;
}

/**
 * Repository de Produtos
 * Camada responsável pelo acesso direto aos dados via Prisma
 */
class ProductRepository {
    /**
     * Buscar todos os produtos com filtros opcionais
     */
    async findAll(filters: ProductFilters = {}): Promise<Product[]> {
        const where: Prisma.ProductWhereInput = {};

        if (filters.game) {
            where.game = filters.game.toLowerCase() as Game;
        }

        if (filters.cardType) {
            where.cardType = filters.cardType.toUpperCase() as CardType;
        }

        return prisma.product.findMany({
            where,
            orderBy: {
                id: 'asc',
            },
        });
    }

    /**
     * Buscar produto por ID
     */
    async findById(id: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id: parseInt(id) },
        });
    }

    /**
     * Buscar produto por nome
     */
    async findByName(name: string): Promise<Product | null> {
        return prisma.product.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });
    }

    /**
     * Criar novo produto
     */
    async create(productData: CreateProductDTO): Promise<Product> {
        return prisma.product.create({
            data: {
                name: productData.name,
                description: productData.description,
                price: new Prisma.Decimal(productData.price),
                stock: productData.stock,
                game: productData.game as Game,
                cardType: productData.cardType,
                rarity: productData.rarity,
                image: productData.image,
            },
        });
    }

    /**
     * Atualizar produto
     */
    async update(id: string, updateData: UpdateProductDTO): Promise<Product | null> {
        const existingProduct = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingProduct) {
            return null;
        }

        const data: Prisma.ProductUpdateInput = {};

        if (updateData.name !== undefined) data.name = updateData.name;
        if (updateData.description !== undefined) data.description = updateData.description;
        if (updateData.price !== undefined) data.price = new Prisma.Decimal(updateData.price);
        if (updateData.stock !== undefined) data.stock = updateData.stock;
        if (updateData.game !== undefined) data.game = updateData.game as Game;
        if (updateData.cardType !== undefined) data.cardType = updateData.cardType;
        if (updateData.rarity !== undefined) data.rarity = updateData.rarity;
        if (updateData.image !== undefined) data.image = updateData.image;

        return prisma.product.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    /**
     * Deletar produto
     */
    async delete(id: string): Promise<boolean> {
        try {
            await prisma.product.delete({
                where: { id: parseInt(id) },
            });
            return true;
        } catch {
            return false;
        }
    }
}

export default new ProductRepository();
