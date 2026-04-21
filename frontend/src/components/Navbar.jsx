import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  Code,
  LayoutDashboardIcon,
} from "lucide-react";
import { UserButton } from "@clerk/react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

function Navbar() {
  const location = useLocation();
  const themeMenuRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return THEMES[0];

    return localStorage.getItem("theme") || THEMES[0];
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isActive = (path) => location.pathname === path;
  const formatThemeLabel = (themeName) =>
    themeName.charAt(0).toUpperCase() + themeName.slice(1);

  const handleThemeChange = (themeName) => {
    setTheme(themeName);

    if (themeMenuRef.current) {
      themeMenuRef.current.open = false;
    }
  };

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to={"/"}
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-linear-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <Code className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-wider">
              interviewFlow
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">
              Code Together
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <details
            ref={themeMenuRef}
            className="dropdown dropdown-end mr-2 relative"
          >
            <summary className="list-none btn btn-ghost btn-sm bg-transparent border-0 shadow-none text-white hover:bg-white/8 px-3">
              <span
                data-theme={theme}
                className="grid h-5 w-5 shrink-0 grid-cols-2 gap-0.5 rounded-md bg-base-100 p-0.5 shadow-sm"
              >
                <span className="rounded-sm bg-primary" />
                <span className="rounded-sm bg-secondary" />
                <span className="rounded-sm bg-accent" />
                <span className="rounded-sm bg-neutral" />
              </span>
              <ChevronDownIcon className="size-4 opacity-70" />
            </summary>

            <div className="absolute right-0 top-full z-[100] mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900/95 p-3 text-slate-100 shadow-2xl backdrop-blur-xl">
              <div className="px-2 pb-2 text-sm font-semibold text-slate-400">
                Theme
              </div>

              <div className="max-h-96 overflow-y-auto pr-1">
                <ul className="space-y-1">
                  {THEMES.map((themeName) => (
                    <li key={themeName}>
                      <button
                        type="button"
                        onClick={() => handleThemeChange(themeName)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          theme === themeName
                            ? "bg-white/8 text-white"
                            : "text-slate-200 hover:bg-white/6"
                        }`}
                      >
                        <span
                          data-theme={themeName}
                          className="grid h-5 w-5 shrink-0 grid-cols-2 gap-0.5 rounded-md bg-base-100 p-0.5 shadow-sm"
                        >
                          <span className="rounded-sm bg-primary" />
                          <span className="rounded-sm bg-secondary" />
                          <span className="rounded-sm bg-accent" />
                          <span className="rounded-sm bg-neutral" />
                        </span>

                        <span className="flex-1 font-medium text-sm">
                          {formatThemeLabel(themeName)}
                        </span>

                        {theme === themeName && (
                          <CheckIcon className="size-4 text-white" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashbord</span>
            </div>
          </Link>

          <div className="ml-4 mt-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
