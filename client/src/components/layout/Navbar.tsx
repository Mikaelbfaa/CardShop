'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

const NAV_LINKS = [
    { label: 'LANÇAMENTOS', href: '/' },
    { label: 'YU-GI-OH!', href: '/' },
    { label: 'MAGIC: THE GATHERING', href: '/' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

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
                    <button className={styles.iconButton} aria-label="Minha conta">
                        <Image src="/icons/user.svg" alt="Conta" width={18} height={18} />
                    </button>
                    <button
                        className={`${styles.cartButton} comic-outline comic-shadow-sm`}
                        aria-label="Carrinho"
                    >
                        <Image src="/icons/cart.svg" alt="Carrinho" width={18} height={20} />
                        <span className={styles.cartBadge}>0</span>
                    </button>
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
                        <button className={styles.iconButton} aria-label="Minha conta">
                            <Image src="/icons/user.svg" alt="Conta" width={18} height={18} />
                        </button>
                        <button
                            className={`${styles.cartButton} comic-outline comic-shadow-sm`}
                            aria-label="Carrinho"
                        >
                            <Image src="/icons/cart.svg" alt="Carrinho" width={18} height={20} />
                            <span className={styles.cartBadge}>0</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
