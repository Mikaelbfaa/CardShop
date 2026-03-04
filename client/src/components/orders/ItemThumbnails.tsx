import Image from 'next/image';
import type { OrderItem } from '@/lib/types';
import styles from './ItemThumbnails.module.css';

interface ItemThumbnailsProps {
    items: OrderItem[];
    maxVisible?: number;
}

export default function ItemThumbnails({ items, maxVisible = 2 }: ItemThumbnailsProps) {
    const visibleItems = items.slice(0, maxVisible);
    const overflow = items.length - maxVisible;
    return (
        <div className={styles.wrapper}>
            <div className={styles.thumbnails}>
                {visibleItems.map((item) => (
                    <Image
                        key={item.id}
                        src={item.product.image}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className={styles.thumbnail}
                    />
                ))}
                {overflow > 0 && (
                    <div className={styles.overflowBadge}>+{overflow}</div>
                )}
            </div>
            <p className={styles.productName}>
                {items[0]?.product.name}
            </p>
        </div>
    );
}
