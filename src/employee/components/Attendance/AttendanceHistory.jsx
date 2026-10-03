import { useState, useEffect } from "react";
import { getHistory } from "./services/attendanceService";

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

function AttendanceHistory({ refreshKey }) {

  const employeeId = "EMP001";
  const [search] = useState("");
  const [attendance, setAttendance] = useState([]);

  const filteredData = attendance.filter(item =>
    item.attendance_date
        ?.toLowerCase()
        .includes(search.toLowerCase())
);

 useEffect(() => {
    async function loadHistory() {
      try {

        const res = await getHistory(employeeId);

        setAttendance(res.data);

      } catch (error) {

        console.error(error);
      }
    };
    loadHistory();
  }, [refreshKey]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="p-5">
        <h2 className="text-base font-semibold">Attendance History</h2>
      </div>

      <DataTable className="rounded-none border-0 border-t">
        <DataTableHead>
          <DataTableRow>
            <DataTableHeadCell>Date</DataTableHeadCell>
            <DataTableHeadCell>Day</DataTableHeadCell>
            <DataTableHeadCell>Check In</DataTableHeadCell>
            <DataTableHeadCell>Check Out</DataTableHeadCell>
            <DataTableHeadCell>Break</DataTableHeadCell>
            <DataTableHeadCell>Hours</DataTableHeadCell>
            <DataTableHeadCell>Status</DataTableHeadCell>
          </DataTableRow>
        </DataTableHead>

        <DataTableBody>
          {filteredData.map((item, index) => (
            <DataTableRow key={index}>
              <DataTableCell>{new Date(item.attendance_date).toLocaleDateString()}</DataTableCell>
              <DataTableCell>{item.day}</DataTableCell>
              <DataTableCell>{item.check_in || "--"}</DataTableCell>
              <DataTableCell>{item.check_out || "--"}</DataTableCell>
              <DataTableCell>{item.break_time || "00:00:00"}</DataTableCell>
              <DataTableCell>{item.working_hours || "00:00:00"}</DataTableCell>
              <DataTableCell>
                <StatusPill status={item.status.toLowerCase()} />
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </Card>
  );

}

export default AttendanceHistory;