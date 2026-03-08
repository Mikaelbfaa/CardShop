'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
    { label: 'LANÇAMENTOS', href: '/' },
    { label: 'YU-GI-OH!', href: '/' },
    { label: 'MAGIC: THE GATHERING', href: '/' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAuthenticated, loading, logout } = useAuth();
    const { itemCount, bumping } = useCart();

    // Durante loading, renderiza como deslogado para evitar hydration mismatch
    const showAuth = !loading && isAuthenticated;
    const userInitial = user?.name?.charAt(0).toUpperCase() || '?';

    const cartBadgeClass = [
        styles.cartBadge,
        bumping ? styles.cartBadgeBump : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav className={styles.nav}>
            <div className={`${styles.container} container`}>
                {/* Logo */}
                <Link href="/" className={styles.logoLink}>
                    <span className={`${styles.logoPart} ${styles.logoLeft} comic-outline comic-shadow`}>
                        CARD
                    </span>
                    <span className={`${styles.logoPart} ${styles.logoRight} comic-outline comic-shadow`}>
                        SHOP
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className={styles.desktopNav}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`${styles.navLinkBase} ${styles.navLink}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Icons */}
                <div className={styles.desktopIcons}>
                    <button className={styles.iconButton} aria-label="Buscar">
                        <Image src="/icons/search.svg" alt="Buscar" width={20} height={20} />
                    </button>

                    {showAuth ? (
                        <div className={styles.userMenu}>
                            <Link
                                href="/orders"
                                className={styles.avatarButton}
                                aria-label="Meus pedidos"
                                title={user?.name}
                            >
                                {userInitial}
                            </Link>
                            <button
                                className={styles.logoutButton}
                                onClick={logout}
                                aria-label="Sair"
                                title="Sair"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16,17 21,12 16,7" />
                                    <line x1="21" x2="9" y1="12" y2="12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.iconButton} aria-label="Minha conta">
                            <Image src="/icons/user.svg" alt="Conta" width={18} height={18} />
                        </Link>
                    )}

                    <Link
                        href="/cart"
                        className={`${styles.cartButton} comic-outline comic-shadow-sm`}
                        aria-label="Carrinho"
                    >
                        <Image src="/icons/cart.svg" alt="Carrinho" width={18} height={20} />
                        <span className={cartBadgeClass}>{itemCount}</span>
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Menu"
                >
                    <div className={styles.hamburgerLines} data-open={mobileOpen}>
                        <span className={styles.hamburgerLine} />
                        <span className={styles.hamburgerLine} />
                        <span className={styles.hamburgerLine} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className={styles.mobileMenu}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`${styles.navLinkBase} ${styles.mobileNavLink}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className={styles.mobileIcons}>
                        <button className={styles.iconButton} aria-label="Buscar">
                            <Image src="/icons/search.svg" alt="Buscar" width={20} height={20} />
                        </button>

                        {showAuth ? (
                            <>
                                <Link
                                    href="/orders"
                                    className={styles.avatarButton}
                                    aria-label="Meus pedidos"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {userInitial}
                                </Link>
                                <button
                                    className={styles.logoutButton}
                                    onClick={() => {
                                        setMobileOpen(false);
                                        logout();
                                    }}
                                    aria-label="Sair"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16,17 21,12 16,7" />
                                        <line x1="21" x2="9" y1="12" y2="12" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className={styles.iconButton}
                                aria-label="Minha conta"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Image src="/icons/user.svg" alt="Conta" width={18} height={18} />
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            className={`${styles.cartButton} comic-outline comic-shadow-sm`}
                            aria-label="Carrinho"
                            onClick={() => setMobileOpen(false)}
                        >
                            <Image src="/icons/cart.svg" alt="Carrinho" width={18} height={20} />
                            <span className={cartBadgeClass}>{itemCount}</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
