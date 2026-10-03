import { Layers, Users, Building2, Briefcase, Activity } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-hero overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary-glow/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-semibold text-lg">Nexus Technologies</div>
        </div>

        <div className="relative">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
            People-first<br />workforce platform
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Streamline HR operations, track performance, and empower your team — all in one unified workspace.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
            {[
              { icon: Users, value: "108", label: "Employees" },
              { icon: Building2, value: "6", label: "Departments" },
              { icon: Briefcase, value: "8", label: "Open roles" },
              { icon: Activity, value: "99.9%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card/50 backdrop-blur p-4">
                <s.icon className="h-4 w-4 text-primary" />
                <div className="mt-3 text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-muted-foreground">© 2024 Nexus Technologies</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-semibold">Nexus Technologies</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;