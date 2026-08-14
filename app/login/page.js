import LoginView from "../../components/login/LoginView";
import MotionProvider from "../../components/ui/MotionProvider";

export const metadata = {
  title: "Log in — Pitchloop",
  description:
    "Log back in to Pitchloop and keep practicing real sales conversations with AI buyers.",
};

export default function LoginPage() {
  return (
    <MotionProvider>
      <div className="pl">
        <LoginView />
      </div>
    </MotionProvider>
  );
}
