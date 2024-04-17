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

export type NewsResponse = {
  featured_list: News[];
  list: News[];
};
