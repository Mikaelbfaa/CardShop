'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    useEffect(() => {
        products.forEach((p) => {
            if (p.fullImage) {
                const img = new window.Image();
                img.src = p.fullImage;
            }
        });
    }, [products]);

    return (
        <section className="mx-auto max-w-[1232px] px-6 py-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-anton text-[36px] text-gray-900 uppercase">
                    TENDÊNCIAS AGORA
                </h2>
                <a
                    href="/"
                    className="font-archivo text-[14px] font-bold uppercase underline text-gray-900 hover:text-brand-pink transition-colors"
                >
                    VER TUDO
                </a>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} showStar={index === 1} />
                ))}
            </div>
        </section>
    );
}
