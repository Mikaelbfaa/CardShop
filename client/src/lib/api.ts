import { ApiResponse, Product } from './types';

const BASE_URL = '/api';

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
