import Link from 'next/link';
import AccountClient from './AccountClient';
import HowListeningWorks from './HowListeningWorks';
import styles from './page.module.css';

export const metadata = {
  title: 'Account',
  description: 'Optional Varterm account to save TTS recordings and share listen links.',
  alternates: {
    canonical: '/account',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm
        </Link>
      </header>

      <main className={styles.main}>
        <h1>Account</h1>
        <p className={styles.pageLead}>
          Accounts are optional. Use them when you want a personal library and listen links you can
          open on other devices.
        </p>
        <HowListeningWorks />
        <AccountClient />
      </main>
    </div>
  );
}
