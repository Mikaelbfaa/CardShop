'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NAV_LINKS = [
    { label: 'LANÇAMENTOS', href: '/' },
    { label: 'YU-GI-OH!', href: '/' },
    { label: 'MAGIC: THE GATHERING', href: '/' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="bg-white border-b-4 border-black">
            <div className="mx-auto max-w-[1232px] px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-0.5 select-none">
                    <span className="font-archivo-black text-2xl bg-brand-lime text-black px-2 py-0.5 comic-outline comic-shadow rotate-[-2deg] inline-block">
                        CARD
                    </span>
                    <span className="font-archivo-black text-2xl bg-white text-black px-2 py-0.5 comic-outline comic-shadow rotate-[2deg] inline-block">
                        SHOP
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="font-archivo-black text-[18px] uppercase tracking-[0.45px] text-black hover:text-brand-pink transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Icons */}
                <div className="hidden lg:flex items-center gap-4">
                    <button className="p-2 hover:opacity-70 transition-opacity" aria-label="Buscar">
                        <Image src="/icons/search.svg" alt="Buscar" width={20} height={20} />
                    </button>
                    <button className="p-2 hover:opacity-70 transition-opacity" aria-label="Minha conta">
                        <Image src="/icons/user.svg" alt="Conta" width={18} height={18} />
                    </button>
                    <button
                        className="relative bg-brand-lime-alt comic-outline comic-shadow-sm p-2 hover:opacity-90 transition-opacity"
                        aria-label="Carrinho"
                    >
                        <Image src="/icons/cart.svg" alt="Carrinho" width={18} height={20} />
                        <span className="absolute -top-2 -right-2 bg-brand-pink-alt text-white font-inter text-[12px] font-bold w-5 h-5 rounded-full flex items-center justify-center rotate-[12deg]">
                            0
                        </span>
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="lg:hidden p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Menu"
                >
                    <div className="w-6 flex flex-col gap-1.5">
                        <span
                            className={`block h-0.5 bg-black transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
                        />
                        <span
                            className={`block h-0.5 bg-black transition-opacity ${mobileOpen ? 'opacity-0' : ''}`}
                        />
                        <span
                            className={`block h-0.5 bg-black transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t-2 border-black bg-white px-8 py-4 flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="font-archivo-black text-[16px] uppercase tracking-[0.45px] text-black"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                        <button className="p-2" aria-label="Buscar">
                            <Image src="/icons/search.svg" alt="Buscar" width={20} height={20} />
                        </button>
                        <button className="p-2" aria-label="Minha conta">
                            <Image src="/icons/user.svg" alt="Conta" width={18} height={18} />
                        </button>
                        <button
                            className="relative bg-brand-lime-alt comic-outline comic-shadow-sm p-2"
                            aria-label="Carrinho"
                        >
                            <Image src="/icons/cart.svg" alt="Carrinho" width={18} height={20} />
                            <span className="absolute -top-2 -right-2 bg-brand-pink-alt text-white font-inter text-[12px] font-bold w-5 h-5 rounded-full flex items-center justify-center rotate-[12deg]">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
