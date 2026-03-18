import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import type { OrderStatus } from '@/lib/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
    status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = ORDER_STATUS_CONFIG[status];

    return (
        <span
            className={styles.badge}
            style={{
                color: config.color,
                backgroundColor: config.bg,
                borderColor: config.border,
            }}
        >
            {config.label}
        </span>
    );
}
