export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'gallery' | 'quote';
  textContent?: any;
  image?: any;
  gallery?: Array<{ image: any; caption?: string }>;
  videoUrl?: string;
  quote?: string;
  quoteAuthor?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  contentBlocks?: ContentBlock[];
  featuredImage: any;
  tags?: string[];
  readingTime: number;
  publishedAt?: string;
  views: number;
  featured: boolean;
  formattedPublishedAt?: string;
}