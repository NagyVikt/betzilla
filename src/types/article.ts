export interface Article {
  id: number | string;
  title: string;
  slug: string;
  category: string;
  content: string;
  published_at: string;
  author?: string;
}
