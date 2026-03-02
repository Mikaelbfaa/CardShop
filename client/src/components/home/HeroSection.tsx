import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="mx-auto max-w-[1232px] px-6 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                {/* Left Side */}
                <div className="w-full lg:w-[592px] flex flex-col gap-6">
                    {/* Season Badge */}
                    <div className="inline-flex self-start">
                        <span className="bg-brand-pink text-white font-archivo text-[12px] font-bold uppercase tracking-wider px-4 py-1.5 rotate-[-1deg] comic-outline comic-shadow inline-block">
                            SEASON 04 // COLEÇÃO LENDÁRIA
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="font-anton text-[56px] lg:text-[96px] text-gray-900 uppercase leading-[1] tracking-tight">
                        SUA PRÓXIMA
                        <br />
                        CARTA.
                    </h1>

                    {/* Subtitle */}
                    <p className="font-archivo text-[18px] lg:text-[20px] text-gray-600 leading-[28px] max-w-[448px]">
                        O melhor marketplace para colecionadores exigentes. Encontre cartas raras de
                        Yu-Gi-Oh! e Magic: The Gathering.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/"
                            className="bg-black text-brand-lime font-archivo text-[16px] font-bold uppercase px-8 py-4 comic-outline comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                            COMPRAR YU-GI-OH!
                        </a>
                        <a
                            href="/"
                            className="bg-white text-black font-archivo text-[16px] font-bold uppercase px-8 py-4 comic-outline comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                            COMPRAR MTG
                        </a>
                    </div>
                </div>

                {/* Right Side - Card Collage */}
                <div className="relative w-full lg:w-[592px] h-[400px] lg:h-[520px]">
                    {/* Purple Blob */}
                    <div
                        className="absolute inset-0 bg-brand-purple opacity-80 rotate-[12deg]"
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
                        className="absolute top-4 left-4 lg:top-0 lg:left-0 rotate-[-12deg] z-10"
                    />

                    {/* Main Image Frame */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[2deg] comic-outline-4 comic-shadow z-10">
                        <div className="relative w-[240px] h-[320px] lg:w-[320px] lg:h-[420px] overflow-hidden">
                            <Image
                                src="/images/cards/utopia-sprawl.jpg"
                                alt="Utopia Sprawl - Enchantment Aura"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>


                    {/* Price Sticker */}
                    <div className="absolute bottom-12 left-4 lg:bottom-16 lg:left-8 bg-brand-lime rotate-[-6deg] comic-outline comic-shadow px-4 py-2 z-20">
                        <span className="font-anton text-[20px] lg:text-[24px] text-black">
                            R$ 45,00
                        </span>
                    </div>

                    {/* HOT Badge */}
                    <div className="absolute bottom-6 right-12 lg:bottom-8 lg:right-20 bg-brand-pink w-[55px] h-[55px] lg:w-[65px] lg:h-[65px] rounded-full flex items-center justify-center rotate-[12deg] z-20">
                        <span className="font-archivo text-[14px] lg:text-[16px] font-bold text-white">
                            HOT
                        </span>
                    </div>

                    {/* Pink Star */}
                    <Image
                        src="/icons/star-pink.svg"
                        alt=""
                        width={48}
                        height={48}
                        className="absolute bottom-2 left-1/2 rotate-[12deg] z-10"
                    />
                </div>
            </div>
        </section>
    );
}
