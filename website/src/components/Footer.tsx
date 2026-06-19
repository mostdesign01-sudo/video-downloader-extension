import { Download } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Changelog", "Roadmap"],
  Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"],
  Company: ["About", "Blog", "Careers", "Press Kit"],
  Connect: ["Twitter", "Discord", "GitHub", "Email"],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 text-white font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span>Video Downloader</span>
            </a>
            <p className="text-text-muted text-sm leading-relaxed">
              The most powerful video downloader for Chrome. Download videos from any website.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-text-muted text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} Video Downloader. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-text-muted text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-text-muted text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}