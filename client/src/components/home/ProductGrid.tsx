'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
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
                <Link href="/" className={styles.viewAll}>
                    VER TUDO
                </Link>
            </div>

            {/* Grid */}
            {loading ? (
                <p className={styles.loading}>Carregando produtos...</p>
            ) : products.length === 0 ? (
                <p className={styles.empty}>Nenhum produto encontrado.</p>
            ) : (
                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} showStar={index === 1} />
                    ))}
                </div>
            )}
        </section>
    );
}
