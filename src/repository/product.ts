import pool from '../database/connection';
import { Product, ProductFilters, CreateProductDTO, UpdateProductDTO } from '../models/product';

/**
 * Repository de Produtos
 * Camada responsável pelo acesso direto aos dados no PostgreSQL
 */

class ProductRepository {
    /**
     * Buscar todos os produtos com filtros opcionais
     */
    async findAll(filters: ProductFilters = {}): Promise<Product[]> {
        const query = `
            SELECT id, name, description, price, stock, game, category, rarity, image,
                   created_at as "createdAt", updated_at as "updatedAt"
            FROM products
            WHERE ($1::text IS NULL OR game = $1)
              AND ($2::text IS NULL OR category = $2)
            ORDER BY id
        `;
        const values = [filters.game || null, filters.category || null];
        const result = await pool.query(query, values);
        return result.rows;
    }

    /**
     * Buscar produto por ID
     */
    async findById(id: string): Promise<Product | undefined> {
        const query = `
            SELECT id, name, description, price, stock, game, category, rarity, image,
                   created_at as "createdAt", updated_at as "updatedAt"
            FROM products
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Buscar produto por nome
     */
    async findByName(name: string): Promise<Product | undefined> {
        const query = `
            SELECT id, name, description, price, stock, game, category, rarity, image,
                   created_at as "createdAt", updated_at as "updatedAt"
            FROM products
            WHERE LOWER(name) = LOWER($1)
        `;
        const result = await pool.query(query, [name]);
        return result.rows[0];
    }

    /**
     * Criar novo produto
     */
    async create(productData: CreateProductDTO): Promise<Product> {
        const query = `
            INSERT INTO products (name, description, price, stock, game, category, rarity, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, name, description, price, stock, game, category, rarity, image,
                      created_at as "createdAt", updated_at as "updatedAt"
        `;
        const values = [
            productData.name,
            productData.description || null,
            productData.price,
            productData.stock,
            productData.game,
            productData.category || null,
            productData.rarity || null,
            productData.image || null
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Atualizar produto
     */
    async update(id: string, updateData: UpdateProductDTO): Promise<Product | null> {
        const fields: string[] = [];
        const values: (string | number | null)[] = [];
        let paramIndex = 1;

        if (updateData.name !== undefined) {
            fields.push(`name = $${paramIndex++}`);
            values.push(updateData.name);
        }
        if (updateData.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(updateData.description);
        }
        if (updateData.price !== undefined) {
            fields.push(`price = $${paramIndex++}`);
            values.push(updateData.price);
        }
        if (updateData.stock !== undefined) {
            fields.push(`stock = $${paramIndex++}`);
            values.push(updateData.stock);
        }
        if (updateData.game !== undefined) {
            fields.push(`game = $${paramIndex++}`);
            values.push(updateData.game);
        }
        if (updateData.category !== undefined) {
            fields.push(`category = $${paramIndex++}`);
            values.push(updateData.category);
        }
        if (updateData.rarity !== undefined) {
            fields.push(`rarity = $${paramIndex++}`);
            values.push(updateData.rarity);
        }
        if (updateData.image !== undefined) {
            fields.push(`image = $${paramIndex++}`);
            values.push(updateData.image);
        }

        if (fields.length === 0) {
            return this.findById(id) || null;
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE products
            SET ${fields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, name, description, price, stock, game, category, rarity, image,
                      created_at as "createdAt", updated_at as "updatedAt"
        `;

        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    /**
     * Deletar produto
     */
    async delete(id: string): Promise<boolean> {
        const query = 'DELETE FROM products WHERE id = $1';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export default new ProductRepository();
