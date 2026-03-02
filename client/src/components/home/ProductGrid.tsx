'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

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
        <section className={`${styles.section} container`}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>TENDÊNCIAS AGORA</h2>
                <a href="/" className={styles.viewAll}>
                    VER TUDO
                </a>
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} showStar={index === 1} />
                ))}
            </div>
        </section>
    );
}
