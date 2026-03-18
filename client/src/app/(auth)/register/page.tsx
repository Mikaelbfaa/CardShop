'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IdCard } from 'lucide-react';
import styles from './Register.module.css';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const formatCpf = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        if (digits.length <= 9)
            return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    };

    const handleCpfChange = (value: string) => {
        setCpf(formatCpf(value));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (!termsAccepted) {
            setError('Você deve aceitar os Termos de Serviço.');
            return;
        }

        const rawCpf = cpf.replace(/\D/g, '');
        if (rawCpf.length !== 11) {
            setError('CPF deve conter 11 dígitos.');
            return;
        }

        setLoading(true);

        try {
            await register({ name, email, password, cpf: rawCpf });
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            {/* Decorative shapes */}
            <div className={styles.decoYellow} />
            <div className={styles.decoPink} />
            <div className={styles.decoBlue} />

            {/* Logo */}
            <div className={styles.logoSection}>
                <Link href="/" className={styles.logoLink}>
                    <span className={`${styles.logoPart} ${styles.logoCard}`}>CARD</span>
                    <span className={`${styles.logoPart} ${styles.logoShop}`}>SHOP</span>
                </Link>
                <span className={styles.subtitleBadge}>O seu deck começa aqui</span>
            </div>

            {/* Card */}
            <div className={styles.card}>
                <span className={styles.joinBadge}>Junte-se agora!</span>

                <h2 className={styles.cardHeading}>Criar Nova Conta</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="name">
                            Nome de Duelista
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <Image src="/icons/user-filled.svg" alt="" width={16} height={16} />
                            </span>
                            <input
                                id="name"
                                type="text"
                                className={styles.input}
                                placeholder="Seu nome ou nick"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="reg-email">
                            Email
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <Image src="/icons/email-filled.svg" alt="" width={16} height={16} />
                            </span>
                            <input
                                id="reg-email"
                                type="email"
                                className={styles.input}
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="cpf">
                            CPF
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <IdCard size={16} color="#9CA3AF" />
                            </span>
                            <input
                                id="cpf"
                                type="text"
                                className={styles.input}
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={(e) => handleCpfChange(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="reg-password">
                            Senha
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <Image src="/icons/lock-filled.svg" alt="" width={16} height={16} />
                            </span>
                            <input
                                id="reg-password"
                                type="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="confirm-password">
                            Confirmar Senha
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <Image src="/icons/lock-reset-filled.svg" alt="" width={16} height={16} />
                            </span>
                            <input
                                id="confirm-password"
                                type="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.termsGroup}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            id="terms"
                        />
                        <label htmlFor="terms" className={styles.termsLabel}>
                            Aceito os{' '}
                            <span className={styles.termsLink}>Termos de Serviço</span> e
                            Política de Privacidade
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
                    </button>
                </form>

                <div className={styles.loginSection}>
                    <p className={styles.loginText}>
                        Já tem uma conta?{' '}
                        <Link href="/login" className={styles.loginLink}>
                            Faça Login
                        </Link>
                    </p>
                </div>
            </div>

            <div className={styles.dots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
        </div>
    );
}
