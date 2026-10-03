import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function ExportMenu({
  onPDF,
  onExcel,
  onCSV,
  onPrint,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <Button variant="outline" onClick={() => setOpen(!open)}>
        <Download size={18} />
        Export
      </Button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-xl shadow-xl z-50">

          <button
            onClick={() => {
              onPDF();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-foreground"
          >
            <FileText size={18} />
            Export as PDF
          </button>

          <button
            onClick={() => {
              onExcel();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-foreground"
          >
            <FileSpreadsheet size={18} />
            Export as Excel
          </button>

          <button
            onClick={() => {
              onCSV();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-foreground"
          >
            <File size={18} />
            Export as CSV
          </button>

          <button
            onClick={() => {
              onPrint();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-foreground"
          >
            <Printer size={18} />
            Print Report
          </button>

        </div>
      )}

    </div>
  );
}

export default ExportMenu;