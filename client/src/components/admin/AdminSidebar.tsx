'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllOrders } from '@/lib/api';
import styles from './AdminSidebar.module.css';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badgeKey?: string;
}

const PackageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

const OrderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="14" viewBox="0 0 24 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const ChartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

const NAV_ITEMS: NavItem[] = [
    { label: 'Produtos', href: '/admin/products', icon: <PackageIcon /> },
    { label: 'Pedidos', href: '/admin/orders', icon: <OrderIcon />, badgeKey: 'orders' },
    { label: 'Usuários', href: '/admin/users', icon: <UsersIcon /> },
    { label: 'Relatórios', href: '/admin/reports', icon: <ChartIcon /> },
    { label: 'Configurações', href: '/admin/settings', icon: <SettingsIcon /> },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [orderCount, setOrderCount] = useState<number>(0);

    useEffect(() => {
        fetchAllOrders()
            .then((orders) => setOrderCount(orders.length))
            .catch(() => {});
    }, []);

    const badges: Record<string, number> = { orders: orderCount };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoWrap}>
                <div className={styles.logo}>
                    <div className={styles.logoCard}>
                        <span className={styles.logoCardShadow} />
                        <span className={styles.logoCardText} style={{ transform: 'rotate(-2deg)' }}>
                            CARD
                        </span>
                    </div>
                    <div className={styles.logoCard}>
                        <span className={styles.logoCardShadow} />
                        <span
                            className={`${styles.logoCardText} ${styles.logoCardTextAlt}`}
                            style={{ transform: 'rotate(2deg)' }}
                        >
                            SHOP
                        </span>
                    </div>
                </div>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                            {item.badgeKey && badges[item.badgeKey] > 0 && (
                                <span className={styles.navBadge}>{badges[item.badgeKey]}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.userSection}>
                <div className={styles.userAvatar}>
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{user?.name || 'Admin'}</span>
                    <span className={styles.userEmail}>{user?.email || 'admin@cardshop.br'}</span>
                </div>
            </div>
        </aside>
    );
}
