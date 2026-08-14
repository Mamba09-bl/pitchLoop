import AppNav from "./AppNav";
import AppFooter from "./AppFooter";

/** Shared chrome for every authenticated app page — nav, footer, and the
    light `.pl` ground. Keeps /personas, /history, /pre-call,
    /voice-feedback and /coaching visually one product. */
export default function AppShell({ children, contain = true }) {
  return (
    <div className="pl flex min-h-screen flex-col">
      <AppNav />
      <main className="flex-1">
        {contain ? (
          <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">{children}</div>
        ) : (
          children
        )}
      </main>
      <AppFooter />
    </div>
  );
}
