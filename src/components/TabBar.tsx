import React from "react";
import { NavLink } from "react-router-dom";

type Item = { 
  to: string; 
  label: string; 
  icon: React.ReactNode; 
  testId?: string;
};

const Icon = ({ d, active }: { d: string; active?: boolean }) => (
  <svg 
    width="22" 
    height="22" 
    viewBox="0 0 24 24" 
    fill="none"
    className="shrink-0" 
    aria-hidden="true"
  >
    <path 
      d={d}
      stroke={active ? "#FFFFFF" : "#bfc3c9ff"}
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// Minimal iOS-style strokes
const PATHS = {
  home: "M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9Zm6 10.5V14h6v7",
  events: "M7 4h10M7 8h10M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6M8 12h8M8 16h6",
  fantasy: "M12 3l2.6 5.2L20 9l-4 3.9L17.2 19 12 16.3 6.8 19 8 12.9 4 9l5.4-.8L12 3Z",
  boards: "M4 20h16M6 16h4v-9H6v9Zm8 0h4V7h-4v9Z",
  search: "M11 18a7 7 0 1 1 4.95-11.95A7 7 0 0 1 11 18Zm6.5 2.5L16 19"
};

export default function TabBar() {
  const items: Item[] = [
    { to: "/", label: "Home", icon: <Icon d={PATHS.home} /> },
    { to: "/events", label: "Events", icon: <Icon d={PATHS.events} /> },
    { to: "/fantasy", label: "Fantasy", icon: <Icon d={PATHS.fantasy} /> },
    { to: "/boards", label: "Boards", icon: <Icon d={PATHS.boards} /> },
    { to: "/search", label: "Search", icon: <Icon d={PATHS.search} /> }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 tab-glass shadow-glass border-t border-rb-line/60 z-50">
      <div className="safe-bottom">
        <ul className="mx-auto max-w-[432px] flex items-end justify-between px-6">
          {items.map((it) => (
            <li key={it.to} className="flex-1">
              <NavLink
                to={it.to}
                end
                className={({ isActive }) =>
                  [
                    "flex flex-col items-center justify-center h-[60px] gap-1",
                    "transition-transform active:scale-95 select-none"
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {React.cloneElement(it.icon as any, { active: isActive })}
                    <span
                      className={
                        "text-[12px] font-medium " +
                        (isActive ? "text-rb-white" : "text-rb-subtext")
                      }
                    >
                      {it.label}
                    </span>
                    {/* active indicator */}
                    <span
                      className={
                        "mt-1 h-1 w-6 rounded-pill bg-white transition-opacity " +
                        (isActive ? "opacity-100" : "opacity-0")
                      }
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
