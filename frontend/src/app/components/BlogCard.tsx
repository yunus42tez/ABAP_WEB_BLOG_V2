import { Link } from 'react-router-dom';
import { Calendar, Tag, ChevronRight } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white border border-[#d9d9d9] rounded hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded bg-[#EAF2FB] text-[#0A6ED1] text-sm font-medium">
            {post.category}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-[#32363a] mb-3 hover:text-[#0A6ED1] transition-colors">
          <Link to={`/blog/${post.id}`}>
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt */}
        <p className="text-[#6a6d70] mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[#6a6d70]">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <span>•</span>
          <span>By {post.author}</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#f5f5f5] text-[#6a6d70] text-xs"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
        
        {/* Read More Link */}
        <Link
          to={`/blog/${post.id}`}
          className="inline-flex items-center gap-1 text-[#0A6ED1] font-medium hover:gap-2 transition-all"
        >
          Read more
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
