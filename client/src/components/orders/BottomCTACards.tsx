import Image from 'next/image';
import styles from './BottomCTACards.module.css';

export default function BottomCTACards() {
    return (
        <div className={styles.ctaRow}>
            <div className={`${styles.ctaCard} ${styles.tradeInCard}`}>
                <div className={styles.circleLime} />
                <div className={styles.circlePurple} />
                <div className={styles.tradeInContent}>
                    <h3 className={styles.tradeInHeading}>Venda Suas Cartas</h3>
                    <p className={styles.tradeInText}>
                        Tem cartas paradas? Transforme elas em
                        <br />
                        crédito na loja agora mesmo.
                    </p>
                    <button className={styles.tradeInButton}>Começar Trade-in</button>
                </div>
            </div>

            <div className={`${styles.ctaCard} ${styles.supportCard}`}>
                <div className={styles.supportContent}>
                    <span className={styles.supportBadge}>SUPORTE</span>
                    <h3 className={styles.supportHeading}>Problemas?</h3>
                    <p className={styles.supportText}>Chama no Discord ou manda email.</p>
                </div>
                <div className={styles.chatCircle}>
                    <Image src="/icons/chat.svg" alt="" width={25} height={25} />
                </div>
            </div>
        </div>
    );
}
