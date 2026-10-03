import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPDF(fileName, data) {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text(fileName, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [Object.keys(data[0])],
    body: data.map((row) => Object.values(row)),
  });

  doc.save(`${fileName}.pdf`);
}
