import { useState, useCallback } from "react";
import AttendanceStatus from "../components/Attendance/AttendanceStatus";
import AttendanceCalendar from "../components/Attendance/AttendanceCalendar";
import AttendanceHistory from "../components/Attendance/AttendanceHistory";

function Attendance() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleAttendanceChange = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your attendance and working hours
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceStatus onAttendanceChange={handleAttendanceChange} />
        <AttendanceCalendar refreshKey={refreshKey} />
      </div>

      <div className="mt-6">
        <AttendanceHistory refreshKey={refreshKey} />
      </div>
    </div>
  );
}

export default Attendance;