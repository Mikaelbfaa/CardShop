'use client';

import { useState, useMemo } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FilterBar from '@/components/home/FilterBar';
import ProductGrid from '@/components/home/ProductGrid';
import { MOCK_PRODUCTS, FILTER_OPTIONS } from '@/lib/constants';
import type { FilterType } from '@/lib/types';

export default function HomePage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS');

    const filteredProducts = useMemo(() => {
        if (activeFilter === 'TODOS') return MOCK_PRODUCTS;

        const filterOption = FILTER_OPTIONS.find((f) => f.label === activeFilter);
        if (!filterOption?.cardType) return MOCK_PRODUCTS;

        return MOCK_PRODUCTS.filter((p) => p.cardType === filterOption.cardType);
    }, [activeFilter]);

    return (
        <>
            <HeroSection />
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <ProductGrid products={filteredProducts} />
        </>
    );
}
