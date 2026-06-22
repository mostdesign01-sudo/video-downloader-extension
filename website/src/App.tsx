import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustMetrics from "./components/TrustMetrics";
import FeatureSection from "./components/FeatureSection";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import InstallGuide from "./components/InstallGuide";
import FAQ from "./components/FAQ";
import FooterCTA from "./components/FooterCTA";
import Footer from "./components/Footer";
import {
  Download,
  Tv,
  Bookmark,
  FileVideo,
  Cloud,
} from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />

      <main>
        <Hero />
        <TrustMetrics />

        {/* Features section group */}
        <div id="features">
          <FeatureSection
            icon={Download}
            title="Download Videos From Any Website"
            subtitle="Powerful Downloading"
            description="Our extension automatically detects videos on any webpage and lets you download them with a single click. Supports YouTube, TikTok, Instagram, and thousands more sites."
            bullets={[
              "One-click download from any website",
              "Choose quality: 360p, 720p, 1080p, 4K",
              "Detect all videos on a page at once",
              "Background downloading while you browse",
            ]}
          />

          <FeatureSection
            icon={Tv}
            title="Cast Videos to Your TV"
            subtitle="TV Casting"
            description="Stream your downloaded videos directly to your TV. Works with Chromecast, Smart TVs, and any DLNA-compatible device on your network."
            bullets={[
              "One-click casting to Chromecast",
              "Works with all major Smart TV brands",
              "DLNA support for universal compatibility",
              "Full HD streaming with zero lag",
            ]}
            reverse
          />

          <FeatureSection
            icon={Bookmark}
            title="Save Videos to Watch Later"
            subtitle="Watch Later"
            description="Build your personal video library. Save videos with one click and organize them into playlists for easy access anytime, even offline."
            bullets={[
              "Create custom playlists",
              "Offline viewing support",
              "Tag and organize your library",
              "Sync across devices",
            ]}
          />

          <FeatureSection
            icon={FileVideo}
            title="m3u8 to MP4 and Format Conversion"
            subtitle="Format Conversion"
            description="Convert m3u8 streaming video to MP4 and convert between all major video formats. Professional-grade conversion with no quality loss."
            bullets={[
              "m3u8 to MP4 conversion",
              "MP4, WebM, MKV, AVI, MOV support",
              "Lossless conversion quality",
              "Batch conversion support",
            ]}
            reverse
          />

          <FeatureSection
            icon={Cloud}
            title="Cloud Backup for Your Videos"
            subtitle="Cloud Backup"
            description="Never lose your downloaded videos. Automatic cloud backup keeps your library safe and accessible from any device, anywhere."
            bullets={[
              "100GB secure cloud storage",
              "Automatic backup on download",
              "Access from any device",
              "End-to-end encryption",
            ]}
          />
        </div>

        <HowItWorks />
        <InstallGuide />
        <Testimonials />
        <FAQ />
        <FooterCTA />
      </main>

      <Footer />
    </div>
  );
}