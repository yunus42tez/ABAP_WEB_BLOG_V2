import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogCard, BlogPost } from '@/app/components/BlogCard';
import { ArrowLeft } from 'lucide-react';

export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (slug) {
      // Convert slug back to readable name for display (approximate)
      const readableName = slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setCategoryName(readableName);

      fetch(`/api/posts?category=${slug}`)
        .then(res => res.json())
        .then(data => {
          setPosts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch category posts", err);
          setLoading(false);
        });
    }
  }, [slug]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-[#0A6ED1] hover:gap-3 transition-all mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-[#32363a] mb-3">
            {categoryName}
          </h1>
          <p className="text-lg text-[#6a6d70]">
            {loading ? "Loading..." : `${posts.length} articles found`}
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded border border-[#d9d9d9] text-center">
            <p className="text-[#6a6d70]">No articles found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
