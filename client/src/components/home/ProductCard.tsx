import Image from 'next/image';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
    showStar?: boolean;
}

export default function ProductCard({ product, showStar }: ProductCardProps) {
    const gameLabel = product.game === 'yugioh' ? 'Yu-Gi-Oh!' : 'Magic: The Gathering';
    const hasPromo = product.badge === 'PROMO';

    return (
        <div className="bg-white comic-outline comic-shadow flex flex-col">
            {/* Image Area */}
            <div className="relative h-[256px] bg-gray-100 border-b-2 border-black overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Badge */}
                {product.badge === 'NOVO' && (
                    <span className="absolute top-3 left-3 bg-black text-white font-archivo text-[10px] font-bold uppercase px-2 py-1">
                        NOVO
                    </span>
                )}
                {product.badge === 'PROMO' && (
                    <span className="absolute top-3 left-3 bg-brand-pink text-white font-archivo text-[10px] font-bold uppercase px-2 py-1 rotate-[-2deg] comic-outline-1">
                        PROMO
                    </span>
                )}

                {/* Optional decorative star */}
                {showStar && (
                    <Image
                        src="/icons/star-pink.svg"
                        alt=""
                        width={32}
                        height={32}
                        className="absolute top-2 right-2 rotate-[12deg]"
                    />
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-1 flex-1">
                <h3 className="font-archivo text-[18px] font-bold text-gray-900 leading-tight">
                    {product.name}
                </h3>
                <p className="font-archivo text-[14px] text-gray-500">
                    {gameLabel} &bull; {product.rarity || 'Common'}
                </p>

                {/* Price Row */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2">
                        {hasPromo && product.oldPrice && (
                            <span className="font-archivo text-[12px] text-gray-400 line-through">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                        <span
                            className={`font-anton text-[20px] ${hasPromo ? 'text-brand-pink' : 'text-gray-900'}`}
                        >
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <button
                        className="w-8 h-8 rounded-full bg-brand-lime comic-outline-1 flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                        <Image src="/icons/plus.svg" alt="" width={12} height={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
