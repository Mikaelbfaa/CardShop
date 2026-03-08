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
        edition?: string;
    };
}

export interface Order {
    id: number;
    code: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    shippingAddress?: string;
    isNew?: boolean;
    items: OrderItem[];
}

/* ===== Auth Types ===== */

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    cpf: string;
}

/* ===== Backend Response Types (used only in api.ts for mapping) ===== */

export interface BackendCartItem {
    quantity: number;
    product: {
        id: number;
        name: string;
        image: string | null;
        price: string | number;
        game: 'mtg' | 'yugioh';
        cardType: string;
        rarity?: string;
    };
}

export interface BackendCart {
    id: number;
    userId: number;
    items: BackendCartItem[];
}

export interface BackendOrderItem {
    id: number;
    quantity: number;
    unitPrice: string | number;
    product: {
        id: number;
        name: string;
        image: string | null;
        game: 'mtg' | 'yugioh';
        cardType: string;
        rarity?: string;
        edition?: string;
    };
}

export interface BackendOrder {
    id: number;
    totalPrice: string | number;
    status: OrderStatus;
    createdAt: string;
    shippingAddress?: string;
    items: BackendOrderItem[];
}

export interface BackendAdminOrder extends BackendOrder {
    userId: number;
    user: { name: string; email: string };
}

export interface AdminOrder extends Order {
    user: { name: string; email: string };
}
