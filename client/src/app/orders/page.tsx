'use client';

import { useState, useMemo } from 'react';
import { MOCK_ORDERS, ORDERS_PER_PAGE } from '@/lib/constants';
import type { OrderStatus } from '@/lib/types';
import OrdersToolbar from '@/components/orders/OrdersToolbar';
import OrdersTable from '@/components/orders/OrdersTable';
import Pagination from '@/components/orders/Pagination';
import BottomCTACards from '@/components/orders/BottomCTACards';
import styles from './Orders.module.css';

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStatus, setActiveStatus] = useState<OrderStatus | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredOrders = useMemo(() => {
        let orders = MOCK_ORDERS;

        if (activeStatus) {
            orders = orders.filter((o) => o.status === activeStatus);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            orders = orders.filter(
                (o) =>
                    o.code.toLowerCase().includes(q) ||
                    o.items.some((item) => item.product.name.toLowerCase().includes(q))
            );
        }

        return orders;
    }, [activeStatus, searchQuery]);

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

    const handleStatusChange = (status: OrderStatus | null) => {
        setActiveStatus(status);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <section className={`${styles.page} container`}>
            <div className={styles.headerSection}>
                <div className={styles.headingWrap}>
                    <h1 className={styles.title}>Meus Pedidos</h1>
                    <div className={styles.highlightBar} />
                </div>
                <p className={styles.subtitle}>
                    Rastreie seu loot. Aqui está o histórico de todas as suas cartas raras e caixas
                    de booster.
                </p>
            </div>

            <div className={`${styles.card} comic-outline-4 comic-shadow`}>
                <OrdersToolbar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    activeStatus={activeStatus}
                    onStatusChange={handleStatusChange}
                />
                <OrdersTable orders={paginatedOrders} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredOrders.length}
                    itemsPerPage={ORDERS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>

            <BottomCTACards />
        </section>
    );
}
