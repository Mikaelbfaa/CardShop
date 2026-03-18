'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { fetchAllUsers, updateUserRole, deleteUser } from '@/lib/api';
import type { AdminUser } from '@/lib/types';
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    Pencil,
    Download,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    TrendingUp,
} from 'lucide-react';
import styles from './Users.module.css';

/* ===== Constants ===== */

const USERS_PER_PAGE = 10;

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

/* ===== Edit Role Modal ===== */

function EditRoleModal({
    user,
    onClose,
    onSave,
}: {
    user: AdminUser;
    onClose: () => void;
    onSave: (id: number, role: 'CUSTOMER' | 'ADMIN') => Promise<void>;
}) {
    const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>(user.role);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onSave(user.id, role);
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
                    <h2 className={styles.modalTitle}>Alterar Role</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <p className={styles.deleteMessage}>
                        Alterar permissão de <strong>{user.name}</strong>
                    </p>
                    <label className={styles.fieldLabel}>
                        Role
                        <select
                            className={styles.fieldSelect}
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'ADMIN')}
                        >
                            <option value="CUSTOMER">Cliente</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
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

/* ===== Delete Modal ===== */

function DeleteModal({
    user,
    onClose,
    onConfirm,
}: {
    user: AdminUser;
    onClose: () => void;
    onConfirm: (id: number) => Promise<void>;
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setDeleting(true);
        try {
            await onConfirm(user.id);
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
                    <h2 className={styles.modalTitle}>Excluir Usuário</h2>
                    <button className={styles.modalClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {error && <p className={styles.modalError}>{error}</p>}
                    <p className={styles.deleteMessage}>
                        Tem certeza que deseja excluir <strong>{user.name}</strong>?
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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    /* Derived data */
    const filteredUsers = useMemo(() => {
        let result = users;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    u.cpf.includes(q)
            );
        }

        if (roleFilter) {
            result = result.filter((u) => u.role === roleFilter);
        }

        return result;
    }, [users, searchQuery, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedUsers = filteredUsers.slice(
        (safePage - 1) * USERS_PER_PAGE,
        safePage * USERS_PER_PAGE
    );

    /* Stats */
    const adminCount = users.filter((u) => u.role === 'ADMIN').length;
    const now = new Date();
    const newUsersCount = users.filter((u) => {
        const created = new Date(u.createdAt);
        const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
    }).length;

    /* Actions */
    const handleRoleSave = async (id: number, role: 'CUSTOMER' | 'ADMIN') => {
        const updated = await updateUserRole(id, role);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    };

    const handleDelete = async (id: number) => {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const handleExportCSV = () => {
        const headers = ['Nome', 'Email', 'CPF', 'Telefone', 'Role', 'Cadastro'];
        const rows = filteredUsers.map((u) => [
            u.name,
            u.email,
            u.cpf,
            u.phone || '',
            u.role === 'ADMIN' ? 'Administrador' : 'Cliente',
            new Date(u.createdAt).toLocaleDateString('pt-BR'),
        ]);

        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter]);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Usuários</h1>
                    <p className={styles.subtitle}>
                        Gerencie os usuários da loja.
                    </p>
                </div>
                <button className={styles.exportButton} onClick={handleExportCSV}>
                    <Download size={18} />
                    <span>EXPORTAR CSV</span>
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Total Usuários"
                    value={String(users.length)}
                    accentColor="#8b5cf6"
                    footer={
                        <span className={styles.statNeutral}>
                            Cadastrados na plataforma
                        </span>
                    }
                />
                <StatCard
                    title="Administradores"
                    value={String(adminCount)}
                    accentColor="var(--color-brand-lime)"
                    footer={
                        <span className={styles.statNeutral}>
                            Com acesso ao painel
                        </span>
                    }
                />
                <StatCard
                    title="Novos (30 dias)"
                    value={String(newUsersCount)}
                    accentColor="#16a34a"
                    footer={
                        newUsersCount > 0 ? (
                            <span className={styles.statPositive}>
                                <TrendingUp size={14} color="#16a34a" /> Crescendo
                            </span>
                        ) : (
                            <span className={styles.statNeutral}>Sem novos cadastros</span>
                        )
                    }
                />
            </div>

            {/* Filters Toolbar */}
            <div className={styles.toolbar}>
                <span className={styles.toolbarDecoration} />
                <div className={styles.searchWrap}>
                    <span className={styles.searchIcon}>
                        <Search size={18} color="#6b7280" />
                    </span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar por nome, email ou CPF..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.toolbarActions}>
                    <div className={styles.selectWrap}>
                        <select
                            className={styles.select}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="CUSTOMER">Cliente</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <span className={styles.selectChevron}>
                            <ChevronDown size={16} color="#6b7280" />
                        </span>
                    </div>
                    <button
                        className={styles.filterButton}
                        onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('');
                        }}
                    >
                        <SlidersHorizontal size={12} />
                        <span>Limpar</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className={styles.tableContainer}>
                <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeaderRow}>
                                <th className={`${styles.th} ${styles.thLeft}`}>Usuário</th>
                                <th className={styles.th}>CPF</th>
                                <th className={styles.th}>Telefone</th>
                                <th className={styles.th}>Role</th>
                                <th className={styles.th}>Cadastro</th>
                                <th className={`${styles.th} ${styles.thRight}`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>
                                        Carregando usuários...
                                    </td>
                                </tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>
                                        Nenhum usuário encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className={styles.row}>
                                        <td className={`${styles.td} ${styles.tdLeft}`}>
                                            <div className={styles.userCell}>
                                                <span className={styles.userName}>
                                                    {user.name}
                                                </span>
                                                <span className={styles.userEmail}>
                                                    {user.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.monoText}>{user.cpf}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.monoText}>
                                                {user.phone || '—'}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span
                                                className={`${styles.roleBadge} ${
                                                    user.role === 'ADMIN'
                                                        ? styles.roleAdmin
                                                        : styles.roleCustomer
                                                }`}
                                            >
                                                {user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.dateText}>
                                                {new Date(user.createdAt).toLocaleDateString(
                                                    'pt-BR'
                                                )}
                                            </span>
                                        </td>
                                        <td className={`${styles.td} ${styles.tdActions}`}>
                                            <button
                                                className={styles.actionBtn}
                                                title="Alterar role"
                                                onClick={() => setEditTarget(user)}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                title="Excluir"
                                                onClick={() => setDeleteTarget(user)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                        Mostrando{' '}
                        {filteredUsers.length === 0
                            ? 0
                            : (safePage - 1) * USERS_PER_PAGE + 1}
                        -{Math.min(safePage * USERS_PER_PAGE, filteredUsers.length)} de{' '}
                        {filteredUsers.length} usuários
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
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <p className={styles.footer}>&copy; 2024 CardShop Inc. Sistema v2.4.1</p>

            {/* Modals */}
            {editTarget && (
                <EditRoleModal
                    user={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={handleRoleSave}
                />
            )}
            {deleteTarget && (
                <DeleteModal
                    user={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
