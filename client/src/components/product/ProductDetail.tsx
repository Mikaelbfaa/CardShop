'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';
import { formatPrice, getGameLabel } from '@/lib/utils';
import { MOCK_RELATED_PRODUCTS } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import RelatedCards from './RelatedCards';
import styles from './ProductDetail.module.css';

interface ProductDetailProps {
    product: Product;
}

const DETAIL_THUMBS = [
    '/images/cards/detail/thumb-1.png',
    '/images/cards/detail/thumb-2.png',
    '/images/cards/detail/thumb-3.png',
];

export default function ProductDetail({ product }: ProductDetailProps) {
    const mainImage = product.fullImage || product.image;
    const [selectedImage, setSelectedImage] = useState(mainImage);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [feedback, setFeedback] = useState('');
    const { isAuthenticated } = useAuth();
    const { addItem } = useCart();
    const router = useRouter();

    const gameLabel = getGameLabel(product.game);
    const inStock = product.stock > 0;
    const hasPromo = product.badge === 'PROMO';

    const thumbnails = [
        mainImage,
        ...(product.image !== mainImage ? [product.image] : []),
        ...DETAIL_THUMBS,
    ];

    const relatedProducts = MOCK_RELATED_PRODUCTS.filter((p) => p.game === product.game);

    function handleQuantityChange(delta: number) {
        setQuantity((prev) => {
            const next = prev + delta;
            if (next < 1) return 1;
            if (next > product.stock) return product.stock;
            return next;
        });
    }

    async function handleAddToCart() {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (adding) return;
        setAdding(true);
        setFeedback('');
        try {
            await addItem(product.id, quantity);
            setAdded(true);
            setFeedback('Adicionado ao carrinho!');
            setTimeout(() => {
                setAdded(false);
                setFeedback('');
            }, 3000);
        } catch (err) {
            setFeedback(err instanceof Error ? err.message : 'Erro ao adicionar');
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            {/* Main Product Section */}
            <div className={styles.columns}>
                {/* Left Column — Image Gallery */}
                <div className={styles.leftColumn}>
                    <div className={styles.mainImageWrapper}>
                        {/* Decorative elements */}
                        <div className={styles.decorYellow} />
                        <div className={styles.decorPink}>
                            <div className={`${styles.decorPinkInner} comic-shadow-sm`} />
                        </div>

                        {/* Main image */}
                        <div className={`${styles.mainImageContainer} comic-outline-4`}>
                            <div className={styles.mainImageInner}>
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className={styles.mainImage}
                                    sizes="576px"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className={styles.thumbnails}>
                        {thumbnails.map((src, i) => (
                            <div
                                key={i}
                                className={`${styles.thumbnail} ${
                                    selectedImage === src
                                        ? `${styles.thumbnailActive} comic-outline comic-shadow-sm`
                                        : styles.thumbnailInactive
                                }`}
                                onClick={() => setSelectedImage(src)}
                            >
                                <Image
                                    src={src}
                                    alt={`${product.name} thumbnail ${i + 1}`}
                                    width={72}
                                    height={104}
                                    className={styles.thumbnailImage}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column — Product Info */}
                <div className={styles.rightColumn}>
                    {/* Breadcrumb */}
                    <nav className={styles.breadcrumb}>
                        <Link href="/" className={styles.breadcrumbItem}>
                            Home
                        </Link>
                        <span className={styles.breadcrumbItem}>/</span>
                        <span className={styles.breadcrumbItem}>{gameLabel}</span>
                        <span className={styles.breadcrumbItem}>/</span>
                        <span className={styles.breadcrumbHighlight}>
                            <span className={styles.breadcrumbItem} style={{ color: 'black' }}>
                                {product.rarity || 'Common'}
                            </span>
                        </span>
                    </nav>

                    {/* Limited Edition Badge */}
                    {hasPromo && (
                        <div className={`${styles.limitedBadge} comic-shadow-sm`}>
                            <span className={styles.limitedBadgeText}>LIMITED EDITION</span>
                        </div>
                    )}

                    {/* Product Name */}
                    <h1 className={styles.productName}>{product.name}</h1>

                    {/* Card Subtypes + Edition */}
                    {(product.cardSubtypes || product.edition) && (
                        <p className={styles.cardSubtypes}>
                            {product.cardSubtypes && `[${product.cardSubtypes}]`}
                            {product.cardSubtypes && product.edition && ' \u2022 '}
                            {product.edition}
                        </p>
                    )}

                    {/* Price Block */}
                    <div className={styles.priceBlock}>
                        <div className={styles.priceTagWrapper}>
                            <div className={styles.priceTagShadow} />
                            <div className={`${styles.priceTag} comic-shadow comic-outline`}>
                                <span className={styles.priceValue}>
                                    {formatPrice(product.price)}
                                </span>
                            </div>
                        </div>
                        <div className={styles.priceDetails}>
                            <span
                                className={`${styles.stockStatus} ${inStock ? styles.stockInStock : styles.stockOutOfStock}`}
                            >
                                {inStock ? '\u25CF Em Estoque' : '\u25CF Fora de Estoque'}
                            </span>
                            {product.oldPrice && (
                                <span className={styles.oldPrice}>
                                    {formatPrice(product.oldPrice)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.description}>
                        <p className={styles.descriptionText}>{product.description}</p>
                    </div>

                    {/* Separator + Purchase Section */}
                    <div className={styles.separator} />
                    <div className={styles.purchaseSection}>
                        <div className={styles.purchaseRow}>
                            {/* Quantity Selector */}
                            <div className={`${styles.quantitySelector} comic-shadow-sm comic-outline`}>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => handleQuantityChange(-1)}
                                    aria-label="Diminuir quantidade"
                                >
                                    -
                                </button>
                                <span className={styles.quantityValue}>{quantity}</span>
                                <button
                                    className={styles.quantityBtn}
                                    onClick={() => handleQuantityChange(1)}
                                    aria-label="Aumentar quantidade"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                className={`${styles.addToCartBtn}${added ? ` ${styles.addToCartBtnPop}` : ''} comic-shadow`}
                                onClick={handleAddToCart}
                                disabled={!inStock || adding}
                            >
                                <span className={styles.addToCartText}>
                                    {adding ? 'Adicionando...' : added ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
                                </span>
                                <Image
                                    src="/icons/lightning.svg"
                                    alt=""
                                    width={16}
                                    height={20}
                                    className={styles.addToCartIcon}
                                />
                            </button>
                        </div>

                        {/* Secondary Actions */}
                        <div className={styles.secondaryActions}>
                            <button className={styles.secondaryAction}>
                                <Image src="/icons/heart.svg" alt="" width={15} height={14} />
                                <span className={styles.secondaryActionText}>
                                    Add aos Favoritos
                                </span>
                            </button>
                            <button className={styles.secondaryAction}>
                                <Image src="/icons/share.svg" alt="" width={14} height={15} />
                                <span className={styles.secondaryActionText}>Compartilhar</span>
                            </button>
                        </div>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <p
                            style={{
                                fontFamily: 'var(--font-inter)',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: feedback.includes('Erro') ? '#dc2626' : '#16a34a',
                            }}
                        >
                            {feedback}
                        </p>
                    )}

                    {/* Guarantee Banner */}
                    <div className={styles.guarantee}>
                        <Image src="/icons/shield.svg" alt="" width={16} height={20} />
                        <span className={styles.guaranteeLabel}>Garantia CardShop:</span>
                        <span className={styles.guaranteeText}>
                            Todas as cartas são verificadas por especialistas.
                        </span>
                    </div>
                </div>
            </div>

            {/* Related Cards Section */}
            {relatedProducts.length > 0 && <RelatedCards products={relatedProducts} />}
        </div>
    );
}
