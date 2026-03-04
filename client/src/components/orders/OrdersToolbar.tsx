'use client';

import Image from 'next/image';
import { ORDER_STATUS_FILTERS } from '@/lib/constants';
import type { OrderStatus } from '@/lib/types';
import styles from './OrdersToolbar.module.css';

interface OrdersToolbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeStatus: OrderStatus | null;
    onStatusChange: (status: OrderStatus | null) => void;
}

export default function OrdersToolbar({
    searchQuery,
    onSearchChange,
    activeStatus,
    onStatusChange,
}: OrdersToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
                <Image
                    src="/icons/search-gray.svg"
                    alt=""
                    width={18}
                    height={18}
                    className={styles.searchIcon}
                />
                <input
                    type="text"
                    placeholder="Buscar por ID ou Carta..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.filters}>
                {ORDER_STATUS_FILTERS.map((filter) => (
                    <button
                        key={filter.label}
                        onClick={() => onStatusChange(filter.value)}
                        className={styles.filterButton}
                        data-active={activeStatus === filter.value}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
