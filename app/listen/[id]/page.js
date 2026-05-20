import Link from 'next/link';
import ListenClient from './ListenClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Listen',
  description: 'Listen to a saved Varterm recording.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ListenPage({ params }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Varterm
        </Link>
      </header>

      <main className={styles.main}>
        <ListenClient recordingId={params.id} />
      </main>
    </div>
  );
}
