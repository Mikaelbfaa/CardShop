'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { fetchProducts, deleteProduct, updateProduct } from '@/lib/api';
import { formatPrice, getGameLabel } from '@/lib/utils';
import type { Product } from '@/lib/types';
import {
    Plus,
    TrendingUp,
    AlertTriangle,
    Search,
    SlidersHorizontal,
    ChevronDown,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';
import styles from './Products.module.css';

/* ===== Constants ===== */

const LOW_STOCK_THRESHOLD = 5;
const ITEMS_PER_PAGE = 10;

/* ===== Helpers ===== */

type StockStatus = 'active' | 'low_stock' | 'out_of_stock';

function getStockStatus(stock: number): StockStatus {
    if (stock === 0) return 'out_of_stock';
    if (stock <= LOW_STOCK_THRESHOLD) return 'low_stock';
    return 'active';
}

const STATUS_LABEL: Record<StockStatus, string> = {
    active: 'Ativo',
    low_stock: 'Baixo Estoque',
    out_of_stock: 'Esgotado',
};

const STATUS_CLASS: Record<StockStatus, string> = {
    active: styles.statusActive,
    low_stock: styles.statusLow,
    out_of_stock: styles.statusOut,
};

/* ===== Stat Card ===== */

function StatCard({
    title,
    value,
    footer,
    accentColor,
}: {
    title: string;
    value: string;
    footer: React.ReactNode;
    accentColor: string;
}) {
    return (
        <div className={styles.statCard}>
            <span className={styles.statAccent} style={{ background: accentColor }} />
            <span className={styles.statTitle}>{title}</span>
            <span className={styles.statValue}>{value}</span>
            <div className={styles.statFooter}>{footer}</div>
        </div>
    );
}

/* ===== Stock Bar ===== */

function StockBar({ stock, maxStock }: { stock: number; maxStock: number }) {
    const pct = maxStock > 0 ? Math.round((stock / maxStock) * 100) : 0;
    const status = getStockStatus(stock);

    const barColor =
        status === 'out_of_stock'
            ? 'transparent'
            : status === 'low_stock'
              ? '#ef4444'
              : 'var(--color-brand-lime)';

    const textColor =
        status === 'out_of_stock'
            ? 'var(--color-gray-400)'
            : status === 'low_stock'
              ? '#dc2626'
              : 'var(--color-gray-600)';

    return (
        <div className={styles.stockWrap}>
            <div className={styles.stockBarOuter}>
                <div
                    className={styles.stockBarInner}
                    style={{ width: `${pct}%`, background: barColor }}
                />
            </div>
            <span className={styles.stockText} style={{ color: textColor }}>
                {stock} restantes
            </span>
        </div>
    );
}

/* ===== Edit Modal ===== */

function EditModal({
    product,
    onClose,
    onSave,
}: {
    product: Product;
    onClose: () => void;
    onSave: (id: number, data: { name: string; price: number; stock: number; description: string }) => Promise<void>;
}) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock));
    const [description, setDescription] = useState(product.description || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onSave(product.id, {
                name,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                description,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Editar Produto</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <label className={styles.fieldLabel}>
                        Nome
                        <input
                            type="text"
                            className={styles.fieldInput}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.fieldLabel}>
                        Preço (R$)
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className={styles.fieldInput}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.fieldLabel}>
                        Estoque
                        <input
                            type="number"
                            min="0"
                            className={styles.fieldInput}
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </label>
                    <label className={styles.fieldLabel}>
                        Descrição
                        <textarea
                            className={styles.fieldTextarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </label>
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

/* ===== Delete Confirm Modal ===== */

function DeleteModal({
    product,
    onClose,
    onConfirm,
}: {
    product: Product;
    onClose: () => void;
    onConfirm: (id: number) => Promise<void>;
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setDeleting(true);
        try {
            await onConfirm(product.id);
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
                    <h2 className={styles.modalTitle}>Excluir Produto</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <p className={styles.deleteMessage}>
                        Tem certeza que deseja excluir <strong>{product.name}</strong>?
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

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [gameFilter, setGameFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch {
            // fetchProducts already returns [] on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    /* Derived data */
    const filteredProducts = useMemo(() => {
        let result = products;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    String(p.id).includes(q) ||
                    (p.edition && p.edition.toLowerCase().includes(q))
            );
        }

        if (gameFilter) {
            result = result.filter((p) => p.game === gameFilter);
        }

        if (statusFilter) {
            result = result.filter((p) => getStockStatus(p.stock) === statusFilter);
        }

        return result;
    }, [products, searchQuery, gameFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedProducts = filteredProducts.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const totalCards = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;

    const formatStatValue = (value: number) => {
        if (value >= 1000) {
            return formatPrice(value).replace(/,\d{2}$/, '');
        }
        return formatPrice(value);
    };

    /* Actions */
    const handleSave = async (
        id: number,
        data: { name: string; price: number; stock: number; description: string }
    ) => {
        await updateProduct(id, data);
        await loadProducts();
    };

    const handleDelete = async (id: number) => {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, gameFilter, statusFilter]);

    const maxStock = Math.max(...products.map((p) => p.stock), 1);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Inventário</h1>
                    <p className={styles.subtitle}>
                        Gerencie seu estoque de Yu-Gi-Oh! e MTG.
                    </p>
                </div>
                <div className={styles.addButtonWrap}>
                    <button className={styles.addButton}>
                        <Plus size={20} strokeWidth={3} />
                        <span>ADICIONAR CARTA</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Total Cartas"
                    value={totalCards.toLocaleString('pt-BR')}
                    accentColor="#8b5cf6"
                    footer={
                        <span className={styles.statPositive}>
                            <TrendingUp size={14} color="#16a34a" /> {products.length} produtos cadastrados
                        </span>
                    }
                />
                <StatCard
                    title="Valor Estoque"
                    value={formatStatValue(totalValue)}
                    accentColor="var(--color-brand-lime)"
                    footer={
                        <span className={styles.statNeutral}>Atualizado agora</span>
                    }
                />
                <StatCard
                    title="Alertas Baixos"
                    value={String(lowStockCount)}
                    accentColor="#ef4444"
                    footer={
                        lowStockCount > 0 ? (
                            <span className={styles.statNegative}>
                                <AlertTriangle size={14} color="#dc2626" /> Requer atenção
                            </span>
                        ) : (
                            <span className={styles.statNeutral}>Tudo em ordem</span>
                        )
                    }
                />
            </div>

            {/* Filters Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <span className={styles.searchIcon}>
                        <Search size={18} color="#6b7280" />
                    </span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar por nome, set ou ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.toolbarActions}>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            value={gameFilter}
                            onChange={(e) => setGameFilter(e.target.value)}
                        >
                            <option value="">Todos os Jogos</option>
                            <option value="yugioh">Yu-Gi-Oh!</option>
                            <option value="mtg">MTG</option>
                        </select>
                        <span className={styles.selectChevron}>
                            <ChevronDown size={16} color="#6b7280" />
                        </span>
                    </div>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="active">Ativo</option>
                            <option value="low_stock">Baixo Estoque</option>
                            <option value="out_of_stock">Esgotado</option>
                        </select>
                        <span className={styles.selectChevron}>
                            <ChevronDown size={16} color="#6b7280" />
                        </span>
                    </div>
                    <button
                        className={styles.filterButton}
                        onClick={() => {
                            setSearchQuery('');
                            setGameFilter('');
                            setStatusFilter('');
                        }}
                    >
                        <SlidersHorizontal size={12} />
                        <span>Limpar</span>
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className={styles.tableContainer}>
                <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeaderRow}>
                                <th className={styles.thCheck}>
                                    <input type="checkbox" className={styles.checkbox} />
                                </th>
                                <th className={`${styles.th} ${styles.thLeft}`}>Carta</th>
                                <th className={`${styles.th} ${styles.thLeft}`}>Jogo / Set</th>
                                <th className={styles.th}>Preço</th>
                                <th className={styles.th}>Estoque</th>
                                <th className={styles.th}>Status</th>
                                <th className={`${styles.th} ${styles.thRight}`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>
                                        Carregando produtos...
                                    </td>
                                </tr>
                            ) : paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => {
                                    const status = getStockStatus(product.stock);
                                    return (
                                        <tr key={product.id} className={styles.row}>
                                            <td className={styles.tdCheck}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                />
                                            </td>
                                            <td className={`${styles.td} ${styles.tdLeft}`}>
                                                <div className={styles.productCell}>
                                                    <div className={styles.productImage}>
                                                        {product.image ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                sizes="48px"
                                                                className={
                                                                    styles.productImg
                                                                }
                                                            />
                                                        ) : (
                                                            <span
                                                                className={
                                                                    styles.productImagePlaceholder
                                                                }
                                                            >
                                                                {product.name.charAt(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.productInfo}>
                                                        <span
                                                            className={styles.productName}
                                                        >
                                                            {product.name}
                                                        </span>
                                                        <span className={styles.productId}>
                                                            ID: #{product.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`${styles.td} ${styles.tdLeft}`}>
                                                <div className={styles.gameCell}>
                                                    <span className={styles.gameBadge}>
                                                        {product.game === 'yugioh'
                                                            ? 'Yu-Gi-Oh!'
                                                            : 'MTG'}
                                                    </span>
                                                    <span className={styles.gameSet}>
                                                        {product.edition ||
                                                            getGameLabel(product.game)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.td}>
                                                <span className={styles.price}>
                                                    {formatPrice(product.price)}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <StockBar
                                                    stock={product.stock}
                                                    maxStock={maxStock}
                                                />
                                            </td>
                                            <td className={styles.td}>
                                                <span
                                                    className={`${styles.statusBadge} ${STATUS_CLASS[status]}`}
                                                >
                                                    {STATUS_LABEL[status]}
                                                </span>
                                            </td>
                                            <td
                                                className={`${styles.td} ${styles.tdActions}`}
                                            >
                                                <button
                                                    className={styles.actionBtn}
                                                    title="Editar"
                                                    onClick={() =>
                                                        setEditProduct(product)
                                                    }
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                    title="Excluir"
                                                    onClick={() =>
                                                        setDeleteTarget(product)
                                                    }
                                                >
                                                    <Trash2 size={16} />
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
                        Mostrando {filteredProducts.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}-
                        {Math.min(safePage * ITEMS_PER_PAGE, filteredProducts.length)} de{' '}
                        {filteredProducts.length} itens
                    </span>
                    <div className={styles.paginationButtons}>
                        <button
                            className={styles.pageBtn}
                            disabled={safePage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft size={14} />
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
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className={styles.footer}>&copy; 2024 CardShop Inc. Sistema v2.4.1</p>

            {/* Modals */}
            {editProduct && (
                <EditModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSave={handleSave}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    product={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
