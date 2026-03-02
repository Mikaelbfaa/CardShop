import styles from './AnnouncementBar.module.css';

export default function AnnouncementBar() {
    const message =
        'FRETE GRÁTIS PARA TODO BRASIL ★ PARCELE EM ATÉ 12X ★ COMPRE COM SEGURANÇA ★ ';

    return (
        <div className={styles.bar}>
            <div className={`${styles.track} animate-marquee`}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className={styles.message}>
                        {message}
                    </span>
                ))}
            </div>
        </div>
    );
}
