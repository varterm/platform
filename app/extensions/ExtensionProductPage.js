import Link from 'next/link';
import Breadcrumbs from '../Breadcrumbs';
import { EXTENSION_PRODUCTS } from './product-content';
import styles from './page.module.css';

export default function ExtensionProductPage({ productKey }) {
  const product = EXTENSION_PRODUCTS[productKey];
  if (!product) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/extensions" className={styles.backLink}>
          ← All extensions
        </Link>
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Extensions', path: '/extensions' },
            { name: product.h1, path: product.path },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>{product.h1}</h1>
          <p>{product.lede}</p>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>Free</span>
            <span className={styles.badge}>No signup</span>
            <span className={styles.badge}>MIT licensed</span>
          </div>
        </section>

        <article className={styles.card}>
          <div className={styles.ctaStack}>
            <a href={product.storeHref} target="_blank" rel="noreferrer" className={styles.cta}>
              {product.storeLabel}
            </a>
            {product.secondary.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={styles.ctaSecondary}
              >
                {item.label}
              </a>
            ))}
          </div>
          <ol>
            {product.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <section className={styles.links}>
          <h3>Related</h3>
          <ul>
            <li>
              <Link href="/extensions">All Varterm extensions</Link>
            </li>
            <li>
              <Link href="/install-extensions">How to install each extension</Link>
            </li>
            <li>
              <Link href="/">Free online text to speech reader</Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
