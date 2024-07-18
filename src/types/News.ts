export type News = {
  category: string;
  company: string;
  content: string;
  created_at: string;
  id: number;
  thumbnail: string;
  title: string;
  url: string;
};

export type NewsResponse = Record<'featured_list' | 'list', News[]>;
