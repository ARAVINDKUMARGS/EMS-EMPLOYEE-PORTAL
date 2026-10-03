const payrollData = {
  payslip: {
    month: "June 2024",
    earnings: [
      { label: "Base Salary", amount: 10416.67 },
      { label: "Performance Bonus", amount: 500.00 },
      { label: "Overtime Pay", amount: 83.33 },
    ],
    grossTotal: 11000.00,
    deductions: [
      { label: "Federal Tax", amount: -1430.00 },
      { label: "State Tax", amount: -385.00 },
      { label: "Social Security", amount: -220.00 },
      { label: "Health Insurance", amount: -165.00 },
    ],
    totalDeductions: -2200.00,
    netPay: 8800.00,
    paidOn: "Jul 1, 2024",
  },

  ytdSummary: {
    grossEarned: 66832,
    totalDeductions: -13200,
    netReceived: 53632,
    taxesPaid: 11550,
  },

  pastPayslips: [
    { month: "May 2024" },
    { month: "Apr 2024" },
    { month: "Mar 2024" },
  ],

  netPayTrend: [
    { month: "Feb", gross: 10800, net: 8600 },
    { month: "Mar", gross: 10900, net: 8650 },
    { month: "Apr", gross: 10950, net: 8700 },
    { month: "May", gross: 11000, net: 8750 },
    { month: "Jun", gross: 11000, net: 8800 },
    { month: "Jul", gross: 11000, net: 8800 },
  ],
};

export default payrollData;