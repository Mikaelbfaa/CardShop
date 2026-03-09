'use client';

import { use, useRef, useReducer } from 'react';
import { fetchProductById, fetchProducts } from '@/lib/api';
import ProductDetail from '@/components/product/ProductDetail';
import type { Product } from '@/lib/types';

interface State {
    product: Product | null;
    allProducts: Product[];
    loading: boolean;
}

type Action = { type: 'SUCCESS'; product: Product | null; allProducts: Product[] };

function reducer(_state: State, action: Action): State {
    return { product: action.product, allProducts: action.allProducts, loading: false };
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [state, dispatch] = useReducer(reducer, { product: null, allProducts: [], loading: true });
    const fetchRef = useRef<Promise<void> | null>(null);

    if (fetchRef.current == null) {
        fetchRef.current = Promise.all([fetchProductById(id), fetchProducts()]).then(
            ([product, allProducts]) => {
                dispatch({ type: 'SUCCESS', product, allProducts });
            }
        );
    }

    if (state.loading) {
        return (
            <div
                style={{
                    maxWidth: 'var(--max-width)',
                    margin: '0 auto',
                    padding: '96px 32px',
                    textAlign: 'center',
                }}
            >
                <p style={{ color: 'var(--color-gray-500)', fontSize: '18px' }}>
                    Carregando produto...
                </p>
            </div>
        );
    }

    if (!state.product) {
        return (
            <div
                style={{
                    maxWidth: 'var(--max-width)',
                    margin: '0 auto',
                    padding: '96px 32px',
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        fontFamily: 'var(--font-archivo-black)',
                        fontSize: '36px',
                        textTransform: 'uppercase',
                    }}
                >
                    Produto não encontrado
                </h1>
                <p style={{ marginTop: '16px', color: 'var(--color-gray-500)' }}>
                    O produto que você procura não existe ou foi removido.
                </p>
            </div>
        );
    }

    const relatedProducts = state.allProducts
        .filter((p) => p.id !== state.product!.id && p.game === state.product!.game)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    return <ProductDetail product={state.product} relatedProducts={relatedProducts} />;
}
