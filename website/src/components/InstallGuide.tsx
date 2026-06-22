import { motion } from "framer-motion";
import { Download, Puzzle, FolderOpen, CheckCircle } from "lucide-react";
import { DOWNLOAD_URL } from "../config";

const steps = [
  {
    icon: Download,
    title: "Download the Extension",
    desc: "Click the button below to download the extension ZIP file.",
  },
  {
    icon: Puzzle,
    title: "Open Chrome Extensions",
    desc: "Go to chrome://extensions and enable Developer mode in the top-right corner.",
  },
  {
    icon: FolderOpen,
    title: "Load Unpacked",
    desc: "Click 'Load unpacked' and select the unzipped extension folder.",
  },
  {
    icon: CheckCircle,
    title: "Start Downloading",
    desc: "The UFO icon will appear in your toolbar. Visit any video page and click it!",
  },
];

export default function InstallGuide() {
  return (
    <section id="install" className="section-padding">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">
            Installation
          </h3>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Install the Extension
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            The extension is not yet on the Chrome Web Store. Follow these steps to install it manually — it takes less than a minute.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-6 text-center relative"
            >
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold">
                {i + 1}
              </div>
              <step.icon className="w-8 h-8 text-brand-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-sm mb-2">{step.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Download button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <a
            href={DOWNLOAD_URL}
            download
            className="gradient-btn text-base font-semibold px-10 py-4 rounded-xl text-white inline-flex items-center gap-3 shadow-lg shadow-brand-500/25 hover:opacity-90 transition-opacity"
          >
            <Download className="w-5 h-5" />
            Download Extension (ZIP)
          </a>
          <p className="text-text-muted text-xs mt-4">
            Version 1.0.0 &middot; Free &amp; Open Source &middot;{" "}
            <a href="https://github.com/mostdesign01-sudo/video-downloader-extension" className="text-brand-400 hover:underline">
              View on GitHub
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}