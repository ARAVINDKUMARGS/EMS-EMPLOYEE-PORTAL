import PerformanceHeader from "../components/PerformanceHeader/PerformanceHeader";
import PerformanceCards from "../components/PerformanceCards/PerformanceCards";
import DepartmentChart from "../components/DepartmentChart/DepartmentChart";
import RecentReviews from "../components/RecentReviews/RecentReviews";

const Performance = () => {
  return (
    <div className="space-y-6">
      <PerformanceHeader />
      <PerformanceCards />
      <DepartmentChart />
      <RecentReviews />
    </div>
  );
};
export default Performance;