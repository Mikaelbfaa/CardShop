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

        return json.data;
    } catch {
        return [];
    }
}
