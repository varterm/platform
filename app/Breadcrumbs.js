import Link from 'next/link';
import JsonLd from './JsonLd';
import { breadcrumbSchema } from '@/lib/seo-schema';
import styles from './breadcrumbs.module.css';

export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className={styles.nav}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.path}-${item.name}`}>
                {index > 0 ? <span className={styles.sep}>/</span> : null}{' '}
                {isLast ? (
                  <span className={styles.current}>{item.name}</span>
                ) : (
                  <Link href={item.path} className={styles.link}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
