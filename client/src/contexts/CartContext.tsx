'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addCartItem as apiAddCartItem } from '@/lib/api';
import type { CartItem } from '@/lib/types';

interface CartContextType {
    itemCount: number;
    bumping: boolean;
    setItemCount: (count: number) => void;
    addItem: (productId: number, quantity?: number) => Promise<CartItem[]>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [itemCount, setItemCount] = useState(0);
    const [bumping, setBumping] = useState(false);
    const prevAuth = useRef<boolean | null>(null);

    // Carrega a contagem do carrinho quando o usuário está autenticado
    useEffect(() => {
        if (authLoading) return;

        // Evita chamada síncrona de setState — só atualiza quando o estado de auth muda
        if (prevAuth.current === isAuthenticated) return;
        prevAuth.current = isAuthenticated;

        if (!isAuthenticated) {
            queueMicrotask(() => setItemCount(0));
            return;
        }

        fetchCart()
            .then((items) => {
                setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
            })
            .catch(() => {
                setItemCount(0);
            });
    }, [isAuthenticated, authLoading]);

    const triggerBump = useCallback(() => {
        setBumping(true);
        setTimeout(() => setBumping(false), 600);
    }, []);

    const addItem = useCallback(
        async (productId: number, quantity: number = 1): Promise<CartItem[]> => {
            const items = await apiAddCartItem(productId, quantity);
            const newCount = items.reduce((sum, item) => sum + item.quantity, 0);
            setItemCount(newCount);
            triggerBump();
            return items;
        },
        [triggerBump]
    );

    return (
        <CartContext.Provider value={{ itemCount, bumping, setItemCount, addItem }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
}
