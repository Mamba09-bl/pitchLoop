export default function AppFooter() {
  return (
    <footer className="border-t border-pl-rule">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <span className="pl-mono text-[11.5px] text-pl-mute">
          &copy; {new Date().getFullYear()} Pitchloop
        </span>
        <span className="pl-label hidden text-pl-mute sm:inline">
          Practice &middot; Score &middot; Coach &middot; Repeat
        </span>
      </div>
    </footer>
  );
}
