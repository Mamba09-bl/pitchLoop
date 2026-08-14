import { Suspense } from "react";
import TranscriptView from "../../../components/transcript/TranscriptView";
import MotionProvider from "../../../components/ui/MotionProvider";

export const metadata = {
  title: "Transcript — Pitchloop",
  description: "Review the full conversation from a past practice call.",
};

export default function TranscriptPage() {
  return (
    <MotionProvider>
      <Suspense fallback={null}>
        <TranscriptView />
      </Suspense>
    </MotionProvider>
  );
}
