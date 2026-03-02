import Image from 'next/image';

const SOCIAL_LINKS = [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'Discord', href: '#' },
];

export default function Footer() {
    return (
        <footer className="bg-black border-t-8 border-brand-lime-alt">
            <div className="mx-auto max-w-[1232px] px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Left - Brand */}
                    <div>
                        <div className="font-archivo-black text-[30px]">
                            <span className="text-white">CARD</span>
                            <span className="text-brand-lime-alt">SHOP</span>
                        </div>
                        <p className="text-gray-400 font-inter text-[16px] mt-2 max-w-[320px]">
                            O melhor marketplace de cartas colecionáveis do Brasil. Yu-Gi-Oh!,
                            Magic: The Gathering e muito mais.
                        </p>
                    </div>

                    {/* Right - Social */}
                    <div>
                        <h3 className="text-brand-lime-alt font-inter text-[14px] font-bold uppercase tracking-wider mb-4">
                            SOCIAL
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {SOCIAL_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 font-inter text-[16px] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="border-t border-[#1F2937] mt-8 pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 font-inter text-[14px]">
                            &copy; 2026 CardShop. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-4">
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
