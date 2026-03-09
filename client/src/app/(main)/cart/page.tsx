'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { fetchCart, updateCartItem, removeCartItem, clearCart, createOrder } from '@/lib/api';
import type { CartItem } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
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
                    <ShoppingCart size={48} className={styles.cartIcon} />
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
                <ShoppingCart size={48} className={styles.cartIcon} />
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
