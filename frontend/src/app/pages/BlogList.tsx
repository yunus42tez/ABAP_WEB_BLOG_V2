import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BlogCard, BlogPost } from '@/app/components/BlogCard';
import { Sidebar } from '@/app/components/Sidebar';
import { SEO } from '@/app/components/SEO';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlog } from '@/app/context/BlogContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export function BlogList() {
  const { posts: contextPosts, loading: contextLoading } = useBlog();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const pageParam = searchParams.get('page');

  useEffect(() => {
    const page = pageParam ? parseInt(pageParam) : 1;
    setCurrentPage(page);

    // If no search and on first page, use context data for instant load
    if (!searchQuery && page === 1 && contextPosts.length > 0) {
      setPosts(contextPosts.slice(0, 10)); // Show first 10
      setTotalPages(Math.ceil(contextPosts.length / 10));
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    let url = `/api/posts?page=${page}&per_page=10`;
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setTotalPages(data.pages);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(err => {
        console.error("Failed to fetch posts", err);
        setLoading(false);
      });
  }, [searchQuery, pageParam, contextPosts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
    }
  };

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
              ? `Found articles matching your search`
              : 'Insights, tutorials, and best practices for SAP development'
            }
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2 space-y-6">
            {loading && contextLoading ? (
              <LoadingSpinner />
            ) : posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t border-[#d9d9d9]">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded hover:bg-[#EAF2FB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#0A6ED1]" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#0A6ED1] text-white'
                            : 'text-[#6a6d70] hover:bg-[#EAF2FB] hover:text-[#0A6ED1]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded hover:bg-[#EAF2FB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-[#0A6ED1]" />
                    </button>
                  </div>
                )}
              </>
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
