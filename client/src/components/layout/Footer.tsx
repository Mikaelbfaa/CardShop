import Image from 'next/image';
import styles from './Footer.module.css';

const SOCIAL_LINKS = [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'Discord', href: '#' },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.inner} container`}>
                <div className={styles.content}>
                    {/* Left - Brand */}
                    <div>
                        <div className={styles.brandName}>
                            <span className={styles.brandNameWhite}>CARD</span>
                            <span className={styles.brandNameHighlight}>SHOP</span>
                        </div>
                        <p className={styles.brandDescription}>
                            O melhor marketplace de cartas colecionáveis do Brasil. Yu-Gi-Oh!,
                            Magic: The Gathering e muito mais.
                        </p>
                    </div>

                    {/* Right - Social */}
                    <div>
                        <h3 className={styles.socialTitle}>SOCIAL</h3>
                        <ul className={styles.socialList}>
                            {SOCIAL_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className={styles.socialLink}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className={styles.separator}>
                    <div className={styles.bottomBar}>
                        <p className={styles.copyright}>
                            &copy; 2026 CardShop. Todos os direitos reservados.
                        </p>
                        <div className={styles.paymentIcons}>
                            <Image
                                src="/icons/truck.svg"
                                alt="Entrega"
                                width={19}
                                height={14}
                            />
                            <Image
                                src="/icons/money.svg"
                                alt="Pagamento"
                                width={19}
                                height={14}
                            />
                            <Image
                                src="/icons/credit-card.svg"
                                alt="Cartão"
                                width={17}
                                height={14}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
