import ClosingCTA from "../components/landing/ClosingCTA";
import Hero from "../components/landing/Hero";
import LandingNav from "../components/landing/LandingNav";
import ObjectionTicker from "../components/landing/ObjectionTicker";
import ProgressSection from "../components/landing/ProgressSection";
import SkillLab from "../components/landing/SkillLab";
import TheLoop from "../components/landing/TheLoop";
import Voices from "../components/landing/Voices";
import MotionProvider from "../components/ui/MotionProvider";

export default function LandingPage() {
  return (
    <MotionProvider>
      <div className="pl min-h-screen">
        <LandingNav />
        <main>
          <Hero />
          <ObjectionTicker />
          <TheLoop />
          <SkillLab />
          <ProgressSection />
          <Voices />
        </main>
        <ClosingCTA />
      </div>
    </MotionProvider>
  );
}
