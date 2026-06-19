import { motion } from "framer-motion";
import { Download, Users, Star, Globe, Shield } from "lucide-react";

const metrics = [
  { icon: Users, value: "2M+", label: "Active Users" },
  { icon: Star, value: "4.8", label: "Chrome Store Rating" },
  { icon: Globe, value: "10,000+", label: "Supported Websites" },
  { icon: Download, value: "50M+", label: "Videos Downloaded" },
  { icon: Shield, value: "100%", label: "Safe & Secure" },
];

export default function TrustMetrics() {
  return (
    <section className="border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <metric.icon className="w-6 h-6 text-brand-400 mx-auto mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-text-muted">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}