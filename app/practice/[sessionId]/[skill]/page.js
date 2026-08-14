import PracticeView from "../../../../components/practice/PracticeView";
import MotionProvider from "../../../../components/ui/MotionProvider";

export const metadata = {
  title: "Practice — Pitchloop",
  description: "Practice a specific sales skill with a focused drill built from your coaching report.",
};

export default function PracticePage() {
  return (
    <MotionProvider>
      <PracticeView />
    </MotionProvider>
  );
}
