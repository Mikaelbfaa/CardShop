// Re-exporta os tipos gerados pelo Prisma
export { Product, Game, Category, Prisma } from '@prisma/client';

// Re-exporta os DTOs do repository
export { ProductFilters, CreateProductDTO, UpdateProductDTO } from '../repository/product';
