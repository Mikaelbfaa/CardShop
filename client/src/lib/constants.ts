import { FilterType, OrderStatus } from './types';

export const FILTER_OPTIONS: { label: FilterType; cardType: string | null }[] = [
    { label: 'TODOS', cardType: null },
    { label: 'MONSTROS', cardType: 'MONSTER' },
    { label: 'MAGIAS', cardType: 'SPELL' },
    { label: 'ARMADILHAS', cardType: 'TRAP' },
    { label: 'TERRENOS', cardType: 'LAND' },
    { label: 'CRIATURAS', cardType: 'CREATURE' },
];

export const ORDER_STATUS_FILTERS: { label: string; value: OrderStatus | null }[] = [
    { label: 'TODOS', value: null },
    { label: 'PENDENTES', value: 'PENDING' },
    { label: 'PROCESSANDO', value: 'PROCESSING' },
    { label: 'ENVIADOS', value: 'SHIPPED' },
    { label: 'ENTREGUES', value: 'DELIVERED' },
    { label: 'CANCELADOS', value: 'CANCELLED' },
];

export const ORDER_STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bg: string; border: string; rotate: string }
> = {
    PENDING: { label: 'PENDENTE', color: '#A16207', bg: '#FEF9C3', border: '#EAB308', rotate: '-1deg' },
    PROCESSING: { label: 'PROCESSANDO', color: '#2563EB', bg: '#DBEAFE', border: '#2563EB', rotate: '-2deg' },
    SHIPPED: { label: 'ENVIADO', color: '#9333EA', bg: '#F3E8FF', border: '#9333EA', rotate: '2deg' },
    DELIVERED: { label: 'ENTREGUE', color: '#16A34A', bg: '#DCFCE7', border: '#16A34A', rotate: '1deg' },
    CANCELLED: { label: 'CANCELADO', color: '#DC2626', bg: '#FEE2E2', border: '#DC2626', rotate: '-3deg' },
};

export const ORDERS_PER_PAGE = 5;

export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
};

export const ADMIN_ORDER_STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bg: string }
> = {
    PENDING: { label: 'PENDENTE', color: '#854d0e', bg: '#fde047' },
    PROCESSING: { label: 'PROCESSANDO', color: '#1e40af', bg: '#60a5fa' },
    SHIPPED: { label: 'ENVIADO', color: '#6b21a8', bg: '#c084fc' },
    DELIVERED: { label: 'ENTREGUE', color: '#166534', bg: '#4ade80' },
    CANCELLED: { label: 'CANCELADO', color: '#991b1b', bg: '#ef4444' },
};
