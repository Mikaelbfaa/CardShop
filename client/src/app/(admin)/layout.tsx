import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './Layout.module.css';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.announcementBar}>
                <p className={styles.announcementText}>
                    ADMIN PANEL &bull; CARDSHOP MANAGEMENT &bull; V2.0 BETA &bull; ACCESS GRANTED
                </p>
            </div>
            <div className={styles.container}>
                <AdminSidebar />
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    );
}
