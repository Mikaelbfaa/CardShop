'use client';

import { FILTER_OPTIONS } from '@/lib/constants';
import type { FilterType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
    return (
        <div className="border-y-2 border-black bg-white">
            <div className="mx-auto max-w-[1232px] px-6 py-4 flex gap-4 overflow-x-auto scrollbar-hide">
                {FILTER_OPTIONS.map((option) => (
                    <button
                        key={option.label}
                        onClick={() => onFilterChange(option.label)}
                        className={cn(
                            'rounded-full px-5 py-2 font-archivo text-[14px] font-bold uppercase comic-outline comic-shadow-sm whitespace-nowrap transition-colors',
                            activeFilter === option.label
                                ? 'bg-black text-brand-lime'
                                : 'bg-white text-gray-900 hover:bg-gray-100'
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
