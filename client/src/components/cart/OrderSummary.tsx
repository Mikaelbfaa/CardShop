'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
    subtotal: number;
    itemCount: number;
    onCheckout?: (shippingAddress: string) => void;
    disabled?: boolean;
}

export default function OrderSummary({
    subtotal,
    itemCount,
    onCheckout,
    disabled,
}: OrderSummaryProps) {
    const [shippingAddress, setShippingAddress] = useState('');
    const freeShipping = subtotal >= 200;
    const shipping = freeShipping ? 0 : 15;
    const discount = 0;
    const total = subtotal - discount + shipping;

    const handleCheckout = () => {
        if (onCheckout && shippingAddress.trim()) {
            onCheckout(shippingAddress.trim());
        }
    };

    return (
        <aside className={styles.wrapper}>
            <div className={styles.tape} />

            <h2 className={styles.heading}>RESUMO DO PEDIDO</h2>

            <div className={styles.divider} />

            <div className={styles.row}>
                <span>Subtotal ({itemCount} itens)</span>
                <span>{formatPrice(subtotal)}</span>
            </div>

            <div className={styles.row}>
                <span>Frete</span>
                {freeShipping ? (
                    <span className={styles.freeBadge}>GRÁTIS</span>
                ) : (
                    <span>{formatPrice(shipping)}</span>
                )}
            </div>

            <div className={styles.row}>
                <span>Descontos</span>
                <span>- {formatPrice(discount)}</span>
            </div>

            <div className={styles.totalSection}>
                <div className={styles.bestPriceBadge}>MELHOR PREÇO!</div>
                <div className={styles.totalRow}>
                    <div>
                        <span className={styles.totalLabel}>TOTAL</span>
                        <p className={styles.installments}>EM ATÉ 3X SEM JUROS</p>
                    </div>
                    <span className={styles.totalValue}>{formatPrice(total)}</span>
                </div>
            </div>

            {onCheckout && (
                <div className={styles.shippingSection}>
                    <label className={styles.shippingLabel} htmlFor="shipping-address">
                        ENDEREÇO DE ENTREGA
                    </label>
                    <input
                        id="shipping-address"
                        type="text"
                        className={styles.input}
                        placeholder="Rua, número, bairro, cidade - UF"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                    />
                </div>
            )}

            <button
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={disabled || (onCheckout && !shippingAddress.trim())}
            >
                <span>{disabled ? 'PROCESSANDO...' : 'FINALIZAR PEDIDO'}</span>
                <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
            </button>

            <div className={styles.couponDivider} />

            <div className={styles.couponSection}>
                <span className={styles.couponLabel}>TEM UM CUPOM?</span>
                <div className={styles.couponInput}>
                    <input type="text" placeholder="CUPOM" className={styles.input} />
                    <button className={styles.couponButton}>OK</button>
                </div>
            </div>
        </aside>
    );
}
