'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '@/lib/api';
import { formatPrice, formatOrderDate } from '@/lib/utils';
import {
    ORDER_STATUS_FILTERS,
    VALID_STATUS_TRANSITIONS,
    ADMIN_ORDER_STATUS_CONFIG,
} from '@/lib/constants';
import type { AdminOrder, OrderStatus } from '@/lib/types';
import styles from './Orders.module.css';

/* ===== Constants ===== */

const ORDERS_PER_PAGE = 5;

/* ===== Inline Icons ===== */

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const FilterIcon = () => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="0" y1="2" x2="12" y2="2" />
        <line x1="2" y1="5" x2="10" y2="5" />
        <line x1="4" y1="8" x2="8" y2="8" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 1 1 6 6 11" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="2 1 7 6 2 11" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/* ===== Status Dropdown ===== */

function StatusDropdown({
    order,
    disabled,
    onChange,
}: {
    order: AdminOrder;
    disabled: boolean;
    onChange: (id: number, status: OrderStatus) => void;
}) {
    const config = ADMIN_ORDER_STATUS_CONFIG[order.status];
    const transitions = VALID_STATUS_TRANSITIONS[order.status];
    const isTerminal = transitions.length === 0;

    return (
        <select
            className={styles.statusSelect}
            value={order.status}
            disabled={disabled || isTerminal}
            onChange={(e) => onChange(order.id, e.target.value as OrderStatus)}
            style={{
                color: config.color,
                backgroundColor: config.bg,
                borderColor: config.color,
            }}
        >
            <option value={order.status}>{config.label}</option>
            {transitions.map((s) => (
                <option key={s} value={s}>
                    {ADMIN_ORDER_STATUS_CONFIG[s].label}
                </option>
            ))}
        </select>
    );
}

/* ===== Delete Modal ===== */

