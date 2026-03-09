'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroSection.module.css';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

const CYCLE_INTERVAL = 4000;
const ANIMATION_DURATION = 700;
const VISIBLE_CARDS = 3;

interface HeroSectionProps {
    products?: Product[];
}

export default function HeroSection({ products = [] }: HeroSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const hasProducts = products.length > 0;

    const cycleCard = useCallback(() => {
        if (!hasProducts || products.length < 2) return;
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % products.length);
            setIsAnimating(false);
        }, ANIMATION_DURATION);
    }, [hasProducts, products.length]);

    useEffect(() => {
        if (!hasProducts || products.length < 2) return;
        timerRef.current = setInterval(cycleCard, CYCLE_INTERVAL);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [cycleCard, hasProducts, products.length]);

    const getCardAtOffset = (offset: number): Product | null => {
        if (!hasProducts) return null;
        return products[(activeIndex + offset) % products.length];
    };

    const topCard = getCardAtOffset(0);
    const currentPrice = topCard ? formatPrice(topCard.price) : 'R$ 45,00';

    const getPositionForProduct = (productIndex: number): number => {
        const total = products.length;
        const offset = (productIndex - activeIndex + total) % total;
        if (offset < VISIBLE_CARDS) return offset;
        return -1; // not visible
    };

    const renderDeck = () => {
        if (!hasProducts) {
            return (
                <div className={styles.mainFrame}>
                    <div className={styles.mainFrameInner}>
                        <Image
                            src="/images/cards/utopia-sprawl.jpg"
                            alt="Utopia Sprawl - Enchantment Aura"
                            fill
                            className={styles.mainImage}
                            priority
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.deckContainer}>
                {products.map((product, idx) => {
                    const position = getPositionForProduct(idx);
                    if (position < 0) return null;

                    const isTop = position === 0;
                    const isExiting = isTop && isAnimating;
                    const cardClass = [
                        styles.deckCard,
                        isExiting ? styles.deckCardExit : styles[`deckCard${position}`],
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div key={product.id} className={cardClass}>
                            <Link
                                href={`/product/${product.id}`}
                                className={styles.deckCardLink}
                                aria-label={`Ver ${product.name}`}
                                tabIndex={isTop && !isExiting ? 0 : -1}
                            >
                                <div
                                    className={styles.mainFrame}
                                >
                                    <div className={styles.mainFrameInner}>
                                        <Image
                                            src={product.fullImage || product.image}
                                            alt={product.name}
                                            fill
                                            className={styles.mainImage}
                                            sizes="(max-width: 1024px) 240px, 320px"
                                            priority={isTop}
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <section className={`${styles.section} container`}>
            <div className={styles.container}>
                {/* Left Side */}
                <div className={styles.leftSide}>
                    <div className={styles.seasonBadgeWrap}>
                        <span className={`${styles.seasonBadge} comic-outline comic-shadow`}>
                            SEASON 04 // COLEÇÃO LENDÁRIA
                        </span>
                    </div>

                    <h1 className={styles.heading}>
                        SUA PRÓXIMA
                        <br />
                        CARTA.
                    </h1>

                    <p className={styles.subtitle}>
                        O melhor marketplace para colecionadores exigentes. Encontre cartas raras de
                        Yu-Gi-Oh! e Magic: The Gathering.
                    </p>

                    <div className={styles.ctaRow}>
                        <Link
                            href="/"
                            className={`${styles.ctaButton} ${styles.ctaPrimary} comic-outline comic-shadow`}
                        >
                            COMPRAR YU-GI-OH!
                        </Link>
                        <Link
                            href="/"
                            className={`${styles.ctaButton} ${styles.ctaSecondary} comic-outline comic-shadow`}
                        >
                            COMPRAR MTG
                        </Link>
                    </div>
                </div>

                {/* Right Side - Card Deck */}
                <div className={styles.rightSide}>
                    <div
                        className={styles.purpleBlob}
                        style={{
                            borderRadius: '265px 520px 556px 414px',
                        }}
                    />

                    <Image
                        src="/icons/star-green.svg"
                        alt=""
                        width={72}
                        height={72}
                        className={styles.greenStar}
                    />

                    {renderDeck()}

                    <div className={`${styles.priceSticker} comic-outline comic-shadow`}>
                        <span className={styles.priceStickerText}>{currentPrice}</span>
                    </div>

                    <Image
                        src="/icons/star-pink.svg"
                        alt=""
                        width={48}
                        height={48}
                        className={styles.pinkStar}
                    />
                </div>
            </div>
        </section>
    );
}
