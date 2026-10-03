import { NavLink, useNavigate } from "react-router-dom";
import { Layers, LogOut } from "lucide-react";
import { useRole, useUser, roleLabels, logout } from "@/lib/auth";

const avatarToneClass = {
  primary: "bg-gradient-primary text-primary-foreground",
  warning: "bg-warning text-primary-foreground"
};

function PortalSidebar({ navItems, portalLabel, avatarTone = "primary" }) {
  const navigate = useNavigate();
  const role = useRole();
  const user = useUser();
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="hidden lg:flex h-screen w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
          <Layers className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="font-semibold text-sidebar-foreground">Nexus HR</div>
      </div>

      <div className="px-5 pb-2 pt-4 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {portalLabel}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide space-y-0.5 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div
            className={`grid h-9 w-9 place-items-center rounded-full text-xs font-semibold shrink-0 ${avatarToneClass[avatarTone]}`}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name || "Guest"}
            </div>
            <div className="truncate text-xs text-muted-foreground">{roleLabels[role]}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground hover:text-sidebar-foreground"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export { PortalSidebar };