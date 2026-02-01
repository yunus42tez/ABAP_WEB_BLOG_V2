import { Link } from 'react-router-dom';
import { Tag, FolderOpen, Clock } from 'lucide-react';
import { useBlog } from '@/app/context/BlogContext';

interface SidebarProps {
  // Props are now optional as we use context by default
  categories?: any[];
  recentPosts?: any[];
  popularTags?: string[];
}

export function Sidebar({ categories: propCategories, recentPosts: propRecent, popularTags: propTags }: SidebarProps) {
  const { posts, categories, tags } = useBlog();

  // Use props if provided, otherwise use context data
  const displayCategories = propCategories || categories;
  const displayTags = propTags || tags;

  // Derive recent posts from context if not provided
  const displayRecent = propRecent || posts.slice(0, 5).map(p => ({
    id: p.id,
    title: p.title,
    date: p.date
  }));

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="bg-white border border-[#d9d9d9] rounded p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#32363a] mb-4">
          <FolderOpen className="w-5 h-5 text-[#0A6ED1]" />
          Categories
        </h3>
        <ul className="space-y-2">
          {displayCategories.map((category) => (
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
          {displayRecent.map((post) => (
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
          {displayTags.length > 0 ? (
            displayTags.map((tag) => (
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
