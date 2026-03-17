'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Login.module.css';

const LOGIN_VARIANTS = [
    { src: '/images/login1.jpg', color: '#c27c36', glow: 'rgba(194, 124, 54, 0.3)' },
    { src: '/images/login2.jpg', color: '#1a5276', glow: 'rgba(26, 82, 118, 0.3)' },
    { src: '/images/login3.jpg', color: '#7b2d8e', glow: 'rgba(123, 45, 142, 0.3)' },
    { src: '/images/login4.jpg', color: '#8b1a1a', glow: 'rgba(139, 26, 26, 0.3)' },
    { src: '/images/login5.jpg', color: '#2d6b30', glow: 'rgba(45, 107, 48, 0.3)' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const variant = LOGIN_VARIANTS[activeIndex];

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % LOGIN_VARIANTS.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Left Panel - Form */}
            <div className={styles.leftPanel}>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.logoLink}>
                        <span className={`${styles.logoPart} ${styles.logoCard}`}>CARD</span>
                        <span className={`${styles.logoPart} ${styles.logoShop}`}>SHOP</span>
                    </Link>
                </nav>

                <div className={styles.formArea}>
                    <div className={styles.formContainer}>
                        <div className={styles.headingGroup}>
                            <span className={styles.badge}>Acesse sua conta</span>
                            <h1 className={styles.heading}>
                                Bem-vindo
                                <br />
                                de volta.
                            </h1>
                            <p className={styles.subtitle}>
                                Entre para gerenciar e aumentar sua coleção
                            </p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.fieldGroup}>
                                <label className={styles.label} htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className={styles.input}
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <div className={styles.labelRow}>
                                    <label className={styles.label} htmlFor="password">
                                        Senha
                                    </label>
                                    <span className={styles.forgotLink}>Esqueceu a senha?</span>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'ENTRANDO...' : 'ENTRAR'}
                            </button>
                        </form>

                        <div className={styles.signupSection}>
                            <p className={styles.signupText}>
                                Não tem uma conta?{' '}
                                <Link href="/register" className={styles.signupLink}>
                                    Cadastre-se agora
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Right Panel - Decorative */}
            <div
                className={styles.rightPanel}
                style={{
                    background: `linear-gradient(135deg, ${variant.color}15 0%, ${variant.color}30 50%, ${variant.color}10 100%)`,
                }}
            >
                <div
                    className={styles.colorBlur}
                    style={{ background: variant.color }}
                />
                <div
                    className={styles.colorBlurSecondary}
                    style={{ background: variant.color }}
                />
                <div className={styles.decorCard} style={{ boxShadow: `12px 12px 0px ${variant.color}80` }}>
                    {LOGIN_VARIANTS.map((v, i) => (
                        <Image
                            key={v.src}
                            src={v.src}
                            alt="Card art"
                            width={531}
                            height={1620}
                            className={`${styles.cardImage} ${i === activeIndex ? styles.cardImageActive : ''}`}
                            priority={i === 0}
                        />
                    ))}
                </div>
                <div className={styles.floatingBadgeTop} style={{ background: variant.color }}>
                    PLANESWALKER
                </div>
                <div className={styles.floatingBadgeBottom}>
                    NOVA COLEÇÃO
                </div>
                <div className={styles.decorDots} />
                <div className={styles.limeStar} />
                <div className={styles.marquee}>
                    <div className={`${styles.marqueeTrack} animate-marquee`}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <span key={i} className={styles.marqueeText}>
                                {i % 2 === 0
                                    ? '• Novo Drop Disponível'
                                    : '• Frete Grátis para todo o Brasil'}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
