import * as React from "react"

import { cn } from "@/lib/utils"

function EmptyState({ icon, title, description, action, className, ...props }) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-10 text-center",
        className
      )}
      {...props}>
      {icon && (
        <div className="mb-1 grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyState }