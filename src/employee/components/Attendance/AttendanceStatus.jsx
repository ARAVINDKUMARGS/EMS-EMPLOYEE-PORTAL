import { useState, useEffect } from "react";
import { Coffee, Clock3 } from "lucide-react";
import { checkIn, checkOut, getToday, updateBreak } from "./services/attendanceService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const employeeId = "EMP001";

function AttendanceStatus({ onAttendanceChange }) {
  const [attendance, setAttendance] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [checkInTime, setCheckInTime] = useState("--");
  const [checkOutTime, setCheckOutTime] = useState("--");
  const [workingHours, setWorkingHours] = useState("--");
  const [isProcessing, setIsProcessing] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function loadAttendance() {

    try {

    const res = await getToday(employeeId);

    if (res.data && res.data.check_in && !res.data.check_out) {

      setCheckedIn(true);
    } else {

      setCheckedIn(false);
    }
    setAttendance(res.data);

    if (res.data) {
      setCheckInTime(res.data.check_in ? new Date(res.data.check_in).toLocaleTimeString() : "--");
      setCheckOutTime(res.data.check_out ? new Date(res.data.check_out).toLocaleTimeString() : "--");
      setBreakSeconds(res.data.break_seconds || 0);
      setWorkingHours(res.data.working_seconds ? formatTime(res.data.working_seconds) : "--");
    } else {
      setCheckInTime("--");
      setCheckOutTime("--");
      setBreakSeconds(0);
      setWorkingHours("--");
    }

  } catch (err) {

    console.log(err);

  }

}

const handleCheckIn = async () => {

  if (isProcessing) return;
  setIsProcessing(true);
  setInfoMessage("");

  console.log("Check In button clicked");

  try{
    const res = await checkIn(employeeId);
    console.log(res.data);

    if (res.data && res.data.message === "Already Checked In Today") {
      setInfoMessage("You've already completed attendance for today.");
    } else {
      setCheckInTime(new Date().toLocaleTimeString());
    }

    loadAttendance();
    onAttendanceChange?.();
  } catch (error) {
    console.error(error);
  } finally {
    setIsProcessing(false);
  }

};

useEffect(() => {

    let timer;

    if (onBreak) {

        timer = setInterval(() => {

            setBreakSeconds(prev => prev + 1);

        },1000);

    }

    return () => clearInterval(timer);

},[onBreak]);

const handleBreak = async () => {
  if (onBreak) {
    try {
      await updateBreak(employeeId, breakSeconds);
      console.log("Break updated:", breakSeconds);
    } catch (err) {
      console.log(err);
    }

  }

  setOnBreak(!onBreak);
};

const formatTime = (seconds) => {

    const hrs = String(Math.floor(seconds / 3600)).padStart(2,"0");

    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2,"0");

    const secs = String(seconds % 60).padStart(2,"0");

    return `${hrs}:${mins}:${secs}`;

};

async function handleCheckOut() {

    if (isProcessing) return;
    setIsProcessing(true);

    console.log("Check Out button clicked");

    try {

      const res = await checkOut(employeeId);
      console.log(res.data);

      setCheckedIn(false);

      setOnBreak(false);

      setCheckOutTime(new Date().toLocaleTimeString());

      loadAttendance();
      onAttendanceChange?.();

    } catch (error) {
      console.error("Check out failed:", error);
    } finally {
      setIsProcessing(false);
    }

}

  const dayCompleted = !!(attendance && attendance.check_in && attendance.check_out);

  return (
    <Card className="flex flex-col items-center p-6 text-center">
      <div className="grid size-24 place-items-center rounded-full bg-primary/10 text-primary">
        <Clock3 size={48} strokeWidth={1.2} />
      </div>

      {/* Status */}
      <div
  className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${
    dayCompleted || checkedIn ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
  }`}
>
  {dayCompleted ? "Completed" : checkedIn ? "Checked In" : "Not Checked In"}
</div>

      {infoMessage && <p className="mt-2 text-xs text-warning">{infoMessage}</p>}

      {/* Date */}
      <p className="mt-3 text-sm text-muted-foreground">{currentDate}</p>

      {/* Buttons */}
      <div className="mt-5 flex w-full gap-3">
        <Button
  className={`flex-1 ${dayCompleted ? "bg-success/15 text-success hover:bg-success/15 disabled:opacity-100" : ""}`}
  variant={checkedIn ? "destructive" : "default"}
  disabled={isProcessing || dayCompleted}
  onClick={checkedIn ? handleCheckOut : handleCheckIn}
>
  {isProcessing ? "..." : dayCompleted ? "Completed for Today" : (checkedIn ? "Check Out" : "Check In")}
</Button>

        <Button variant="outline" disabled={!checkedIn} onClick={handleBreak}>
          <Coffee size={18} />
          {onBreak ? "Resume" : "Break"}
        </Button>
      </div>

      {/* Summary */}
      <div className="mt-6 w-full space-y-2.5 border-t border-border pt-5 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Check In</span>
          <strong className="font-medium">{checkInTime}</strong>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Check Out</span>
          <strong className="font-medium">{checkOutTime}</strong>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Break</span>
          <strong className="font-medium">{formatTime(breakSeconds)}</strong>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Working Hours</span>
          <strong className="font-medium">{workingHours}</strong>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <strong
            className={`font-medium ${
              attendance && attendance.status === "Present" ? "text-success" : "text-destructive"
            }`}
          >
            {attendance && attendance.status ? attendance.status : "Absent"}
          </strong>
        </div>
      </div>
    </Card>
  );
}
export default AttendanceStatus;