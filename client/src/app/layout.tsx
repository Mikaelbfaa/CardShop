import type { Metadata } from 'next';
import { Anton, Archivo, Archivo_Black, Inter } from 'next/font/google';
import './globals.css';
import styles from './Layout.module.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-family-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'CardShop - Seu Marketplace de Cartas',
    description: 'O melhor marketplace para colecionadores exigentes de Yu-Gi-Oh! e Magic: The Gathering.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="pt-BR"
            className={`${anton.variable} ${archivo.variable} ${archivoBlack.variable} ${inter.variable}`}
        >
            <body className={styles.body}>
                <AnnouncementBar />
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
