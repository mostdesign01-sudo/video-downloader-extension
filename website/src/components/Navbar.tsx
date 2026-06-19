import { useState, useEffect } from "react";
import { Menu, X, Download } from "lucide-react";
import { STORE_URL } from "../config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 text-white font-bold text-lg">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <span>Video Downloader</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-text-secondary hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-text-secondary hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm text-text-secondary hover:text-white transition-colors">
            Reviews
          </a>
          <a href="#faq" className="text-sm text-text-secondary hover:text-white transition-colors">
            FAQ
          </a>
          <a
            href={STORE_URL}
            className="gradient-btn text-sm font-medium px-5 py-2.5 rounded-lg text-white inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Add to Chrome
          </a>
        </div>

        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-text-secondary" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-text-secondary" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#testimonials" className="text-sm text-text-secondary" onClick={() => setMobileOpen(false)}>Reviews</a>
          <a href="#faq" className="text-sm text-text-secondary" onClick={() => setMobileOpen(false)}>FAQ</a>
          <a href={STORE_URL} className="gradient-btn text-sm font-medium px-5 py-2.5 rounded-lg text-white text-center">
            Add to Chrome
          </a>
        </div>
      )}
    </nav>
  );
}