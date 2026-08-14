import type { ComponentPropsWithRef } from "react";
import { controlClasses } from "./control-classes";

interface InputProps extends ComponentPropsWithRef<"input"> {
  hasError?: boolean;
}

/** Text input with the shared control styling and error state. */
export function Input({ hasError = false, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={hasError || undefined}
      className={`${controlClasses(hasError)} ${className ?? ""}`}
    />
  );
}
