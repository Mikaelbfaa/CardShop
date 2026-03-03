'use client';

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import styles from './CartItemCard.module.css';

interface CartItemCardProps {
    item: CartItem;
    onQuantityChange: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
    const total = item.price * item.quantity;

    const categoryColor =
        item.game === 'mtg'
            ? '#7C4DFF'
            : item.game === 'yugioh'
              ? '#FF4081'
              : '#6B7280';

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={112}
                    className={styles.image}
                />
                {item.rarity && <span className={styles.rarityBadge}>{item.rarity}</span>}
            </div>

            <div className={styles.info}>
                <span className={styles.category} style={{ color: categoryColor }}>
                    {item.category.toUpperCase()}
                </span>
                <h3 className={styles.name}>{item.name}</h3>
                {item.details && <p className={styles.details}>{item.details}</p>}
            </div>

            <div className={styles.price}>{formatPrice(item.price)}</div>

            <div className={styles.quantitySelector}>
                <button
                    className={styles.qtyButton}
                    onClick={() => onQuantityChange(item.id, -1)}
                    aria-label="Diminuir quantidade"
                >
                    <Image src="/icons/qty-minus.svg" alt="" width={9} height={2} />
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button
                    className={styles.qtyButton}
                    onClick={() => onQuantityChange(item.id, 1)}
                    aria-label="Aumentar quantidade"
                >
                    <Image src="/icons/qty-plus.svg" alt="" width={9} height={9} />
                </button>
            </div>

            <div className={styles.totalColumn}>
                <span className={styles.total}>{formatPrice(total)}</span>
                <button className={styles.removeButton} onClick={() => onRemove(item.id)}>
                    <Image src="/icons/trash.svg" alt="" width={10} height={11} />
                    <span>REMOVER</span>
                </button>
            </div>
        </div>
    );
}
