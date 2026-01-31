import { Link } from 'react-router-dom';
import { Tag, FolderOpen, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
  name: string;
  count: number;
}

interface RecentPost {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  categories?: Category[];
  recentPosts?: RecentPost[];
  popularTags?: string[];
}

export function Sidebar({ categories: propCategories, recentPosts, popularTags: propTags }: SidebarProps) {
  const [recent, setRecent] = useState<RecentPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch recent posts if not provided
    if (!recentPosts) {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          const mapped = data.slice(0, 5).map((p: any) => ({
            id: p.id,
            title: p.title,
            date: p.date
          }));
          setRecent(mapped);
        })
        .catch(err => console.error("Failed to fetch recent posts", err));
    } else {
      setRecent(recentPosts);
    }

    // Fetch categories if not provided
    if (!propCategories) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          setCategories(data);
        })
        .catch(err => console.error("Failed to fetch categories", err));
    } else {
      setCategories(propCategories);
    }

    // Fetch tags if not provided
    if (!propTags) {
      fetch('/api/tags')
        .then(res => res.json())
        .then(data => {
          setTags(data);
        })
        .catch(err => console.error("Failed to fetch tags", err));
    } else {
      setTags(propTags);
    }
  }, [recentPosts, propCategories, propTags]);

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="bg-white border border-[#d9d9d9] rounded p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#32363a] mb-4">
          <FolderOpen className="w-5 h-5 text-[#0A6ED1]" />
          Categories
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center justify-between p-2 rounded hover:bg-[#EAF2FB] transition-colors group"
              >
                <span className="text-[#6a6d70] group-hover:text-[#0A6ED1]">
                  {category.name}
                </span>
                <span className="text-xs text-[#6a6d70] bg-[#f5f5f5] px-2 py-1 rounded">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="bg-white border border-[#d9d9d9] rounded p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#32363a] mb-4">
          <Clock className="w-5 h-5 text-[#0A6ED1]" />
          Recent Posts
        </h3>
        <ul className="space-y-3">
          {recent.map((post) => (
            <li key={post.id}>
              <Link
                to={`/blog/${post.id}`}
                className="block group"
              >
                <h4 className="text-sm font-medium text-[#32363a] group-hover:text-[#0A6ED1] mb-1 transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-[#6a6d70]">{post.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="bg-white border border-[#d9d9d9] rounded p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#32363a] mb-4">
          <Tag className="w-5 h-5 text-[#0A6ED1]" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded bg-[#f5f5f5] text-[#6a6d70] text-sm cursor-default"
              >
                {tag}
              </span>
            ))
          ) : (
            <p className="text-sm text-[#6a6d70]">No tags available.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
