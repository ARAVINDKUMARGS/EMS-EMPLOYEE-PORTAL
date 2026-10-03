import * as React from "react"

import { cn } from "@/lib/utils"

function DataTable({ className, children, ...props }) {
  return (
    <div
      data-slot="data-table-wrapper"
      className={cn("w-full overflow-x-auto rounded-xl border border-border", className)}
      {...props}>
      <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
    </div>
  );
}

function DataTableHead({ className, ...props }) {
  return (
    <thead
      data-slot="data-table-head"
      className={cn("bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground", className)}
      {...props} />
  );
}

function DataTableRow({ className, ...props }) {
  return (
    <tr
      data-slot="data-table-row"
      className={cn("border-b border-border last:border-0", className)}
      {...props} />
  );
}

function DataTableHeadCell({ className, ...props }) {
  return (
    <th
      data-slot="data-table-head-cell"
      className={cn("px-4 py-3 font-medium", className)}
      {...props} />
  );
}

function DataTableCell({ className, ...props }) {
  return (
    <td
      data-slot="data-table-cell"
      className={cn("px-4 py-3 text-foreground", className)}
      {...props} />
  );
}

function DataTableBody({ className, ...props }) {
  return <tbody data-slot="data-table-body" className={cn(className)} {...props} />;
}

export {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
}