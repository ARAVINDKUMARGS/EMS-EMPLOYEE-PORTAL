import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RefreshCw, DollarSign, Users, TrendingUp, Calendar, Download } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@/components/ui/data-table";
import { getAdminPayroll, runPayroll as triggerRunPayroll } from "@/employee/services/payrollService";

const icons = [DollarSign, Users, TrendingUp, Calendar];
const tones = ["success", "info", "violet", "warning"];

function Payroll() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchPayroll = async () => {
    try {
      const res = await getAdminPayroll();
      setData(res.data);
    } catch (err) {
      console.error("Fetch admin payroll error:", err);
      toast.error("Failed to load admin payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleRunPayroll = async () => {
    setProcessing(true);
    try {
      const res = await triggerRunPayroll();
      toast.success(res.data.message || "Payroll processed successfully!");
      fetchPayroll();
    } catch (err) {
      toast.error("Failed to process payroll batch");
    } finally {
      setProcessing(false);
    }
  };

  const payrollStats = data?.stats || [
    { title: "Monthly Payroll Budget", value: "$165,000", subtitle: "+2.4% vs last month" },
    { title: "Processed Employees", value: 6, subtitle: "100% compliant" },
    { title: "Average Net Salary", value: "$7,500", subtitle: "Base pay across depts" },
    { title: "Next Payroll Date", value: "Oct 31, 2026", subtitle: "Scheduled batch" },
  ];

  const departments = data?.departments || [];
  const payrollHistory = data?.payrollHistory || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payroll Processing</h1>
          <p className="text-sm text-muted-foreground mt-1">Salary structures and payroll management</p>
        </div>
        <Button onClick={handleRunPayroll} disabled={processing || loading}>
          <RefreshCw size={16} className={processing ? "animate-spin" : ""} />
          {processing ? "Processing..." : "Run Payroll"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {payrollStats.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <StatCard key={item.title} label={item.title} value={item.value} sub={item.subtitle} icon={<Icon size={16} />} tone={tones[index % tones.length]} />
          );
        })}
      </div>

      <Card className="overflow-hidden p-0 mb-6">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold mb-2">Salary Structure by Department</h2>
        </div>
        <DataTable className="border-0">
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Department</DataTableHeadCell>
              <DataTableHeadCell>Average</DataTableHeadCell>
              <DataTableHeadCell>Minimum</DataTableHeadCell>
              <DataTableHeadCell>Maximum</DataTableHeadCell>
              <DataTableHeadCell>Employees</DataTableHeadCell>
              <DataTableHeadCell>Monthly Cost</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {departments.map((dept) => (
              <DataTableRow key={dept.department}>
                <DataTableCell>{dept.department}</DataTableCell>
                <DataTableCell>{dept.avg}</DataTableCell>
                <DataTableCell>{dept.min}</DataTableCell>
                <DataTableCell>{dept.max}</DataTableCell>
                <DataTableCell>{dept.headcount}</DataTableCell>
                <DataTableCell>{dept.cost}</DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payroll History</h2>
        <div className="space-y-3">
          {payrollHistory.map((item, idx) => (
            <div key={item.month || idx} className="flex items-center justify-between rounded-xl bg-accent p-4">
              <div>
                <h3 className="font-medium">{item.month}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.employees} Employees</p>
              </div>
              <div className="flex items-center gap-4">
                <strong>{item.amount}</strong>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-success/15 text-success">{item.status}</span>
                <button onClick={() => window.print()} className="text-muted-foreground hover:text-foreground">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Payroll;