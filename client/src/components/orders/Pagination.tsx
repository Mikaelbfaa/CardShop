'use client';

import Image from 'next/image';
import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 0) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={styles.pagination}>
            <span className={styles.info}>
                Mostrando {start}-{end} de {totalItems} pedidos
            </span>

            <div className={styles.buttons}>
                <button
                    className={styles.pageButton}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <Image src="/icons/chevron-left.svg" alt="Anterior" width={10} height={10} />
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${page === currentPage ? styles.pageButtonActive : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={styles.pageButton}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Image src="/icons/chevron-right.svg" alt="Próximo" width={10} height={10} />
                </button>
            </div>
        </div>
    );
}
