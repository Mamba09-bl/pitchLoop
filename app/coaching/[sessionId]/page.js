import CoachingView from "../../../components/coaching/CoachingView";
import MotionProvider from "../../../components/ui/MotionProvider";

export const metadata = {
  title: "Coaching report — Pitchloop",
  description: "Your skill-by-skill coaching report and next steps.",
};

export default function CoachingPage() {
  return (
    <MotionProvider>
      <CoachingView />
    </MotionProvider>
  );
}
