'use client';

import Image from 'next/image';
import { useSearch } from '@/contexts/SearchContext';
import { FILTER_OPTIONS } from '@/lib/constants';
import type { FilterType } from '@/lib/types';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <div className={styles.bar}>
            <div className={`${styles.track} container scrollbar-hide`}>
                {FILTER_OPTIONS.map((option) => (
                    <button
                        key={option.label}
                        onClick={() => onFilterChange(option.label)}
                        className={`${styles.filterButton} comic-outline comic-shadow-sm`}
                        data-active={activeFilter === option.label}
                    >
                        {option.label}
                    </button>
                ))}
                <div className={`${styles.searchField} comic-outline comic-shadow-sm`}>
                    <Image src="/icons/search.svg" alt="Buscar" width={16} height={16} />
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setSearchQuery('');
                                e.currentTarget.blur();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
