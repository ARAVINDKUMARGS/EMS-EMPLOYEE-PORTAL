import * as React from "react"

import { cn } from "@/lib/utils"

function Field({ className, ...props }) {
  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props} />
  );
}

function FieldLabel({ className, ...props }) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props} />
  );
}

function FieldError({ className, children, ...props }) {
  if (!children) return null;
  return (
    <p
      data-slot="field-error"
      className={cn("text-xs text-destructive", className)}
      {...props}>
      {children}
    </p>
  );
}

function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props} />
  );
}

export { Field, FieldLabel, FieldError, FieldDescription }