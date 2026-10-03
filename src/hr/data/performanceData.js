import {
  ClipboardList,
  CheckCircle2,
  Star,
  CalendarDays,
} from "lucide-react";

export const statCards = [
  {
    title: "Reviews Pending",
    value: "18",
    subtitle: "Awaiting Review",
    icon: ClipboardList,
    iconColor: "#F59E0B",
    iconBg: "#3F2A0C",
  },
  {
    title: "Completed Reviews",
    value: "124",
    subtitle: "Current Cycle",
    icon: CheckCircle2,
    iconColor: "#22C55E",
    iconBg: "#143D2B",
  },
  {
    title: "Avg Rating",
    value: "4.8",
    subtitle: "Excellent",
    icon: Star,
    iconColor: "#FACC15",
    iconBg: "#443F12",
  },
  {
    title: "Next Cycle",
    value: "28 Jul",
    subtitle: "Quarterly Review",
    icon: CalendarDays,
    iconColor: "#A855F7",
    iconBg: "#31204D",
  },
];
export const departmentRatings = [
  {
    department: "HR",
    rating: 4.8,
  },
  {
    department: "IT",
    rating: 4.5,
  },
  {
    department: "Finance",
    rating: 4.6,
  },
  {
    department: "Sales",
    rating: 4.2,
  },
  {
    department: "Marketing",
    rating: 4.1,
  },
];
export const recentReviews = [
  {
    id: 1,
    employee: "Aravind Kumar",
    department: "IT",
    reviewer: "Priya Sharma",
    rating: 4.8,
    status: "Completed",
    date: "18 Jul",
  },
  {
    id: 2,
    employee: "Pooja",
    department: "HR",
    reviewer: "Rahul Verma",
    rating: 4.5,
    status: "Pending",
    date: "19 Jul",
  },
  {
    id: 3,
    employee: "Sneha",
    department: "Finance",
    reviewer: "John David",
    rating: 4.7,
    status: "Completed",
    date: "20 Jul",
  },
  {
    id: 4,
    employee: "Kiran",
    department: "Sales",
    reviewer: "Anjali",
    rating: 4.3,
    status: "Completed",
    date: "21 Jul",
  },
];