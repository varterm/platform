import { getLatestPosts } from '@/lib/news';
import HomeClient from './HomeClient';

export default async function Page() {
  const latest = await getLatestPosts(1);
  const featuredNews = latest[0] ?? null;

  return <HomeClient featuredNews={featuredNews} />;
}
