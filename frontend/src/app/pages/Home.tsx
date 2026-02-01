import { Link } from 'react-router-dom';
import { ArrowRight, Code, Layers, Zap } from 'lucide-react';
import { BlogCard } from '@/app/components/BlogCard';
import { SEO } from '@/app/components/SEO';
import { useBlog } from '@/app/context/BlogContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export function Home() {
  const { posts, loading } = useBlog();

  // Get first 3 posts from context
  const featuredPosts = posts.slice(0, 3);

  return (
    <div className="bg-[#f5f5f5]">
      <SEO
        title="Yunus Tez | SAP ABAP Developer"
        description="Welcome to Yunus Tez's personal blog. Explore articles on SAP ABAP, BTP, Cloud, Fiori, and modern development practices. A journey of a lifelong learner."
        keywords="SAP Blog, ABAP Tutorials, SAP BTP Guide, Yunus Tez Blog"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0A6ED1] to-[#0858a8] text-white overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-semibold mb-6">
                SAP Technical Blog
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Your source for enterprise development insights, tutorials, and best practices.
                Learn about SAP technologies, cloud development, and modern application patterns.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 bg-white text-[#0A6ED1] px-6 py-3 rounded font-medium hover:shadow-lg transition-shadow"
                >
                  Explore Articles
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded font-medium hover:bg-white/10 transition-colors"
                >
                  About Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EAF2FB] rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-[#0A6ED1] code-icon-animation" />
              </div>
              <h3 className="text-xl font-semibold text-[#32363a] mb-2">
                Code Examples
              </h3>
              <p className="text-[#6a6d70]">
                Practical, ready-to-use code snippets and complete examples for your projects
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EAF2FB] rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-[#0A6ED1] layers-icon-animation" />
              </div>
              <h3 className="text-xl font-semibold text-[#32363a] mb-2">
                Architecture Patterns
              </h3>
              <p className="text-[#6a6d70]">
                Learn proven architectural patterns and design principles for enterprise apps
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EAF2FB] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                <Zap className="w-8 h-8 text-[#0A6ED1] zap-icon-animation" />
              </div>
              <h3 className="text-xl font-semibold text-[#32363a] mb-2">
                Performance Tips
              </h3>
              <p className="text-[#6a6d70]">
                Optimization techniques and best practices for high-performance applications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-[#32363a] mb-2">
                Featured Articles
              </h2>
              <p className="text-[#6a6d70]">
                Latest insights and tutorials from our technical experts
              </p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#0A6ED1] font-medium hover:gap-3 transition-all"
            >
              View all posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
