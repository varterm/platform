import { getLatestPosts } from '@/lib/news';
import { faqSchemaFromEntries, HOMEPAGE_FAQ } from '@/lib/seo-faq.js';
import { webApplicationSchema } from '@/lib/seo-schema.js';
import HomeClient from './HomeClient';
import JsonLd from './JsonLd';

export default async function Page() {
  const latest = await getLatestPosts(1);
  const featuredNews = latest[0] ?? null;

  return (
    <>
      <JsonLd data={webApplicationSchema()} />
      <JsonLd data={faqSchemaFromEntries(HOMEPAGE_FAQ)} />
      <HomeClient featuredNews={featuredNews} />
    </>
  );
}
