import HeroSection from '../components/home/hero-section';
import { DemoSection } from '@/components/home/demo-section';
import HowItWorksSection from '@/components/home/how-it-works-section';

export default function Home() {
  return (
    // <div className="relative w-full">
    //   <BgGradient/>
    // </div>
    <div className="relative w-full">
      <HeroSection />
      <DemoSection />
      <HowItWorksSection />
      {/* 
      <pricingSection/>
      <CDATASection/> */}

    </div>

  );
}