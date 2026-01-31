import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileCode, Search, Menu, X, Linkedin, Instagram, Github } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
    { path: '/categories', label: 'Categories' },
    { path: '/about', label: 'About' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white border-b border-[#d9d9d9] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="w-8 h-8 bg-[#0A6ED1] rounded flex items-center justify-center">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            {/* 'hidden sm:block' sınıfını kaldırdım, artık her zaman görünür */}
            <span className="text-xl font-semibold text-[#32363a]">Yunus Tez</span>
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center flex-1 justify-end gap-6">

             {/* Social Media Icons & Search Bar Container */}
             <div className="flex items-center gap-4">
                 {/* Social Media Icons */}
                 <div className="flex items-center gap-3">
                    <a href="https://www.linkedin.com/in/yunus-tez-61231021a/" target="_blank" rel="noopener noreferrer" className="text-[#6a6d70] hover:text-[#0077b5] transition-colors flex items-center">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/yunus42tez" target="_blank" rel="noopener noreferrer" className="text-[#6a6d70] hover:text-[#E1306C] transition-colors flex items-center">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://github.com/yunus42tez?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-[#6a6d70] hover:text-[#333] transition-colors flex items-center">
                      <Github className="w-5 h-5" />
                    </a>
                 </div>

                 {/* Search Bar */}
                 <div className="max-w-xs w-full">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 pl-10 bg-[#f5f5f5] border border-transparent rounded-full focus:bg-white focus:border-[#0A6ED1] focus:outline-none transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="w-4 h-4 text-[#6a6d70] absolute left-3.5" />
                    </form>
                  </div>
             </div>

              {/* Nav Links */}
              <nav className="flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded transition-colors text-sm font-medium flex items-center ${
                      location.pathname === item.path
                        ? 'bg-[#EAF2FB] text-[#0A6ED1]'
                        : 'text-[#32363a] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#32363a] hover:bg-[#f5f5f5] rounded flex items-center"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#d9d9d9] absolute w-full left-0 shadow-lg">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 bg-[#f5f5f5] border border-transparent rounded-lg focus:bg-white focus:border-[#0A6ED1] focus:outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-[#6a6d70] absolute left-3.5 top-2.5" />
            </form>

            {/* Mobile Social Icons */}
            <div className="flex items-center gap-6 justify-center py-2 border-b border-gray-100 pb-4">
                <a href="https://www.linkedin.com/in/yunus-tez-61231021a/" target="_blank" rel="noopener noreferrer" className="text-[#6a6d70] hover:text-[#0077b5]">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/yunus42tez" target="_blank" rel="noopener noreferrer" className="text-[#6a6d70] hover:text-[#E1306C]">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://github.com/yunus42tez?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-[#6a6d70] hover:text-[#333]">
                  <Github className="w-6 h-6" />
                </a>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded transition-colors text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-[#EAF2FB] text-[#0A6ED1]'
                      : 'text-[#32363a] hover:bg-[#f5f5f5]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
