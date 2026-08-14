import SignupView from "../../components/signup/SignupView";
import MotionProvider from "../../components/ui/MotionProvider";

export const metadata = {
  title: "Create your account — Pitchloop",
  description:
    "Start practicing real sales conversations with AI buyers. Free forever on the Starter plan, no card required.",
};

export default function SignupPage() {
  return (
    <MotionProvider>
      <div className="pl">
        <SignupView />
      </div>
    </MotionProvider>
  );
}
