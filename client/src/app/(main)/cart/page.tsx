'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { fetchCart, updateCartItem, removeCartItem, clearCart, createOrder } from '@/lib/api';
import type { CartItem } from '@/lib/types';
import CartItemCard from '@/components/cart/CartItemCard';
import OrderSummary from '@/components/cart/OrderSummary';
import styles from './Cart.module.css';

export default function CartPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { setItemCount } = useCart();
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchCart()
            .then(setItems)
            .catch(() => setError('Erro ao carregar carrinho.'))
            .finally(() => setLoading(false));
    }, [isAuthenticated, authLoading, router]);

    // Sincroniza o badge do carrinho no Navbar
    useEffect(() => {
        setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
    }, [items, setItemCount]);

    const handleQuantityChange = async (id: number, delta: number) => {
        const item = items.find((i) => i.id === id);
        if (!item || updating) return;

        const newQty = Math.max(1, item.quantity + delta);
        setUpdating(true);
        try {
            const updated = await updateCartItem(id, newQty);
            setItems(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar item');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemove = async (id: number) => {
        if (updating) return;
        setUpdating(true);
        try {
            const updated = await removeCartItem(id);
            setItems(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao remover item');
        } finally {
            setUpdating(false);
        }
    };

    const handleClearCart = async () => {
        if (updating) return;
        setUpdating(true);
        try {
            await clearCart();
            setItems([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao limpar carrinho');
        } finally {
            setUpdating(false);
        }
    };

    const handleCheckout = async (shippingAddress: string) => {
        if (updating) return;
        setUpdating(true);
        setError('');
        try {
            await createOrder(shippingAddress);
            setItems([]);
            router.push('/orders');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido');
        } finally {
            setUpdating(false);
        }
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (authLoading || loading) {
        return (
            <section className={`${styles.page} container`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>SEU CARRINHO</h1>
                </div>
                <p
                    style={{
                        color: 'var(--color-gray-500)',
                        fontSize: '18px',
                        textAlign: 'center',
                        padding: '80px 0',
                    }}
                >
                    Carregando carrinho...
                </p>
            </section>
        );
    }

    if (items.length === 0) {
        return (
            <section className={`${styles.page} container`}>
                <div className={styles.header}>
                    <svg
                        className={styles.cartIcon}
                        width="48"
                        height="48"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 6V4H14V6H8ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18C4 17.45 4.19583 16.9792 4.5875 16.5875C4.97917 16.1958 5.45 16 6 16C6.55 16 7.02083 16.1958 7.4125 16.5875C7.80417 16.9792 8 17.45 8 18C8 18.55 7.80417 19.0208 7.4125 19.4125C7.02083 19.8042 6.55 20 6 20ZM16 20C15.45 20 14.9792 19.8042 14.5875 19.4125C14.1958 19.0208 14 18.55 14 18C14 17.45 14.1958 16.9792 14.5875 16.5875C14.9792 16.1958 15.45 16 16 16C16.55 16 17.0208 16.1958 17.4125 16.5875C17.8042 16.9792 18 17.45 18 18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20ZM0 2V0H3.275L7.525 9H14.525L18.425 2H20.7L16.3 9.95C16.1167 10.2833 15.8708 10.5417 15.5625 10.725C15.2542 10.9083 14.9167 11 14.55 11H7.1L6 13H18V15H6C5.25 15 4.67917 14.675 4.2875 14.025C3.89583 13.375 3.88333 12.7167 4.25 12.05L5.6 9.6L2 2H0Z"
                            fill="currentColor"
                        />
                    </svg>
                    <h1 className={styles.title}>SEU CARRINHO</h1>
                    <span className={styles.titleCount}>(VAZIO)</span>
                </div>
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>Seu carrinho está vazio.</p>
                    <Link href="/" className={styles.continueLink}>
                        <Image src="/icons/arrow-left.svg" alt="" width={16} height={16} />
                        <span>CONTINUAR COMPRANDO</span>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className={`${styles.page} container`}>
            <div className={styles.header}>
                <svg
                    className={styles.cartIcon}
                    width="48"
                    height="48"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8 6V4H14V6H8ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18C4 17.45 4.19583 16.9792 4.5875 16.5875C4.97917 16.1958 5.45 16 6 16C6.55 16 7.02083 16.1958 7.4125 16.5875C7.80417 16.9792 8 17.45 8 18C8 18.55 7.80417 19.0208 7.4125 19.4125C7.02083 19.8042 6.55 20 6 20ZM16 20C15.45 20 14.9792 19.8042 14.5875 19.4125C14.1958 19.0208 14 18.55 14 18C14 17.45 14.1958 16.9792 14.5875 16.5875C14.9792 16.1958 15.45 16 16 16C16.55 16 17.0208 16.1958 17.4125 16.5875C17.8042 16.9792 18 17.45 18 18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20ZM0 2V0H3.275L7.525 9H14.525L18.425 2H20.7L16.3 9.95C16.1167 10.2833 15.8708 10.5417 15.5625 10.725C15.2542 10.9083 14.9167 11 14.55 11H7.1L6 13H18V15H6C5.25 15 4.67917 14.675 4.2875 14.025C3.89583 13.375 3.88333 12.7167 4.25 12.05L5.6 9.6L2 2H0Z"
                        fill="currentColor"
                    />
                </svg>
                <h1 className={styles.title}>SEU CARRINHO</h1>
                <span className={styles.titleCount}>({itemCount} ITENS)</span>
            </div>

            {error && (
                <p
                    style={{
                        color: '#dc2626',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                    }}
                >
                    {error}
                </p>
            )}

            <div className={styles.content}>
                <div className={styles.cartColumn}>
                    <div className={styles.tableHeader}>
                        <span className={styles.colProduct}>PRODUTO</span>
                        <span className={styles.colPrice}>PREÇO</span>
                        <span className={styles.colQty}>QTD</span>
                        <span className={styles.colTotal}>TOTAL</span>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.itemsList}>
                        {items.map((item) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    <div className={styles.bottomActions}>
                        <Link href="/" className={styles.continueLink}>
                            <Image src="/icons/arrow-left.svg" alt="" width={16} height={16} />
                            <span>CONTINUAR COMPRANDO</span>
                        </Link>
                        <button
                            className={styles.clearButton}
                            onClick={handleClearCart}
                            disabled={updating}
                        >
                            <Image src="/icons/cart-clear.svg" alt="" width={21} height={20} />
                            <span>LIMPAR CARRINHO</span>
                        </button>
                    </div>
                </div>

                <div className={styles.summaryColumn}>
                    <OrderSummary
                        subtotal={subtotal}
                        itemCount={itemCount}
                        onCheckout={handleCheckout}
                        disabled={updating}
                    />
                </div>
            </div>
        </section>
    );
}
