'use client';

import { use, useRef, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrderById } from '@/lib/api';
import OrderDetail from '@/components/order-detail/OrderDetail';
import type { Order } from '@/lib/types';

interface State {
    order: Order | null;
    loading: boolean;
}

type Action = { type: 'SUCCESS'; order: Order | null };

function reducer(_state: State, action: Action): State {
    return { order: action.order, loading: false };
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [state, dispatch] = useReducer(reducer, { order: null, loading: true });
    const fetchRef = useRef(false);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!fetchRef.current) {
            fetchRef.current = true;
            fetchOrderById(id)
                .then((order) => dispatch({ type: 'SUCCESS', order }))
                .catch(() => dispatch({ type: 'SUCCESS', order: null }));
        }
    }, [id, isAuthenticated, authLoading, router]);

    if (authLoading || state.loading) {
        return (
            <div
                style={{
                    maxWidth: 'var(--max-width)',
                    margin: '0 auto',
                    padding: '96px 32px',
                    textAlign: 'center',
                }}
            >
                <p style={{ color: 'var(--color-gray-500)', fontSize: '18px' }}>
                    Carregando pedido...
                </p>
            </div>
        );
    }

    if (!state.order) {
        return (
            <div
                style={{
                    maxWidth: 'var(--max-width)',
                    margin: '0 auto',
                    padding: '96px 32px',
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        fontFamily: 'var(--font-archivo-black)',
                        fontSize: '36px',
                        textTransform: 'uppercase',
                    }}
                >
                    Pedido não encontrado
                </h1>
                <p style={{ marginTop: '16px', color: 'var(--color-gray-500)' }}>
                    O pedido que você procura não existe ou foi removido.
                </p>
            </div>
        );
    }

    return <OrderDetail order={state.order} />;
}
