import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch categories", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
        <p className="text-[#6a6d70]">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-[#32363a] mb-3">Categories</h1>
          <p className="text-lg text-[#6a6d70]">
            Browse articles by topic and technology area
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white border border-[#d9d9d9] rounded p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <FolderOpen 
                    className="w-6 h-6" 
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#32363a] group-hover:text-[#0A6ED1] transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-[#6a6d70] bg-[#f5f5f5] px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </div>
                  <p className="text-[#6a6d70]">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
