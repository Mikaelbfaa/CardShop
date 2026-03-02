import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    return (
        <section className={`${styles.section} container`}>
            <div className={styles.container}>
                {/* Left Side */}
                <div className={styles.leftSide}>
                    {/* Season Badge */}
                    <div className={styles.seasonBadgeWrap}>
                        <span className={`${styles.seasonBadge} comic-outline comic-shadow`}>
                            SEASON 04 // COLEÇÃO LENDÁRIA
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className={styles.heading}>
                        SUA PRÓXIMA
                        <br />
                        CARTA.
                    </h1>

                    {/* Subtitle */}
                    <p className={styles.subtitle}>
                        O melhor marketplace para colecionadores exigentes. Encontre cartas raras de
                        Yu-Gi-Oh! e Magic: The Gathering.
                    </p>

                    {/* CTA Buttons */}
                    <div className={styles.ctaRow}>
                        <a
                            href="/"
                            className={`${styles.ctaButton} ${styles.ctaPrimary} comic-outline comic-shadow`}
                        >
                            COMPRAR YU-GI-OH!
                        </a>
                        <a
                            href="/"
                            className={`${styles.ctaButton} ${styles.ctaSecondary} comic-outline comic-shadow`}
                        >
                            COMPRAR MTG
                        </a>
                    </div>
                </div>

                {/* Right Side - Card Collage */}
                <div className={styles.rightSide}>
                    {/* Purple Blob */}
                    <div
                        className={styles.purpleBlob}
                        style={{
                            borderRadius: '265px 520px 556px 414px',
                        }}
                    />

                    {/* Green Star */}
                    <Image
                        src="/icons/star-green.svg"
                        alt=""
                        width={72}
                        height={72}
                        className={styles.greenStar}
                    />

                    {/* Main Image Frame */}
                    <div className={`${styles.mainFrame} comic-outline-4 comic-shadow`}>
                        <div className={styles.mainFrameInner}>
                            <Image
                                src="/images/cards/utopia-sprawl.jpg"
                                alt="Utopia Sprawl - Enchantment Aura"
                                fill
                                className={styles.mainImage}
                                priority
                            />
                        </div>
                    </div>

                    {/* Price Sticker */}
                    <div className={`${styles.priceSticker} comic-outline comic-shadow`}>
                        <span className={styles.priceStickerText}>R$ 45,00</span>
                    </div>

                    {/* HOT Badge */}
                    <div className={styles.hotBadge}>
                        <span className={styles.hotBadgeText}>HOT</span>
                    </div>

                    {/* Pink Star */}
                    <Image
                        src="/icons/star-pink.svg"
                        alt=""
                        width={48}
                        height={48}
                        className={styles.pinkStar}
                    />
                </div>
            </div>
        </section>
    );
}
