import { motion } from "framer-motion";
import { Puzzle, MousePointerClick, Download } from "lucide-react";

const steps = [
  {
    icon: Puzzle,
    step: "Step 1",
    title: "Install the Extension",
    description:
      "Add Video Downloader to Chrome with one click from the Chrome Web Store. No registration required.",
  },
  {
    icon: MousePointerClick,
    step: "Step 2",
    title: "Browse Any Video",
    description:
      "Navigate to any website with a video — YouTube, TikTok, Instagram, and 10,000+ more sites.",
  },
  {
    icon: Download,
    step: "Step 3",
    title: "Download Instantly",
    description:
      "Click the download button that appears and choose your preferred quality and format.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">
            How It Works
          </h3>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Start Downloading in 3 Easy Steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="card p-8 text-center relative"
            >
              <div className="w-14 h-14 rounded-xl gradient-btn flex items-center justify-center mx-auto mb-6">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                {s.step}
              </span>
              <h3 className="text-xl font-semibold text-white mt-2 mb-3">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{s.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}