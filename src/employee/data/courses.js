const courses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    category: "Technical",
    status: "in progress",
    instructor: "John Carter",
    duration: "8h total",
    progress: 75,
    description: "Learn advanced React patterns including compound components, render props, custom hooks, and performance optimization techniques used in production applications.",
    modules: [
      { name: "Component Composition", completed: true },
      { name: "Custom Hooks Deep Dive", completed: true },
      { name: "Performance Optimization", completed: true },
      { name: "Advanced State Management", completed: false }
    ]
  },
  {
    id: 2,
    title: "Leadership Fundamentals",
    category: "Soft skills",
    status: "completed",
    instructor: "Emily Watson",
    duration: "4h total",
    progress: 100,
    description: "Develop core leadership skills including communication, delegation, conflict resolution, and team motivation strategies.",
    modules: [
      { name: "Communication Skills", completed: true },
      { name: "Delegation Strategies", completed: true },
      { name: "Conflict Resolution", completed: true },
      { name: "Team Motivation", completed: true }
    ]
  },
  {
    id: 3,
    title: "Security Best Practices",
    category: "Compliance",
    status: "in progress",
    instructor: "David Miller",
    duration: "3h total",
    progress: 30,
    description: "Understand essential security practices for handling company data, password management, and identifying phishing attempts.",
    modules: [
      { name: "Data Handling Policies", completed: true },
      { name: "Password & Access Management", completed: false },
      { name: "Phishing Awareness", completed: false }
    ]
  },
  {
    id: 4,
    title: "Data-Driven Decision Making",
    category: "Analytics",
    status: "not started",
    instructor: "Sophia Brown",
    duration: "6h total",
    progress: 0,
    description: "Learn how to interpret data, build dashboards, and make informed business decisions using analytics tools.",
    modules: [
      { name: "Introduction to Data Analysis", completed: false },
      { name: "Building Dashboards", completed: false },
      { name: "Interpreting Metrics", completed: false }
    ]
  }
];

export default courses;