'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Truck, MapPin, CreditCard } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import { formatPrice, getGameLabel, formatOrderDateFull } from '@/lib/utils';
import styles from './OrderDetail.module.css';

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
    { status: 'PENDING', label: 'Pedido Confirmado' },
    { status: 'PROCESSING', label: 'Em Processamento' },
    { status: 'SHIPPED', label: 'Enviado' },
    { status: 'DELIVERED', label: 'Entregue' },
];

function getStepIndex(status: OrderStatus): number {
    const idx = TIMELINE_STEPS.findIndex((s) => s.status === status);
    return idx >= 0 ? idx : -1;
}

interface OrderDetailProps {
    order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
    const statusConfig = ORDER_STATUS_CONFIG[order.status];
    const isCancelled = order.status === 'CANCELLED';
    const currentStepIndex = getStepIndex(order.status);

    const subtotal = order.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
    );

    return (
        <section className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerTop}>
                        <span
                            className={`${styles.statusBadge} comic-shadow-sm`}
                            style={{
                                color: statusConfig.color,
                                backgroundColor: statusConfig.bg,
                                borderColor: statusConfig.border,
                                transform: `rotate(${statusConfig.rotate})`,
                            }}
                        >
                            {statusConfig.label}
                        </span>
                        <Link href="/orders" className={styles.backLink}>
                            &larr; Voltar aos pedidos
                        </Link>
                    </div>
                    <h1 className={styles.title}>PEDIDO {order.code}</h1>
                    <p className={styles.subtitle}>{formatOrderDateFull(order.createdAt)}</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={`${styles.btnOutline} comic-shadow-sm comic-outline-1`}>
                        Ajuda
                    </button>
                    <button className={`${styles.btnPrimary} comic-shadow-sm comic-outline-1`}>
                        Rastrear Pedido
                    </button>
                </div>
            </div>

            {/* Main grid */}
            <div className={styles.grid}>
                {/* Left column */}
                <div className={styles.colLeft}>
                    {/* Shipping Timeline */}
                    <div className={`${styles.card} comic-outline-4 comic-shadow`}>
                        <h2 className={styles.cardTitle}>
                            <TruckIcon />
                            Rastreamento do Envio
                        </h2>
                        <div className={styles.timeline}>
                            {TIMELINE_STEPS.map((step, i) => {
                                const isCompleted = !isCancelled && i <= currentStepIndex;
                                const isCurrent = !isCancelled && i === currentStepIndex;
                                return (
                                    <div key={step.status} className={styles.timelineStep}>
                                        <div className={styles.timelineTrack}>
                                            <div
                                                className={`${styles.timelineDot} ${isCompleted ? styles.timelineDotCompleted : ''} ${isCurrent ? styles.timelineDotCurrent : ''}`}
                                            />
                                            {i < TIMELINE_STEPS.length - 1 && (
                                                <div
                                                    className={`${styles.timelineLine} ${isCompleted && !isCancelled && i < currentStepIndex ? styles.timelineLineCompleted : ''}`}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.timelineContent}>
                                            <span
                                                className={`${styles.timelineLabel} ${isCompleted ? styles.timelineLabelCompleted : ''}`}
                                            >
                                                {step.label}
                                            </span>
                                            {isCurrent && (
                                                <span className={styles.timelineDate}>
                                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {isCancelled && (
                                <div className={styles.cancelledNotice}>
                                    <span
                                        className={styles.cancelledBadge}
                                        style={{
                                            color: statusConfig.color,
                                            backgroundColor: statusConfig.bg,
                                            borderColor: statusConfig.border,
                                        }}
                                    >
                                        PEDIDO CANCELADO
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className={`${styles.card} comic-outline-4 comic-shadow`}>
                        <h2 className={styles.cardTitle}>
                            Itens do Pedido ({order.items.length})
                        </h2>
                        <div className={styles.itemsList}>
                            {order.items.map((item) => (
                                <div key={item.id} className={styles.orderItem}>
                                    <div className={styles.itemImageWrap}>
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={80}
                                            height={112}
                                            className={styles.itemImage}
                                        />
                                        {item.quantity > 1 && (
                                            <span className={styles.qtyBadge}>
                                                {item.quantity}x
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <p className={styles.itemName}>{item.product.name}</p>
                                        <p className={styles.itemMeta}>
                                            {getGameLabel(item.product.game)}
                                            {item.product.rarity && ` · ${item.product.rarity.toUpperCase()}`}
                                        </p>
                                        {item.product.edition && (
                                            <p className={styles.itemEdition}>
                                                {item.product.edition}
                                            </p>
                                        )}
                                    </div>
                                    <div className={styles.itemPrice}>
                                        <span className={styles.itemUnitPrice}>
                                            {formatPrice(item.unitPrice)}
                                        </span>
                                        {item.quantity > 1 && (
                                            <span className={styles.itemQtyLabel}>
                                                x{item.quantity}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className={styles.colRight}>
                    {/* Summary */}
                    <div className={`${styles.card} comic-outline-4 comic-shadow`}>
                        <h2 className={styles.cardTitle}>Resumo do Pedido</h2>
                        <div className={styles.summaryRows}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Frete</span>
                                <span className={styles.freeBadge}>GRÁTIS</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Taxas</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div className={styles.summaryDivider} />
                            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span>Total</span>
                                <span
                                    className={`${styles.totalBadge} comic-shadow-sm`}
                                    style={{ transform: 'rotate(-2deg)' }}
                                >
                                    {formatPrice(order.totalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className={`${styles.card} comic-outline-4 comic-shadow`}>
                        <h2 className={styles.cardTitle}>
                            <PinIcon />
                            Endereço de Entrega
                        </h2>
                        <p className={styles.addressText}>
                            {order.shippingAddress || 'Endereço não informado'}
                        </p>
                    </div>

                    {/* Payment */}
                    <div className={`${styles.card} comic-outline-4 comic-shadow`}>
                        <h2 className={styles.cardTitle}>
                            <CardIcon />
                            Pagamento
                        </h2>
                        {/* TODO: Integrar com dados reais quando o backend tiver modelo de pagamento */}
                        <p className={styles.paymentText}>VISA **** 4242</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ===== Inline SVG Icons ===== */

function TruckIcon() {
    return <Truck size={20} />;
}

function PinIcon() {
    return <MapPin size={18} />;
}

function CardIcon() {
    return <CreditCard size={18} />;
}
