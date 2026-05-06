import AIPlannerSection from "@/components/home/AIPlannerSection";
import AboutPreview from "@/components/home/AboutPreview";
import FinalCTASection from "@/components/home/FinalCTASection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <HowItWorksSection />
      <AIPlannerSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