function DeleteModal({
    order,
    onClose,
    onConfirm,
}: {
    order: AdminOrder;
    onClose: () => void;
    onConfirm: (id: number) => Promise<void>;
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setDeleting(true);
        try {
            await onConfirm(order.id);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao excluir');
        } finally {
            setDeleting(false);
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Excluir Pedido</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <p className={styles.deleteMessage}>
                        Tem certeza que deseja excluir o pedido <strong>{order.code}</strong>?
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Excluindo...' : 'Excluir'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ===== Page ===== */

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<AdminOrder | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllOrders();
            setOrders(data);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    /* Derived data */
    const filteredOrders = useMemo(() => {
        let result = orders;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (o) =>
                    o.code.toLowerCase().includes(q) ||
                    o.user.name.toLowerCase().includes(q) ||
                    o.user.email.toLowerCase().includes(q)
            );
        }

        if (statusFilter) {
            result = result.filter((o) => o.status === statusFilter);
        }

        if (dateFilter) {
            const now = new Date();
            result = result.filter((o) => {
                const created = new Date(o.createdAt);
                const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
                switch (dateFilter) {
                    case 'today':
                        return diffDays < 1;
                    case 'week':
                        return diffDays <= 7;
                    case 'month':
                        return diffDays <= 30;
                    case 'quarter':
                        return diffDays <= 90;
                    default:
                        return true;
                }
            });
        }

        return result;
    }, [orders, searchQuery, statusFilter, dateFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedOrders = filteredOrders.slice(
        (safePage - 1) * ORDERS_PER_PAGE,
        safePage * ORDERS_PER_PAGE
    );

    /* Actions */
    const handleStatusChange = async (id: number, status: OrderStatus) => {
        setUpdatingStatus(id);
        try {
            const updated = await updateOrderStatus(id, status);
            setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        } catch {
            // silently fail — the dropdown will revert
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDelete = async (id: number) => {
        await deleteOrder(id);
        setOrders((prev) => prev.filter((o) => o.id !== id));
    };

    const handleExportCSV = () => {
        const headers = ['Pedido', 'Cliente', 'Email', 'Itens', 'Data', 'Total', 'Status'];
        const rows = filteredOrders.map((o) => [
            o.code,
            o.user.name,
            o.user.email,
            String(o.items.length),
            new Date(o.createdAt).toLocaleDateString('pt-BR'),
            formatPrice(o.totalPrice),
            ADMIN_ORDER_STATUS_CONFIG[o.status].label,
        ]);

        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, dateFilter]);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Pedidos</h1>
                    <p className={styles.subtitle}>
                        Gerencie os pedidos da loja.
                    </p>
                </div>
                <button className={styles.exportButton} onClick={handleExportCSV}>
                    <DownloadIcon />
                    <span>EXPORTAR CSV</span>
                </button>
            </div>

            {/* Filters Toolbar */}
            <div className={styles.toolbar}>
                <span className={styles.toolbarDecoration} />
                <div className={styles.searchWrap}>
                    <span className={styles.searchIcon}>
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar por código, cliente ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.toolbarActions}>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {ORDER_STATUS_FILTERS.map((f) => (
                                <option key={f.label} value={f.value || ''}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <span className={styles.selectChevron}>
                            <ChevronDownIcon />
                        </span>
                    </div>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value="">Período</option>
                            <option value="today">Hoje</option>
                            <option value="week">Últimos 7 dias</option>
                            <option value="month">Últimos 30 dias</option>
                            <option value="quarter">Últimos 90 dias</option>
                        </select>
                        <span className={styles.selectChevron}>
                            <ChevronDownIcon />
                        </span>
                    </div>
                    <button
                        className={styles.filterButton}
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('');
                            setDateFilter('');
                        }}
                    >
                        <FilterIcon />
                        <span>Limpar</span>
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.tableContainer}>
                <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeaderRow}>
                                <th className={`${styles.th} ${styles.thLeft}`}>Pedido</th>
                                <th className={`${styles.th} ${styles.thLeft}`}>Cliente</th>
                                <th className={`${styles.th} ${styles.thLeft}`}>Itens</th>
                                <th className={styles.th}>Data</th>
                                <th className={styles.th}>Total</th>
                                <th className={styles.th}>Status</th>
                                <th className={`${styles.th} ${styles.thRight}`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>
                                        Carregando pedidos...
                                    </td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => {
                                    const isCancelled = order.status === 'CANCELLED';
                                    const itemNames = order.items
                                        .map((i) => i.product.name)
                                        .join(', ');

                                    return (
                                        <tr
                                            key={order.id}
                                            className={`${styles.row} ${isCancelled ? styles.cancelledRow : ''}`}
                                        >
                                            <td className={`${styles.td} ${styles.tdLeft}`}>
                                                <span
                                                    className={`${styles.orderCode} ${isCancelled ? styles.orderCodeCancelled : ''}`}
                                                >
                                                    {order.code}
                                                </span>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdLeft}`}>
                                                <div className={styles.clientCell}>
                                                    <span className={styles.clientName}>
                                                        {order.user.name}
                                                    </span>
                                                    <span className={styles.clientEmail}>
                                                        {order.user.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdLeft}`}>
                                                <div className={styles.itemsCell}>
                                                    <span className={styles.itemsBadge}>
                                                        {order.items.length}
                                                    </span>
                                                    <span className={styles.itemsText} title={itemNames}>
                                                        {itemNames}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={styles.dateText}>
                                                    {formatOrderDate(order.createdAt)}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={styles.price}>
                                                    {formatPrice(order.totalPrice)}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <StatusDropdown
                                                    order={order}
                                                    disabled={updatingStatus === order.id}
                                                    onChange={handleStatusChange}
                                                />
                                            </td>
                                            <td className={`${styles.td} ${styles.tdActions}`}>
                                                <button
                                                    className={styles.actionBtn}
                                                    title="Ver detalhes"
                                                    onClick={() =>
                                                        router.push(`/orders/${order.id}`)
                                                    }
                                                >
                                                    <EyeIcon />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                    title="Excluir"
                                                    onClick={() => setDeleteTarget(order)}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                        Mostrando{' '}
                        {filteredOrders.length === 0
                            ? 0
                            : (safePage - 1) * ORDERS_PER_PAGE + 1}
                        -{Math.min(safePage * ORDERS_PER_PAGE, filteredOrders.length)} de{' '}
                        {filteredOrders.length} pedidos
                    </span>
                    <div className={styles.paginationButtons}>
                        <button
                            className={styles.pageBtn}
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeftIcon />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (safePage <= 3) {
                                pageNum = i + 1;
                            } else if (safePage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = safePage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`${styles.pageBtn} ${pageNum === safePage ? styles.pageBtnActive : ''}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            className={styles.pageBtn}
                            disabled={safePage >= totalPages}
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className={styles.footer}>&copy; 2024 CardShop Inc. Sistema v2.4.1</p>

            {/* Delete Modal */}
            {deleteTarget && (
                <DeleteModal
                    order={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
