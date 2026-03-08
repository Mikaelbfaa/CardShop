'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrders } from '@/lib/api';
import { ORDERS_PER_PAGE } from '@/lib/constants';
import type { Order, OrderStatus } from '@/lib/types';
import OrdersToolbar from '@/components/orders/OrdersToolbar';
import OrdersTable from '@/components/orders/OrdersTable';
import Pagination from '@/components/orders/Pagination';
import BottomCTACards from '@/components/orders/BottomCTACards';
import styles from './Orders.module.css';

export default function OrdersPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStatus, setActiveStatus] = useState<OrderStatus | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchOrders()
            .then(setOrders)
            .catch(() => setError('Erro ao carregar pedidos.'))
            .finally(() => setLoading(false));
    }, [isAuthenticated, authLoading, router]);

    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (activeStatus) {
            filtered = filtered.filter((o) => o.status === activeStatus);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (o) =>
                    o.code.toLowerCase().includes(q) ||
                    o.items.some((item) => item.product.name.toLowerCase().includes(q))
            );
        }

        return filtered;
    }, [orders, activeStatus, searchQuery]);

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

    if (authLoading || loading) {
        return (
            <section className={`${styles.page} container`}>
                <div className={styles.headerSection}>
                    <div className={styles.headingWrap}>
                        <h1 className={styles.title}>Meus Pedidos</h1>
                        <div className={styles.highlightBar} />
                    </div>
                </div>
                <p
                    style={{
                        color: 'var(--color-gray-500)',
                        fontSize: '18px',
                        textAlign: 'center',
                        padding: '80px 0',
                    }}
                >
                    Carregando pedidos...
                </p>
            </section>
        );
    }

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

            {error && (
                <p
                    style={{
                        color: '#dc2626',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                    }}
                >
                    {error}
                </p>
            )}

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
