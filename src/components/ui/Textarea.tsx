import type { ComponentPropsWithRef } from "react";
import { controlClasses } from "./control-classes";

interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  hasError?: boolean;
}

/** Multi-line input with the shared control styling and error state. */
export function Textarea({ hasError = false, className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={hasError || undefined}
      className={`${controlClasses(hasError)} ${className ?? ""}`}
    />
  );
}
