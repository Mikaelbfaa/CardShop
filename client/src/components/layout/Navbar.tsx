'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from '@/contexts/SearchContext';
import { formatPrice } from '@/lib/utils';
import { LogOut, Settings, X } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
    { label: 'LANÇAMENTOS', href: '/?view=lancamentos#cards' },
    { label: 'YU-GI-OH!', href: '/?game=yugioh#cards' },
    { label: 'MAGIC: THE GATHERING', href: '/?game=mtg#cards' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { user, isAuthenticated, loading, logout } = useAuth();
    const { itemCount, bumping } = useCart();
    const { searchQuery, setSearchQuery, products, ensureProducts } = useSearch();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // Easter egg: tap logo 7x for holographic mode
    const logoClickCount = useRef(0);
    const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [holoActive, setHoloActive] = useState(false);

    const handleLogoClick = useCallback(() => {
        if (holoActive) return;
        logoClickCount.current += 1;

        if (logoClickCount.current === 1) {
            logoClickTimer.current = setTimeout(() => {
                logoClickCount.current = 0;
            }, 3000);
        }

        if (logoClickCount.current >= 7) {
            logoClickCount.current = 0;
            if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
            setHoloActive(true);
            document.documentElement.classList.add('holo-mode');
            setTimeout(() => {
                document.documentElement.classList.remove('holo-mode');
                setHoloActive(false);
            }, 5000);
        }
    }, [holoActive]);

    const searchResults = useMemo(() => {
        if (isHomePage || !searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase().trim();
        return products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 4);
    }, [isHomePage, searchQuery, products]);

    // Durante loading, renderiza como deslogado para evitar hydration mismatch
    const showAuth = !loading && isAuthenticated;
    const isAdmin = showAuth && user?.role === 'ADMIN';
    const userInitial = user?.name?.charAt(0).toUpperCase() || '?';

    const clearSearch = () => {
        setSearchQuery('');
        setSearchOpen(false);
    };

    const toggleSearch = () => {
        if (searchOpen) {
            clearSearch();
        } else {
            setSearchOpen(true);
            if (!isHomePage) ensureProducts();
        }
    };

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
                <Link href="/" className={styles.logoLink} onClick={handleLogoClick}>
                    <span className={`${styles.logoPart} ${styles.logoLeft} comic-outline comic-shadow ${holoActive ? styles.logoHolo : ''}`}>
                        CARD
                    </span>
                    <span className={`${styles.logoPart} ${styles.logoRight} comic-outline comic-shadow ${holoActive ? styles.logoHolo : ''}`}>
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
                            onClick={clearSearch}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Icons */}
                <div className={styles.desktopIcons}>
                    {isAdmin && (
                        <Link href="/admin/users" className={styles.adminButton} aria-label="Painel Admin">
                            <Settings size={16} />
                            <span>ADMIN</span>
                        </Link>
                    )}
                    <button className={styles.iconButton} aria-label="Buscar" onClick={toggleSearch}>
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
                                <LogOut size={16} />
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
                    {isAdmin && (
                        <Link
                            href="/admin/users"
                            className={`${styles.navLinkBase} ${styles.mobileNavLink}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            PAINEL ADMIN
                        </Link>
                    )}
                    <div className={styles.mobileIcons}>
                        <button className={styles.iconButton} aria-label="Buscar" onClick={toggleSearch}>
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
                                    <LogOut size={16} />
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

            {/* Barra de busca */}
            {searchOpen && (
                <div className={styles.searchBar}>
                    <div className={`${styles.searchBarInner} container`}>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Escape' && clearSearch()}
                            autoFocus
                        />
                        <button
                            className={styles.iconButton}
                            onClick={clearSearch}
                            aria-label="Fechar busca"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Resultados da busca (fora da homepage) */}
                    {!isHomePage && searchQuery.trim() && (
                        <div className={`${styles.searchResults} container`}>
                            {searchResults.length > 0 ? (
                                searchResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        className={styles.searchResultItem}
                                        onClick={clearSearch}
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={40}
                                            height={56}
                                            className={styles.searchResultImage}
                                        />
                                        <div className={styles.searchResultInfo}>
                                            <span className={styles.searchResultName}>
                                                {product.name}
                                            </span>
                                            <span className={styles.searchResultPrice}>
                                                {formatPrice(product.price)}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className={styles.searchNoResults}>
                                    Nenhum produto encontrado
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
