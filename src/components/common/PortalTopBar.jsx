import { useState } from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useUser, roleLabels } from "@/lib/auth";

const avatarToneClass = {
  primary: "bg-primary text-primary-foreground",
  warning: "bg-warning text-primary-foreground"
};

function PortalTopBar({ avatarTone = "primary" }) {
  const user = useUser();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("nexus-theme", next ? "dark" : "light");
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg bg-input border border-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-2.5">
          <div
            className={`grid h-8 w-8 place-items-center rounded-full text-xs font-medium ${avatarToneClass[avatarTone]}`}
          >
            {initials}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">{user?.name || "Guest"}</div>
            <div className="text-xs text-muted-foreground">{user ? roleLabels[user.role] : ""}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export { PortalTopBar };