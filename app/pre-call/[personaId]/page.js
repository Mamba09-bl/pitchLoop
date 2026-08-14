import PreCallView from "../../../components/pre-call/PreCallView";
import MotionProvider from "../../../components/ui/MotionProvider";

export const metadata = {
  title: "Prepare your call — Pitchloop",
  description: "Give the AI buyer your sales context before the call begins.",
};

export default function PreCallPage() {
  return (
    <MotionProvider>
      <PreCallView />
    </MotionProvider>
  );
}
