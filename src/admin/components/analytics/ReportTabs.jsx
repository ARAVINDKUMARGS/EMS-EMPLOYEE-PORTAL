import { reports } from "../../data/reportsData";
import ReportLineChart from "./ReportLineChart";
import ReportPieChart from "./ReportPieChart";

function ReportTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Headcount",
    "Payroll",
    "Attendance",
    "Leave",
    "Performance",
  ];

  const currentReport = reports[activeTab];

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="border-b border-slate-700 mb-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-medium transition ${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ReportLineChart
          title={currentReport.title}
          data={currentReport.lineChart}
        />

        <ReportPieChart
          data={currentReport.pieChart}
        />
      </div>
    </div>
  );
}

export default ReportTabs;