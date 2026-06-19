import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  reverse?: boolean;
  id?: string;
}

export default function FeatureSection({
  icon: Icon,
  title,
  subtitle,
  description,
  bullets,
  reverse = false,
  id,
}: FeatureSectionProps) {
  return (
    <section id={id} className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`flex flex-col ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-12 lg:gap-20`}
        >
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
              <Icon className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3">
              {subtitle}
            </h3>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">{title}</h2>
            <p className="text-text-secondary leading-relaxed mb-6">{description}</p>
            <ul className="space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mockup side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="gradient-border rounded-2xl overflow-hidden">
              <div className="bg-card p-4 sm:p-6">
                <div className="rounded-xl overflow-hidden bg-surface border border-white/5 aspect-video flex items-center justify-center">
                  <div className="text-center p-6">
                    <Icon className="w-12 h-12 text-brand-400 mx-auto mb-4" />
                    <p className="text-text-secondary text-sm">{title} Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}