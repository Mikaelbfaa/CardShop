export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    image: string;
    fullImage?: string;
    game: 'mtg' | 'yugioh';
    cardType: string;
    rarity?: string;
    stock: number;
    badge?: 'NOVO' | 'PROMO';
    cardSubtypes?: string;
    edition?: string;
}

export type FilterType =
    | 'TODOS'
    | 'MONSTROS'
    | 'MAGIAS'
    | 'ARMADILHAS'
    | 'TERRENOS'
    | 'CRIATURAS';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
}
