'use client';

import { Suspense, useState, useRef, useReducer, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroSection from '@/components/home/HeroSection';
import FilterBar from '@/components/home/FilterBar';
import ProductGrid from '@/components/home/ProductGrid';
import { useSearch } from '@/contexts/SearchContext';
import { fetchProducts } from '@/lib/api';
import { FILTER_OPTIONS } from '@/lib/constants';
import type { FilterType, Product } from '@/lib/types';

interface ProductsState {
    products: Product[];
    loading: boolean;
}

type ProductsAction = { type: 'FETCH_START' } | { type: 'FETCH_SUCCESS'; products: Product[] };

function productsReducer(_state: ProductsState, action: ProductsAction): ProductsState {
    switch (action.type) {
        case 'FETCH_START':
            return { products: [], loading: true };
        case 'FETCH_SUCCESS':
            return { products: action.products, loading: false };
    }
}

function HomeContent() {
    const searchParams = useSearchParams();
    const gameFilter = searchParams.get('game');
    const isLancamentos = searchParams.get('view') === 'lancamentos';
    const { searchQuery } = useSearch();
    const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS');
    const [state, dispatch] = useReducer(productsReducer, { products: [], loading: true });
    const initialFetch = useRef<Promise<Product[]> | null>(null);

    // Carregamento inicial (dispara apenas uma vez via padrão ref == null)
    if (initialFetch.current == null) {
        initialFetch.current = fetchProducts().then((data) => {
            dispatch({ type: 'FETCH_SUCCESS', products: data });
            return data;
        });
    }

    const handleFilterChange = async (filter: FilterType) => {
        setActiveFilter(filter);
        dispatch({ type: 'FETCH_START' });
        const filterOption = FILTER_OPTIONS.find((f) => f.label === filter);
        const cardType = filterOption?.cardType ?? undefined;
        const data = await fetchProducts(cardType);
        dispatch({ type: 'FETCH_SUCCESS', products: data });
    };

    const shuffledProducts = useMemo(() => {
        const shuffled = [...state.products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.products.length]);

    const displayedProducts = useMemo(() => {
        let filtered: Product[];
        if (gameFilter) filtered = state.products.filter((p) => p.game === gameFilter);
        else if (isLancamentos) filtered = shuffledProducts.slice(0, 8);
        else filtered = state.products;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
        }

        return filtered;
    }, [state.products, shuffledProducts, gameFilter, isLancamentos, searchQuery]);

    return (
        <>
            <HeroSection products={displayedProducts} />
            <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            <ProductGrid products={displayedProducts} loading={state.loading} />
        </>
    );
}

export default function HomePage() {
    return (
        <Suspense>
            <HomeContent />
        </Suspense>
    );
}
