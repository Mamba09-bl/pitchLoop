import { useRouter } from "next/navigation";
import { Menu, X, History, Users, ChevronRight } from "lucide-react";

const BRAND = "Pitchloop";

const NAV = [
  {
    label: "Personas",
    icon: Users,
    path: "/personas",
  },
  {
    label: "Session History",
    icon: History,
    path: "/history",
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeNav,
  setActiveNav,
}) {
  const router = useRouter();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-surface-0/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 flex flex-col flex-shrink-0 border-r border-border-subtle bg-surface-1/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[13px] font-bold text-on-accent">
              P
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
              {BRAND}
            </span>
          </div>
          <button
            className="lg:hidden text-text-tertiary hover:text-text-primary transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mx-5 mb-5 h-px bg-border-subtle" />

        {/* Nav */}
        <nav className="flex-1 px-3">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            Workspace
          </p>
          <div className="space-y-0.5">
            {NAV.map(({ label, icon: Icon, path }) => {
              const active = activeNav === label;

              return (
                <button
                  key={label}
                  onClick={() => {
                    setActiveNav(label);
                    setSidebarOpen(false);
                    router.push(path);
                  }}
                  className={`group relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 text-left ${
                    active
                      ? "bg-accent-muted text-text-primary"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-accent" />
                  )}
                  <Icon
                    className={`w-[17px] h-[17px] flex-shrink-0 ${
                      active
                        ? "text-accent"
                        : "text-text-tertiary group-hover:text-text-secondary"
                    }`}
                  />

                  {label}

                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-accent/60" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
