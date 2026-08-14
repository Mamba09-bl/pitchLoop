import PersonasView from "../../components/personas/PersonasView";
import MotionProvider from "../../components/ui/MotionProvider";

export const metadata = {
  title: "Choose a persona — Pitchloop",
  description:
    "Pick an AI buyer persona and start a practice chat or live call.",
};

export default function PersonasPage() {
  return (
    <MotionProvider>
      <PersonasView />
    </MotionProvider>
    // When you go in the middle rose, don't keep your body click still because this prevents scale if we're retracting, which takes the century off your lap. Instead, pusher should be blade down on the bottom and reach yourself to the ground and then throw the way up towards your edge so you can fully stretch if you direct your lap. All right, quick tip when you're going to middle roads, don't you?
  );
}
