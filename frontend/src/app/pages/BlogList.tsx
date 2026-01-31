import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BlogCard, BlogPost } from '@/app/components/BlogCard';
import { Sidebar } from '@/app/components/Sidebar';
import { SEO } from '@/app/components/SEO';

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    let url = '/api/posts';
    if (searchQuery) {
      url += `?q=${encodeURIComponent(searchQuery)}`;
    }

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch posts", err);
        setLoading(false);
      });
  }, [searchQuery]);

  const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 'Technical Blog';
  const pageDescription = searchQuery
    ? `Search results for ${searchQuery} on Yunus Tez's SAP Blog.`
    : 'Browse all technical articles, tutorials, and insights about SAP ABAP, Fiori, and Cloud development.';

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={searchQuery ? `${searchQuery}, SAP Search` : "SAP Blog List, ABAP Articles"}
      />

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-[#32363a] mb-3">
            {pageTitle}
          </h1>
          <p className="text-lg text-[#6a6d70]">
            {searchQuery
              ? `Found ${posts.length} articles matching your search`
              : 'Insights, tutorials, and best practices for SAP development'
            }
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="bg-white p-8 rounded border border-[#d9d9d9] text-center">
                <p className="text-[#6a6d70]">No articles found.</p>
              </div>
            )}
          </div>

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
