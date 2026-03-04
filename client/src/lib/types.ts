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

export interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    game?: 'mtg' | 'yugioh';
    category: string;
    details?: string;
    rarity?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    product: {
        name: string;
        image: string;
        game: 'mtg' | 'yugioh';
        cardType: string;
        rarity?: string;
    };
}

export interface Order {
    id: number;
    code: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    isNew?: boolean;
    items: OrderItem[];
}
