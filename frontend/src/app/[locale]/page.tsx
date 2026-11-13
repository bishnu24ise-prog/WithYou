import HeroSpark from '@/components/HeroSpark';
import SurvivorTestimonials from '@/components/SurvivorTestimonials';
import SilenceDataStory from '@/components/SilenceDataStory';
import SafetyGapChart from '@/components/SafetyGapChart';
import WorldVoiceMarquee from '@/components/WorldVoiceMarquee';
import ProblemSolutionThread from '@/components/ProblemSolutionThread';
import PrivacyPromise from '@/components/PrivacyPromise';
import Manifesto from '@/components/Manifesto';
import SafeSparkFooter from '@/components/SafeSparkFooter';

export default async function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section: The Spark Within, animated SVG lotus, rotating mandala, particle canvas */}
      <HeroSpark />

      {/* Survivor Testimonials: Rotating quote strip */}
      <SurvivorTestimonials />

      {/* The Silence (Data Story): 5 chapters with verified survey numbers and visualizations */}
      <SilenceDataStory />

      {/* Safety Gap: Interactive Gallup 2025 country comparison */}
      <SafetyGapChart />

      {/* What The World Is Saying: 2-row marquee with flip cards */}
      <WorldVoiceMarquee />

      {/* Problem to Solution Pipeline: Connected thread */}
      <ProblemSolutionThread />

      {/* Privacy Promise: Paranoia-grade privacy safeguards */}
      <PrivacyPromise />

      {/* Manifesto: "She is ___" rotating word animation */}
      <Manifesto />

      {/* Verified Helplines Directory & Footer */}
      <SafeSparkFooter />
    </div>
  );
}
