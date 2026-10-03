import { recentReviews } from "../../data/performanceData";
import { Card } from "@/components/ui/card";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@/components/ui/data-table";
import { StatusPill } from "@/components/common/StatusPill";

const RecentReviews = () => {
  return (
    <Card className="overflow-hidden p-5">
      <h2 className="text-base font-semibold">Recent Reviews</h2>
      <p className="text-sm text-muted-foreground">Latest employee performance reviews</p>

      <DataTable className="mt-4 border-0">
        <DataTableHead>
          <DataTableRow>
            <DataTableHeadCell>Employee</DataTableHeadCell>
            <DataTableHeadCell>Department</DataTableHeadCell>
            <DataTableHeadCell>Reviewer</DataTableHeadCell>
            <DataTableHeadCell>Rating</DataTableHeadCell>
            <DataTableHeadCell>Status</DataTableHeadCell>
            <DataTableHeadCell>Date</DataTableHeadCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {recentReviews.map((review) => (
            <DataTableRow key={review.id}>
              <DataTableCell>{review.employee}</DataTableCell>
              <DataTableCell>{review.department}</DataTableCell>
              <DataTableCell>{review.reviewer}</DataTableCell>
              <DataTableCell>⭐ {review.rating}</DataTableCell>
              <DataTableCell>
                <StatusPill status={review.status.toLowerCase()} />
              </DataTableCell>
              <DataTableCell>{review.date}</DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </Card>
  );
};

export default RecentReviews;