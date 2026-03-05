'use client';

import { useState, useRef, useReducer } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FilterBar from '@/components/home/FilterBar';
import ProductGrid from '@/components/home/ProductGrid';
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

export default function HomePage() {
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

    return (
        <>
            <HeroSection />
            <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            <ProductGrid products={state.products} loading={state.loading} />
        </>
    );
}
