import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

function AppShell({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 min-w-0 overflow-y-auto scrollbar-hide p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}

export { AppShell };