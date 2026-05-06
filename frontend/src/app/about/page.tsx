import GallerySection from "@/components/about/GallerySection";
import HeroSection from "@/components/about/HeroSection";
import HowWeHelp from "@/components/about/HowWeHelp";
import MissionSection from "@/components/about/MissionSection";
import StorySection from "@/components/about/StorySection";
import WhyChooseUs from "@/components/about/WhyChooseUs";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <StorySection />
      <MissionSection />
      <HowWeHelp />
      <GallerySection />
      <WhyChooseUs />
    </div>
  );
}
