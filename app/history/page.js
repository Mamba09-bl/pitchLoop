import HistoryView from "../../components/history/HistoryView";
import MotionProvider from "../../components/ui/MotionProvider";

export const metadata = {
  title: "History — Pitchloop",
  description: "Review your previous sales training sessions.",
};

export default function HistoryPage() {
  return (
    <MotionProvider>
      <HistoryView />
    </MotionProvider>
  );
}
