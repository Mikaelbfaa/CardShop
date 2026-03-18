import Link from 'next/link';
import type { Order } from '@/lib/types';
import { formatPrice, formatOrderDate } from '@/lib/utils';
import StatusBadge from './StatusBadge';
import ItemThumbnails from './ItemThumbnails';
import styles from './OrderRow.module.css';

interface OrderRowProps {
    order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
    const isCancelled = order.status === 'CANCELLED';

    return (
        <div className={`${styles.row} ${isCancelled ? styles.rowCancelled : ''}`}>
            <div className={styles.colOrderId}>
                <span className={`${styles.orderCode} ${isCancelled ? styles.orderCodeCancelled : ''}`}>
                    {order.code}
                </span>
                {order.isNew && <span className={styles.newBadge}>NOVO</span>}
            </div>

            <div className={styles.colDate}>
                <span className={styles.date}>{formatOrderDate(order.createdAt)}</span>
            </div>

            <div className={styles.colItems}>
                {isCancelled ? (
                    <p className={styles.cancelledItemName}>{order.items[0]?.product.name}</p>
                ) : (
                    <ItemThumbnails items={order.items} />
                )}
            </div>

            <div className={styles.colStatus}>
                <StatusBadge status={order.status} />
            </div>

            <div className={styles.colTotal}>
                <span className={`${styles.total} ${isCancelled ? styles.totalCancelled : ''}`}>
                    {formatPrice(order.totalPrice)}
                </span>
            </div>

            <div className={styles.colAction}>
                <Link
                    href={`/orders/${order.id}`}
                    className={`${styles.actionLink} ${isCancelled ? styles.actionLinkCancelled : ''}`}
                >
                    Ver Detalhes
                </Link>
            </div>
        </div>
    );
}
