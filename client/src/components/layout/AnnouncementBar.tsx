export default function AnnouncementBar() {
    const message =
        'FRETE GRÁTIS PARA TODO BRASIL ★ PARCELE EM ATÉ 12X ★ COMPRE COM SEGURANÇA ★ ';

    return (
        <div className="bg-black border-b-2 border-black overflow-hidden">
            <div className="animate-marquee flex whitespace-nowrap py-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <span
                        key={i}
                        className="font-archivo text-[12px] font-bold uppercase tracking-[1.2px] text-brand-lime mx-4"
                    >
                        {message}
                    </span>
                ))}
            </div>
        </div>
    );
}
