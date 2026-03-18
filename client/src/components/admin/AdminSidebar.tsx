'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllOrders } from '@/lib/api';
import { Package, FileText, Users } from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badgeKey?: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Produtos', href: '/admin/products', icon: <Package size={20} /> },
    { label: 'Pedidos', href: '/admin/orders', icon: <FileText size={20} />, badgeKey: 'orders' },
    { label: 'Usuários', href: '/admin/users', icon: <Users size={20} /> },
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
                <Link href="/" className={styles.logo}>
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
                </Link>
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
