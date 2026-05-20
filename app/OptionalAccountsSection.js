import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const HowListeningWorks = dynamic(() => import('./account/HowListeningWorks'), { ssr: false });

export default function OptionalAccountsSection() {
  return (
    <section className={styles.accountsSection} aria-labelledby="optional-accounts-heading">
      <div className={styles.accountsSectionHeader}>
        <h2 id="optional-accounts-heading" className={styles.sectionHeading}>
          Optional accounts &amp; listen anywhere
        </h2>
        <p className={styles.accountsSectionLead}>
          No signup needed for everyday text-to-speech. Create a free account only when you want to
          save recordings and open them on another device with a listen link.
        </p>
        <div className={styles.accountsSectionLinks}>
          <Link href="/account" className={styles.accountsPrimaryLink}>
            Create account or sign in
          </Link>
          <Link href="/account#how-listening-works" className={styles.accountsSecondaryLink}>
            How it works
          </Link>
        </div>
      </div>
      <div className={styles.accountsDiagramWrap}>
        <HowListeningWorks embedded />
      </div>
    </section>
  );
}
