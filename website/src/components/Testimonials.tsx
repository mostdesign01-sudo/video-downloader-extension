import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    text: "This is hands down the best video downloader I've ever used. Works flawlessly on every site I've tried. The interface is clean and intuitive.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Video Editor",
    text: "I use this daily for my work. The m3u8 to MP4 conversion is a game changer. Highly recommend to anyone who works with video content.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Teacher",
    text: "Perfect for saving educational videos for offline classroom use. The casting feature to TV is brilliant for showing videos to my students.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">
            Testimonials
          </h3>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Loved by Users Worldwide
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="card p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-text-secondary leading-relaxed mb-6">"{review.text}"</p>
              <div>
                <div className="text-white font-semibold">{review.name}</div>
                <div className="text-text-muted text-sm">{review.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}