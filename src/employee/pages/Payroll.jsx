import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyPayroll } from "../services/payrollService";

function formatMoney(amount) {
  const num = Number(amount) || 0;
  const sign = num < 0 ? "-" : "";
  return `${sign}$${Math.abs(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
}

function Payroll() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPayroll()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Payroll fetch error:", err);
        toast.error("Failed to load payroll details");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground p-6">Loading payroll details...</p>;
  }

  const payslip = data?.payslip || {
    month: "Current Period",
    earnings: [{ label: "Basic Salary", amount: 8000 }],
    grossTotal: 8000,
    deductions: [{ label: "Tax", amount: 1000 }],
    totalDeductions: 1000,
    netPay: 7000,
    paidOn: "End of month",
  };

  const ytdSummary = data?.ytdSummary || { grossEarned: 0, totalDeductions: 0, netReceived: 0, taxesPaid: 0 };
  const pastPayslips = data?.pastPayslips || [];
  const netPayTrend = data?.netPayTrend || [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Payroll</h1>
      <p className="mt-1 text-sm text-muted-foreground">View payslips and compensation details</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Left: Payslip card */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                PAYSLIP
              </p>
              <h2 className="mt-1 text-xl font-semibold">{payslip.month}</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()}>Download PDF</Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                EARNINGS
              </p>
              {payslip.earnings.map((item) => (
                <div className="flex justify-between py-1.5 text-sm" key={item.label}>
                  <span className="text-muted-foreground">{item.label}</span>
                  <span>{formatMoney(item.amount)}</span>
                </div>
              ))}
              <div className="mt-1 flex justify-between border-t border-border pt-2 text-sm font-medium">
                <span>Gross Total</span>
                <span className="text-success">{formatMoney(payslip.grossTotal)}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                DEDUCTIONS
              </p>
              {payslip.deductions.map((item) => (
                <div className="flex justify-between py-1.5 text-sm" key={item.label}>
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-destructive">{formatMoney(item.amount)}</span>
                </div>
              ))}
              <div className="mt-1 flex justify-between border-t border-border pt-2 text-sm font-medium">
                <span>Total Deductions</span>
                <span className="text-destructive">{formatMoney(payslip.totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/40 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Net Pay</p>
              <h2 className="text-xl font-semibold">{formatMoney(payslip.netPay)}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Paid on</p>
              <p className="text-sm">{payslip.paidOn}</p>
            </div>
          </div>
        </Card>

        {/* Right: YTD Summary */}
        <Card className="p-6">
          <h3 className="text-base font-semibold">YTD Summary</h3>

          <div className="mt-3 flex justify-between border-b border-border py-1.5 text-sm">
            <span className="text-muted-foreground">Gross Earned</span>
            <span>{formatMoney(ytdSummary.grossEarned)}</span>
          </div>
          <div className="flex justify-between border-b border-border py-1.5 text-sm">
            <span className="text-muted-foreground">Total Deductions</span>
            <span className="text-destructive">{formatMoney(ytdSummary.totalDeductions)}</span>
          </div>
          <div className="flex justify-between border-b border-border py-1.5 text-sm">
            <span className="text-muted-foreground">Net Received</span>
            <span className="text-success">{formatMoney(ytdSummary.netReceived)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-sm">
            <span className="text-muted-foreground">Taxes Paid</span>
            <span className="text-warning">{formatMoney(ytdSummary.taxesPaid)}</span>
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Past Payslips
          </p>
          {pastPayslips.map((item) => (
            <div
              className="flex cursor-pointer justify-between py-1.5 text-sm text-muted-foreground hover:text-foreground"
              key={item.month}
            >
              <span>{item.month}</span>
              <span>{formatMoney(item.amount)}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom: Net Pay Trend chart */}
      {netPayTrend.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="text-base font-semibold">Net Pay Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={netPayTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="gross" stroke="var(--info)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="net" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

export default Payroll;