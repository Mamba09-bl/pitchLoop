import { Suspense } from "react";
import VoiceFeedbackView from "../../../components/voice-feedback/VoiceFeedbackView";
import MotionProvider from "../../../components/ui/MotionProvider";

export const metadata = {
  title: "Call review — Pitchloop",
  description: "Review your call feedback, score, and next steps.",
};

export default function VoiceFeedbackPage() {
  return (
    <MotionProvider>
      <Suspense fallback={null}>
        <VoiceFeedbackView />
      </Suspense>
    </MotionProvider>
  );
}
