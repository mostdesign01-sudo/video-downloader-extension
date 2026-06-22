import { motion } from "framer-motion";
import { Download, Star, Chrome } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="glow w-[600px] h-[600px] bg-brand-500 top-1/4 -left-20" />
      <div className="glow w-[400px] h-[400px] bg-accent bottom-1/4 -right-20" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-text-secondary mb-8">
            <Star className="w-4 h-4 text-brand-400 fill-brand-400" />
            <span>Trusted by 2M+ users worldwide</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          Download Videos From{" "}
          <span className="gradient-text">Any Website</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
        >
          The most powerful Chrome extension for downloading videos from YouTube, TikTok,
          Instagram, and thousands of other sites. Fast, free, and easy to use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#install"
            className="gradient-btn text-base font-semibold px-8 py-3.5 rounded-xl text-white inline-flex items-center gap-2.5 shadow-lg shadow-brand-500/25"
          >
            <Chrome className="w-5 h-5" />
            Add to Chrome — It's Free
          </a>
          <a
            href="#features"
            className="text-base font-medium px-8 py-3.5 rounded-xl text-text-secondary border border-white/10 hover:border-white/20 hover:text-white transition-colors"
          >
            See Features
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16"
        >
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="bg-card p-3 sm:p-4">
              <img
                src="/poster-ai.png"
                alt="Video Downloader - Download videos from any website"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}