import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import CTASection from "@/components/home/cta-section";
import WhoItsForSection from "@/components/home/who-its-for-section";

export default function Home() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <CTASection />
    </div>
  );
}
