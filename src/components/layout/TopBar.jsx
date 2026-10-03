import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, User, Settings as SettingsIcon, CheckCircle2, Trash2, X, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { notifications as seedNotifications } from "@/employee/lib/mock-data";
import { useRole, useUser, logout, roleLabels } from "@/lib/auth";
import { useStore, uid } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const seededNotifications = seedNotifications.map((n) => ({
  ...n,
  id: uid("ntf"),
  read: false
}));

function TopBar() {
  const role = useRole();
  const user = useUser();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [confirmOut, setConfirmOut] = useState(false);
  const [notifs, setNotifs] = useStore("notifications", seededNotifications);
  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("nexus-theme", next ? "dark" : "light");
  };

  const performSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.trim().toLowerCase();
    if (["employee", "employees", "people"].some((k) => q.includes(k))) navigate("/admin/employees");
    else if (q.includes("task")) navigate("/tasks");
    else if (q.includes("leave")) navigate("/leave");
    else if (q.includes("pay")) navigate("/payroll");
    else if (q.includes("doc")) navigate("/documents");
    else if (q.includes("attend")) navigate("/attendance");
    else toast.info(`No matches for "${query}"`);
    setQuery("");
  };

  const doLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6">
      <form onSubmit={performSearch} className="relative w-full max-w-sm">
  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search employees, tasks, leave…"
    className="w-full rounded-lg bg-surface border border-border pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
  />
</form>

<div className="flex-1" />

      <button
        onClick={toggleDarkMode}
        className="grid h-9 w-9 place-items-center rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="relative grid h-9 w-9 place-items-center rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-96 p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="text-sm font-semibold">Notifications</div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
                  toast.success("All marked as read");
                }}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifs.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">You're all caught up 🎉</div>
            )}
            {notifs.map((n) => (
              <div key={n.id} className={`group flex items-start gap-3 p-3 ${n.read ? "opacity-70" : "bg-accent/20"}`}>
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    n.type === "success" ? "bg-success" : n.type === "warning" ? "bg-warning" : "bg-info"
                  }`}
                />
                <button
                  onClick={() => {
                    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{n.time}</div>
                </button>
                <div className="flex opacity-0 group-hover:opacity-100">
                  {!n.read && (
                    <button
                      onClick={() => setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-accent"
                      aria-label="Mark read"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setNotifs((prev) => prev.filter((x) => x.id !== n.id))}
                    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-accent"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {notifs.length > 0 && (
            <div className="border-t border-border p-2">
              <button
                onClick={() => {
                  setNotifs([]);
                  toast.success("Notifications cleared");
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs text-muted-foreground hover:bg-accent"
              >
                <X className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hidden sm:flex items-center gap-2 pl-2 rounded-lg hover:bg-accent px-2 py-1">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </div>
            <div className="hidden md:block leading-tight text-left">
              <div className="text-sm font-medium">
                {user?.name || "Guest"}
              </div>
              <div className="text-xs text-muted-foreground">{roleLabels[role]}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="font-medium">
              {user?.name || "Guest"}
            </div>
            <div className="text-xs font-normal text-muted-foreground">{user?.email || ""}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <SettingsIcon className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setConfirmOut(true)} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOut}
        onOpenChange={setConfirmOut}
        title="Sign out?"
        description="You will need to sign in again to continue."
        confirmLabel="Sign out"
        onConfirm={doLogout}
      />
    </header>
  );
}

export { TopBar };