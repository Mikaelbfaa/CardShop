import type { Order } from '@/lib/types';
import OrderRow from './OrderRow';
import styles from './OrdersTable.module.css';

interface OrdersTableProps {
    orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <div className={styles.empty}>
                <p className={styles.emptyText}>Nenhum pedido encontrado.</p>
            </div>
        );
    }

    return (
        <div className={styles.table}>
            <div className={styles.headerRow}>
                <div className={`${styles.headerCell} ${styles.colOrderId}`}>Pedido ID</div>
                <div className={`${styles.headerCell} ${styles.colDate}`}>Data</div>
                <div className={`${styles.headerCell} ${styles.colItems}`}>Itens</div>
                <div className={`${styles.headerCell} ${styles.colStatus}`}>Status</div>
                <div className={`${styles.headerCell} ${styles.colTotal}`}>Total</div>
                <div className={`${styles.headerCell} ${styles.colAction}`}>Ação</div>
            </div>
            <div className={styles.body}>
                {orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}
