import {
    ApiResponse,
    AuthUser,
    BackendCart,
    BackendCartItem,
    BackendOrder,
    CartItem,
    LoginResponse,
    Order,
    OrderItem,
    Product,
    RegisterPayload,
} from './types';
import { getGameLabel } from './utils';

const BASE_URL = '/api';

/* ===== Token helpers ===== */

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

/* ===== Auth-aware fetch ===== */

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
}

/* ===== Product functions (public) ===== */

export async function fetchProducts(cardType?: string | null): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        if (cardType) {
            params.set('cardType', cardType);
        }

        const url = `${BASE_URL}/products${params.toString() ? `?${params}` : ''}`;
        const res = await fetch(url, { next: { revalidate: 60 } });

        if (!res.ok) {
            throw new Error(`Erro ao buscar produtos: ${res.status}`);
        }

        const json: ApiResponse<Product[]> = await res.json();

        if (!json.success) {
            throw new Error(json.message || 'Erro ao buscar produtos');
        }

        return json.data.map((p) => ({
            ...p,
            price: Number(p.price),
            oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
        }));
    } catch {
        return [];
    }
}

export async function fetchProductById(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${BASE_URL}/products/${id}`);

        if (!res.ok) return null;

        const json: ApiResponse<Product> = await res.json();

        if (!json.success) return null;

        return {
            ...json.data,
            price: Number(json.data.price),
            oldPrice: json.data.oldPrice ? Number(json.data.oldPrice) : undefined,
        };
    } catch {
        return null;
    }
}

/* ===== Auth functions ===== */

export async function loginUser(
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const json: ApiResponse<LoginResponse> = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Erro ao fazer login');
    }

    return json.data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const json: ApiResponse<AuthUser> = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Erro ao criar conta');
    }

    return json.data;
}

export async function getUserProfile(): Promise<AuthUser | null> {
    try {
        const res = await authFetch(`${BASE_URL}/users/profile`);
        if (!res.ok) return null;

        const json: ApiResponse<AuthUser> = await res.json();
        if (!json.success) return null;

        return json.data;
    } catch {
        return null;
    }
}

export async function logoutUser(): Promise<void> {
    try {
        await authFetch(`${BASE_URL}/users/logout`, { method: 'POST' });
    } catch {
        // Logout silently
    }
}

/* ===== Cart mapping ===== */

function mapBackendCartItem(item: BackendCartItem): CartItem {
    return {
        id: item.product.id,
        name: item.product.name,
        image: item.product.image || '/images/placeholder-card.png',
        price: Number(item.product.price),
        quantity: item.quantity,
        game: item.product.game,
        category: getGameLabel(item.product.game),
        rarity: item.product.rarity,
    };
}

function mapBackendCart(cart: BackendCart): CartItem[] {
    return cart.items.map(mapBackendCartItem);
}

/* ===== Cart functions ===== */

export async function fetchCart(): Promise<CartItem[]> {
    const res = await authFetch(`${BASE_URL}/cart`);

    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error('Erro ao buscar carrinho');
    }

    const json: ApiResponse<BackendCart> = await res.json();
    if (!json.success) throw new Error(json.message || 'Erro ao buscar carrinho');

    return mapBackendCart(json.data);
}

export async function addCartItem(
    productId: number,
    quantity: number = 1
): Promise<CartItem[]> {
    const res = await authFetch(`${BASE_URL}/cart/items`, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
    });

    const json: ApiResponse<BackendCart> = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Erro ao adicionar item');
    }

    return mapBackendCart(json.data);
}

export async function updateCartItem(
    productId: number,
    quantity: number
): Promise<CartItem[]> {
    const res = await authFetch(`${BASE_URL}/cart/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
    });

    const json: ApiResponse<BackendCart> = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Erro ao atualizar item');
    }

    return mapBackendCart(json.data);
}

export async function removeCartItem(productId: number): Promise<CartItem[]> {
    const res = await authFetch(`${BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
    });

    const json: ApiResponse<BackendCart> = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Erro ao remover item');
    }

    return mapBackendCart(json.data);
}

export async function clearCart(): Promise<void> {
    const res = await authFetch(`${BASE_URL}/cart`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'Erro ao limpar carrinho');
    }
}

/* ===== Order mapping ===== */

function mapBackendOrder(order: BackendOrder): Order {
    const now = new Date();
    const createdAt = new Date(order.createdAt);
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const items: OrderItem[] = order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        product: {
            name: item.product.name,
            image: item.product.image || '/images/placeholder-card.png',
            game: item.product.game,
            cardType: item.product.cardType,
            rarity: item.product.rarity,
        },
    }));

    return {
        id: order.id,
        code: `#CS-${String(order.id).padStart(4, '0')}`,
        totalPrice: Number(order.totalPrice),
        status: order.status,
        createdAt: order.createdAt,
        isNew: hoursDiff < 24,
        items,
    };
}

/* ===== Order functions ===== */

export async function fetchOrders(): Promise<Order[]> {
    const res = await authFetch(`${BASE_URL}/orders`);

    if (!res.ok) {
        throw new Error('Erro ao buscar pedidos');
    }

    const json: ApiResponse<BackendOrder[]> = await res.json();
    if (!json.success) throw new Error(json.message || 'Erro ao buscar pedidos');

    return json.data.map(mapBackendOrder);
}

export async function createOrder(shippingAddress: string): Promise<Order> {
    const res = await authFetch(`${BASE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify({ shippingAddress }),
    });

    const json: ApiResponse<BackendOrder> = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Erro ao criar pedido');
    }

    return mapBackendOrder(json.data);
}
