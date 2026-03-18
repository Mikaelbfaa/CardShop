'use client';

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    products: Product[];
    ensureProducts: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const fetchRef = useRef<Promise<Product[]> | null>(null);

    const ensureProducts = useCallback(() => {
        if (fetchRef.current) return;
        fetchRef.current = fetchProducts().then((data) => {
            setProducts(data);
            return data;
        });
    }, []);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, products, ensureProducts }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch(): SearchContextType {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch deve ser usado dentro de um SearchProvider');
    }
    return context;
}
