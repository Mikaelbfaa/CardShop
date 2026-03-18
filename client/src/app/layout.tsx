import type { Metadata } from 'next';
import { Anton, Archivo, Archivo_Black, Bangers, Inter, Roboto_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SearchProvider } from '@/contexts/SearchContext';
import './globals.css';

const anton = Anton({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-family-anton',
    display: 'swap',
});

const archivo = Archivo({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-family-archivo',
    display: 'swap',
});

const archivoBlack = Archivo_Black({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-family-archivo-black',
    display: 'swap',
});

const bangers = Bangers({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-family-bangers',
    display: 'swap',
});

const inter = Inter({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-family-inter',
    display: 'swap',
});

const robotoMono = Roboto_Mono({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-family-roboto-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'CardShop - Seu Marketplace de Cartas',
    description:
        'O melhor marketplace para colecionadores exigentes de Yu-Gi-Oh! e Magic: The Gathering.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-BR"
            className={`${anton.variable} ${archivo.variable} ${archivoBlack.variable} ${bangers.variable} ${inter.variable} ${robotoMono.variable}`}
        >
            <body>
                <AuthProvider>
                    <CartProvider>
                        <SearchProvider>{children}</SearchProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
