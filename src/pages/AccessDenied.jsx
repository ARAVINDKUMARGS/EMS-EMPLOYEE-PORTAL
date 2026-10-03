import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { getRole } from "@/lib/auth";

function AccessDenied() {
  const role = getRole();
  const homePath = role === "admin" ? "/admin" : role === "hr" ? "/hr" : "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/15 text-destructive mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view this page. If you think this is a mistake, contact your administrator.
        </p>
        <Link
          to={homePath}
          className="mt-6 inline-block rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95"
        >
          Back to my dashboard
        </Link>
      </div>
    </div>
  );
}

export default AccessDenied;