/**
 * Interface que representa um produto (carta) no sistema
 */
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    game: 'mtg' | 'yugioh';
    category?: string;
    rarity?: string;
    image?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Interface para filtros de busca de produtos
 */
export interface ProductFilters {
    game?: string;
    category?: string;
}

/**
 * DTO (Data Transfer Object) para criação de produto
 */
export interface CreateProductDTO {
    name: string;
    description?: string;
    price: number;
    stock: number;
    game: 'mtg' | 'yugioh';
    category?: string;
    rarity?: string;
    image?: string;
}

/**
 * DTO (Data Transfer Object) para atualização de produto
 */
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    game?: 'mtg' | 'yugioh';
    category?: string;
    rarity?: string;
    image?: string;
}
