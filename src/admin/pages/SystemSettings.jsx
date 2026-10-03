import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HardDriveDownload, Undo2, AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Field as FieldWrap, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSystemSettings, saveSystemSettings } from "../services/adminService";

function Toggle({ label, on, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}
        aria-pressed={on}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SystemSettings() {
  const [companyName, setCompanyName] = useState("Nexus Technologies");
  const [industry, setIndustry] = useState("Technology");
  const [headquarters, setHeadquarters] = useState("San Francisco, CA");
  const [fiscalYear, setFiscalYear] = useState("January");
  const [currency, setCurrency] = useState("USD");
  const [workWeek, setWorkWeek] = useState("Mon–Fri");

  const [mfa, setMfa] = useState(true);
  const [auditLog, setAuditLog] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSystemSettings()
      .then((res) => {
        const data = res.data;
        if (data.company_name) setCompanyName(data.company_name);
        if (data.industry) setIndustry(data.industry);
        if (data.headquarters) setHeadquarters(data.headquarters);
        if (data.fiscal_year_start) setFiscalYear(data.fiscal_year_start);
        if (data.default_currency) setCurrency(data.default_currency);
        if (data.work_week) setWorkWeek(data.work_week);
        if (data.mfa_required !== undefined) setMfa(data.mfa_required === "true");
        if (data.audit_logging !== undefined) setAuditLog(data.audit_logging === "true");
      })
      .catch((err) => console.error("Fetch settings error:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSystemSettings({
        company_name: companyName,
        industry,
        headquarters,
        fiscal_year_start: fiscalYear,
        default_currency: currency,
        work_week: workWeek,
        mfa_required: mfa,
        audit_logging: auditLog,
      });
      toast.success("System configuration saved to database successfully!");
    } catch (err) {
      toast.error("Failed to save system settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure company settings and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Company Configuration</h2>
          <FieldWrap>
            <FieldLabel>Company Name</FieldLabel>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Industry</FieldLabel>
            <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Headquarters</FieldLabel>
            <Input value={headquarters} onChange={(e) => setHeadquarters(e.target.value)} />
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Fiscal Year Start</FieldLabel>
            <Input value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)} />
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Default Currency</FieldLabel>
            <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </FieldWrap>

          <FieldWrap>
            <FieldLabel>Work Week</FieldLabel>
            <Input value={workWeek} onChange={(e) => setWorkWeek(e.target.value)} />
          </FieldWrap>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-1">Data Backup</h2>
            <p className="text-xs text-muted-foreground mb-4">Database: nexus_hr_db • Backup automated daily at 03:00 UTC</p>
            <div className="flex gap-3">
              <Button onClick={() => toast.success("Manual database backup initiated!")}>
                <HardDriveDownload size={15} /> Backup Now
              </Button>
              <Button variant="outline" onClick={() => toast.info("Database restore ready via database/schema.sql")}>
                <Undo2 size={15} /> Restore
              </Button>
            </div>
          </Card>

          <Card className="p-6 divide-y divide-border">
            <h2 className="text-lg font-semibold mb-1 pb-3">System Toggles</h2>
            <Toggle label="Two-Factor Required" on={mfa} onChange={setMfa} />
            <Toggle label="Audit Logging" on={auditLog} onChange={setAuditLog} />
          </Card>

          <Card className="border-destructive/30 p-6">
            <h2 className="text-lg font-semibold mb-1">Danger Zone</h2>
            <p className="text-xs text-muted-foreground mb-4">These actions are irreversible. Proceed with caution.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => toast.error("Purging test data requires database administrator override")}
              >
                <AlertTriangle size={15} /> Purge Test Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;