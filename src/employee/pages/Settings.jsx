import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const currentUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@nexus.io",
  phone: "+1 (555) 012-4789",
  timezone: "America/Los_Angeles",
};

const sections = ["Account", "Security", "Notifications", "Preferences"];

function Settings() {
  const [section, setSection] = useState("Account");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="rounded-2xl border border-border bg-card p-2 h-fit">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`block w-full text-left rounded-lg px-3 py-2 text-sm ${section === s ? "bg-surface-elevated font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-border bg-card p-6">
          {section === "Account" && (
            <div className="space-y-5">
              <Field label="Full Name" value={`${currentUser.firstName} ${currentUser.lastName}`} />
              <Field label="Email" value={currentUser.email} />
              <Field label="Phone" value={currentUser.phone} />
              <Field label="Time Zone" value={currentUser.timezone} />
              <Button>Save Account</Button>
            </div>
          )}

          {section === "Security" && (
            <div className="space-y-5">
              <div>
                <div className="text-sm font-medium">Change Password</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Current password" value="" type="password" />
                  <Field label="New password" value="" type="password" />
                </div>
              </div>
              <Toggle label="Two-factor authentication" desc="Add an extra layer of security to your account" defaultOn />
              <Toggle label="Session expiry after 30 days" desc="Automatically sign out on idle browsers" defaultOn />
              <div>
                <div className="text-sm font-medium">Active Sessions</div>
                <div className="mt-2 space-y-2 text-sm">
                  <SessionRow device="MacBook Pro · San Francisco" active last="Now" />
                  <SessionRow device="iPhone 15 · San Francisco" last="2h ago" />
                </div>
              </div>
            </div>
          )}

          {section === "Notifications" && (
            <div className="space-y-4">
              <Toggle label="Email notifications" desc="Announcements, leave and payslip updates" defaultOn />
              <Toggle label="Push notifications" desc="Real-time task and mention alerts" defaultOn />
              <Toggle label="Weekly digest" desc="Summary of your week every Friday" />
              <Toggle label="Task reminders" desc="Remind me 24h before a task is due" defaultOn />
            </div>
          )}

          {section === "Preferences" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Language</label>
                <Select defaultValue="English (US)">
                  <SelectTrigger className="mt-1" />
                  <SelectContent>
                    <SelectItem value="English (US)">English (US)</SelectItem>
                    <SelectItem value="Español">Español</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Deutsch">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Theme</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["Dark", "Light", "System"].map((t) => (
                    <button key={t} className={`rounded-lg border border-border px-3 py-2 text-sm ${t === "Dark" ? "bg-surface-elevated font-medium" : "bg-surface text-muted-foreground"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle label="Reduce motion" desc="Minimize animations across the app" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, type = "text" }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <Input type={type} defaultValue={value} />
    </label>
  );
}

function Toggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-gradient-primary" : "bg-muted"}`}
        aria-pressed={on}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SessionRow({ device, active, last }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
      <div>
        <div className="text-sm">{device}</div>
        <div className="text-xs text-muted-foreground">Last active {last}</div>
      </div>
      {active ? (
        <span className="rounded-full bg-success/15 text-success px-2 py-0.5 text-xs">Current</span>
      ) : (
        <button className="text-xs text-destructive hover:underline">Sign out</button>
      )}
    </div>
  );
}

export default Settings;