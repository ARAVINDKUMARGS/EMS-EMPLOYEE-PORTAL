import * as XLSX from "xlsx";

export function exportExcel(fileName, data) {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}