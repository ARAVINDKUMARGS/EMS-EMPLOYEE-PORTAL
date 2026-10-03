import { useState } from "react";
import ReportTabs from "../components/analytics/ReportTabs";
import ExportMenu from "../components/ExportMenu";

import { reports } from "../data/reportsData";

import { exportPDF } from "../utils/exportPDF";
import { exportExcel } from "../utils/exportExcel";
import { exportCSV } from "../utils/exportCSV";

function Reports() {
  const [activeTab, setActiveTab] = useState("Headcount");

  const currentReport = reports[activeTab];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Reports & Analytics
          </h1>

          <p className="text-muted-foreground mt-2">
            Interactive data reports across all modules
          </p>
        </div>

        <ExportMenu
          onPDF={() =>
            exportPDF(activeTab, currentReport.lineChart)
          }
          onExcel={() =>
            exportExcel(activeTab, currentReport.lineChart)
          }
          onCSV={() =>
            exportCSV(activeTab, currentReport.lineChart)
          }
          onPrint={() => window.print()}
        />
      </div>

      <ReportTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default Reports;