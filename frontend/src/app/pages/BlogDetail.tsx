import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Sidebar } from '@/app/components/Sidebar';
import { SEO } from '@/app/components/SEO';

interface PostDetail {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
}

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then(res => res.json())
        .then(data => {
          setPost(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch post", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!post) return <div className="p-12 text-center">Post not found</div>;

  // İçerikten kısa bir açıklama oluştur (HTML taglerini temizleyerek)
  const description = post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <SEO
        title={post.title}
        description={description}
        keywords={post.tags.join(', ')}
        type="article"
      />

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#0A6ED1] hover:gap-3 transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2 bg-white border border-[#d9d9d9] rounded p-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded bg-[#EAF2FB] text-[#0A6ED1] text-sm font-medium">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold text-[#32363a] mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-[#d9d9d9]">
              <div className="flex items-center gap-2 text-[#6a6d70]">
                <Calendar className="w-5 h-5 text-[#0A6ED1]" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6a6d70]">
                <User className="w-5 h-5 text-[#0A6ED1]" />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#f5f5f5] text-[#6a6d70] text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                color: '#32363a',
                lineHeight: '1.7',
              }}
            />
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
