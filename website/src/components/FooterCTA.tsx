import { motion } from "framer-motion";
import { Chrome, ArrowRight } from "lucide-react";

export default function FooterCTA() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="glow w-[500px] h-[500px] bg-brand-500 top-0 left-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto text-center px-6"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
          Ready to Start Downloading?
        </h2>
        <p className="text-text-secondary text-lg mb-10 max-w-lg mx-auto">
          Join over 2 million users who trust Video Downloader. Add it to Chrome
          and start downloading videos in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#install"
            className="gradient-btn text-base font-semibold px-8 py-3.5 rounded-xl text-white inline-flex items-center gap-2.5 shadow-lg shadow-brand-500/25"
          >
            <Chrome className="w-5 h-5" />
            Add to Chrome — It's Free
          </a>
          <a
            href="#features"
            className="text-base font-medium px-8 py-3.5 rounded-xl text-text-secondary border border-white/10 hover:border-white/20 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}