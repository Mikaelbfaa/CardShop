import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from '../Layout.module.css';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.body}>
            <AnnouncementBar />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
