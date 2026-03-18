'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import styles from './RelatedCards.module.css';

interface RelatedCardsProps {
    products: Product[];
}

export default function RelatedCards({ products }: RelatedCardsProps) {
    return (
        <section className={styles.section}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.title}>
                        <span className={styles.titleText}>Cartas </span>
                        <span className={styles.titleHighlight}>Relacionadas</span>
                    </div>
                    <p className={styles.subtitle}>Complete seu deck com essas sugestões</p>
                </div>
                <Link href="/" className={styles.viewAll}>
                    Ver Todas
                </Link>
            </div>

            {/* Card Grid */}
            <div className={styles.grid}>
                {products.map((product) => {
                    const hasPromo = product.badge === 'PROMO';

                    return (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className={`${styles.card} comic-shadow-sm comic-outline`}
                        >
                            {/* Image */}
                            <div className={styles.cardImageWrapper}>
                                <div className={styles.cardImageBg}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className={styles.cardImage}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    {product.badge && (
                                        <span
                                            className={`${styles.cardBadge} ${
                                                product.badge === 'NOVO'
                                                    ? styles.badgeNew
                                                    : styles.badgeSale
                                            }`}
                                        >
                                            {product.badge === 'NOVO' ? 'NEW' : 'SALE'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className={styles.cardInfo}>
                                <h3 className={styles.cardName}>{product.name}</h3>
                                <p className={styles.cardMeta}>
                                    {product.rarity}
                                    {product.cardSubtypes &&
                                        ` \u2022 ${product.cardSubtypes}`}
                                </p>
                                <div className={styles.cardPriceRow}>
                                    <div className={styles.cardPriceGroup}>
                                        <span
                                            className={`${styles.cardPrice} ${hasPromo ? styles.cardPricePromo : ''}`}
                                        >
                                            {formatPrice(product.price)}
                                        </span>
                                        {hasPromo && product.oldPrice && (
                                            <span className={styles.cardOldPrice}>
                                                {formatPrice(product.oldPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.cardAddBtn}>
                                        <span className={styles.cardAddBtnIcon}>+</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
