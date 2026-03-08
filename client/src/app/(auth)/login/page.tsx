'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

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
                                Entre para gerenciar sua coleção e batalhar.
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

                        <div className={styles.socialProof}>
                            <div className={styles.avatars}>
                                <div className={styles.avatar} />
                                <div className={styles.avatar} />
                                <div className={styles.avatar} />
                            </div>
                            <span className={styles.socialText}>Junte-se a 12k+ duelistas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Decorative */}
            <div className={styles.rightPanel}>
                <div className={styles.purpleBlur} />
                <div className={styles.decorCard1} />
                <div className={styles.decorCard2} />
                <span className={styles.hotBadge}>HOT</span>
                <span className={styles.rareDropBadge}>RARE DROP</span>
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
