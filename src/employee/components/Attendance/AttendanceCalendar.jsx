import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendar } from "./services/attendanceService";

import { Card } from "@/components/ui/card";

const statusStyles = {
  present: "bg-success/[0.18] border-success/40",
  absent: "bg-destructive/[0.18] border-destructive/40",
  late: "bg-warning/[0.18] border-warning/40",
};

const dotStyles = {
  present: "bg-success",
  absent: "bg-destructive",
  late: "bg-warning",
};

function AttendanceCalendar({ refreshKey }) {

  const employeeId = "EMP001";
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(today);
  const [calendarData, setCalendarData] = useState([]);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  useEffect(() => {
    async function loadCalendar() {
      try {
        const res = await getCalendar(employeeId,month + 1,year);

        setCalendarData(res.data);

      } catch (err) {

        console.error("Calendar API Error", err);

      }
    };
    loadCalendar();
  }, [month, year, refreshKey]);

  // -----------Convert DB rows to lookup-----------

  const attendanceMap = useMemo(() => {

    const map = {};
    calendarData.forEach((item) => {

      map[item.day] = item.status.toLowerCase();

    });
    return map;

  }, [calendarData]);


  // ----------Calendar calculations-----------

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const cells = useMemo(() => {
    const arr = [];

    // Blank cells
    for (let i = 0; i < firstDay; i++) {
      arr.push(null);
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
      arr.push({day, status: attendanceMap[day] || ""});
    }
    return arr;

  }, [firstDay, totalDays, attendanceMap]);

  // ------------Month Navigation-------------

  function previousMonth() {

    setCurrentDate(
      new Date(year, month - 1, 1)
    );

  }

  function nextMonth() {

    setCurrentDate(
      new Date(year, month + 1, 1)
    );

  }

  return (

    <Card className="p-5">

      {/* Header */}

      <div className="flex items-center justify-between text-sm font-medium">

        <button
          className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={previousMonth}
        >
          <ChevronLeft size={14} />
        </button>

        <span>{monthName} {year}</span>

        <button
          className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={nextMonth}
        >
          <ChevronRight size={14} />
        </button>

      </div>

      {/* Calendar */}

      <div className="mt-4">

        {/* Weekday header */}

        <div className="grid grid-cols-7 gap-1.5">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="pb-1 text-center text-xs text-muted-foreground">{d}</div>
          ))}
        </div>

        {/* Dates */}

        <div className="grid grid-cols-7 gap-1.5">

          {cells.map((cell, index) => {

            if (!cell) return <div key={index} className="aspect-square" />;

            const cellDate = new Date(year, month, cell.day);

            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);

            const isToday =cellDate.getTime() === todayDate.getTime();
            const isFuture = cellDate > todayDate;

            return (

              <div
                key={index}
                className={`grid aspect-square place-items-center rounded-lg border text-xs
                ${statusStyles[cell.status] || "border-border bg-transparent"}
                ${isToday ? "!border-primary !bg-primary text-primary-foreground" : ""}
                ${isFuture ? "opacity-35" : ""}
                `}>

                <span>
                  {cell.day}
                </span>

              </div>
            );
          })}

        </div>

      </div>

      {/* Legend */}

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">

        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${dotStyles.present}`}></span>
          Present
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${dotStyles.absent}`}></span>
          Absent
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${dotStyles.late}`}></span>
          Late
        </div>

      </div>

    </Card>

  );

}

export default AttendanceCalendar;