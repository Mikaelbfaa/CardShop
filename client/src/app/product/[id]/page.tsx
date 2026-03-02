'use client';

import { use } from 'react';
import { getProductById } from '@/lib/constants';
import ProductDetail from '@/components/product/ProductDetail';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = getProductById(Number(id));

    if (!product) {
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

    return <ProductDetail product={product} />;
}
