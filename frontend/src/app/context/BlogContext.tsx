import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost } from '@/app/components/BlogCard';

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
}

interface BlogContextType {
  posts: BlogPost[];
  categories: Category[];
  tags: string[];
  loading: boolean;
  refreshData: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [postsRes, catsRes, tagsRes] = await Promise.all([
        fetch('/api/posts?per_page=100'), // Fetch first 100 posts for cache
        fetch('/api/categories'),
        fetch('/api/tags')
      ]);

      const postsData = await postsRes.json();
      const catsData = await catsRes.json();
      const tagsData = await tagsRes.json();

      // Handle pagination structure from API
      setPosts(postsData.posts || []);
      setCategories(catsData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BlogContext.Provider value={{ posts, categories, tags, loading, refreshData: fetchData }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
