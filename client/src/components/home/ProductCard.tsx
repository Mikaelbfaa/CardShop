'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
    showStar?: boolean;
}

export default function ProductCard({ product, showStar }: ProductCardProps) {
    const [hovered, setHovered] = useState(false);
    const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const gameLabel = product.game === 'yugioh' ? 'Yu-Gi-Oh!' : 'Magic: The Gathering';
    const hasPromo = product.badge === 'PROMO';

    const updatePos = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setPopoverPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        updatePos(e);
        setHovered(true);
    }, [updatePos]);

    return (
        <div
            ref={cardRef}
            className={`${styles.card} comic-outline comic-shadow`}
        >
            {/* Image Area */}
            <div
                className={styles.imageArea}
                onMouseEnter={handleMouseEnter}
                onMouseMove={updatePos}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Miniature (always visible) */}
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Badge */}
                {product.badge && (
                    <span
                        className={`${styles.badge}${product.badge === 'PROMO' ? ' comic-outline-1' : ''}`}
                        data-type={product.badge.toLowerCase()}
                    >
                        {product.badge}
                    </span>
                )}

                {/* Optional decorative star */}
                {showStar && (
                    <Image
                        src="/icons/star-pink.svg"
                        alt=""
                        width={32}
                        height={32}
                        className={styles.starDecoration}
                    />
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardMeta}>
                    {gameLabel} &bull; {product.rarity || 'Common'}
                </p>

                {/* Price Row */}
                <div className={styles.priceRow}>
                    <div className={styles.priceGroup}>
                        {hasPromo && product.oldPrice && (
                            <span className={styles.oldPrice}>
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                        <span className={styles.price} data-promo={hasPromo}>
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <button
                        className={`${styles.addButton} comic-outline-1`}
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                        <Image src="/icons/plus.svg" alt="" width={12} height={12} />
                    </button>
                </div>
            </div>

            {/* Floating popover preview — positioned at mouse entry point */}
            {product.fullImage && (
                <div
                    className={styles.popover}
                    data-visible={hovered}
                    style={{ left: popoverPos.x, top: popoverPos.y }}
                >
                    <div className={styles.popoverInner}>
                        <Image
                            src={product.fullImage}
                            alt={product.name}
                            width={350}
                            height={490}
                            className={styles.popoverImage}
                            sizes="350px"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
