'use client';

import { FILTER_OPTIONS } from '@/lib/constants';
import type { FilterType } from '@/lib/types';
import styles from './FilterBar.module.css';

interface FilterBarProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
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
            </div>
        </div>
    );
}
