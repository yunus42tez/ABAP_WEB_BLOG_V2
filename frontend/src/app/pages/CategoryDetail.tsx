import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogCard, BlogPost } from '@/app/components/BlogCard';
import { ArrowLeft } from 'lucide-react';
import { useBlog } from '@/app/context/BlogContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { SEO } from '@/app/components/SEO';

export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { posts: contextPosts, categories, loading: contextLoading } = useBlog();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (slug) {
      // 1. Convert slug to readable name for display
      const readableName = slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setCategoryName(readableName);

      if (!contextLoading) {
        // 2. Find the actual category object from the categories list using the slug
        // We create a slug from each category name to compare with the URL slug
        const matchedCategory = categories.find(cat =>
          cat.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
        );

        // 3. Filter posts
        let filtered: BlogPost[] = [];

        if (matchedCategory) {
          // If we found the category object, filter posts by exact category name match
          // This is safer than trying to reconstruct the name from slug
          filtered = contextPosts.filter(post =>
            post.category === matchedCategory.name
          );
        } else {
          // Fallback: If category not found in list (rare), try loose matching
          filtered = contextPosts.filter(post =>
            post.category.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
          );
        }

        setFilteredPosts(filtered);
      }
    }
  }, [slug, contextPosts, categories, contextLoading]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <SEO
        title={`${categoryName} Articles`}
        description={`Browse all articles related to ${categoryName} on Yunus Tez's SAP Blog.`}
        keywords={`${categoryName}, SAP, ABAP`}
      />

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
            {contextLoading ? "Loading..." : `${filteredPosts.length} articles found`}
          </p>
        </div>

        {/* Posts Grid */}
        {contextLoading ? (
          <LoadingSpinner />
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
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
