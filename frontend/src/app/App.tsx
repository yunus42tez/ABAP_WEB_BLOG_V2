import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Home } from '@/app/pages/Home';
import { BlogList } from '@/app/pages/BlogList';
import { BlogDetail } from '@/app/pages/BlogDetail';
import { Categories } from '@/app/pages/Categories';
import { CategoryDetail } from '@/app/pages/CategoryDetail';
import { About } from '@/app/pages/About';
import { PageTransition } from '@/app/components/PageTransition';

// Animasyonun her sayfa değişiminde tetiklenmesi için
// Routes'u sarmalayan bir bileşen kullanacağız.
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={
        <PageTransition>
          <Home />
        </PageTransition>
      } />
      <Route path="/blog" element={
        <PageTransition>
          <BlogList />
        </PageTransition>
      } />
      <Route path="/blog/:id" element={
        <PageTransition>
          <BlogDetail />
        </PageTransition>
      } />
      <Route path="/categories" element={
        <PageTransition>
          <Categories />
        </PageTransition>
      } />
      <Route path="/categories/:slug" element={
        <PageTransition>
          <CategoryDetail />
        </PageTransition>
      } />
      <Route path="/about" element={
        <PageTransition>
          <About />
        </PageTransition>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-[#d9d9d9] py-8">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center text-[#6a6d70]">
              <p>© 2026 SAP Tech Blog. All rights reserved.</p>
              <p className="mt-2 text-sm">
                Built with React, TypeScript, Tailwind CSS, Python, Flask, SQLAlchemy • Inspired by SAP Fiori Design
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
