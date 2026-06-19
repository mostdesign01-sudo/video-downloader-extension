import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is Video Downloader really free?",
    a: "Yes! Video Downloader is completely free. You can download as many videos as you want with no limits on quality or quantity.",
  },
  {
    q: "Which websites are supported?",
    a: "Video Downloader works with over 10,000 websites including YouTube, TikTok, Instagram, Facebook, Twitter, Vimeo, Dailymotion, and many more. If a website has a video, our extension can likely detect and download it.",
  },
  {
    q: "Is it safe to use?",
    a: "Absolutely. Our extension is verified by the Chrome Web Store team and does not collect any personal data. We use industry-standard encryption for all downloads and never access your browsing history.",
  },
  {
    q: "What video formats are supported?",
    a: "We support MP4, WebM, MKV, AVI, and MOV formats. We also support m3u8 to MP4 conversion for streaming video downloads.",
  },
  {
    q: "Can I download videos in 4K?",
    a: "Yes! Our extension supports downloads up to 4K resolution when available from the source.",
  },
  {
    q: "How does TV casting work?",
    a: "Our built-in casting feature allows you to stream downloaded videos directly to your Chromecast, Smart TV, or any DLNA-compatible device on your network.",
  },
  {
    q: "What is cloud backup?",
    a: "Cloud backup automatically saves your downloaded videos to our secure cloud storage, so you never lose your content even if you switch devices.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">
            FAQ
          </h3>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-text-secondary text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}