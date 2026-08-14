import type { ComponentPropsWithRef } from "react";
import { FormField } from "./FormField";
import { controlClasses } from "./control-classes";

interface InputProps extends ComponentPropsWithRef<"input"> {
  id: string;
  label: string;
  error?: string;
}

/**
 * Complete form row: label, input and error message in one component.
 * The red asterisk and all aria wiring are derived from the single
 * `id`/`label`/`error`/`required` set, so they can never drift apart.
 */
export function Input({ id, label, error, required, className, ...props }: InputProps) {
  return (
    <FormField id={id} label={label} required={!!required} error={error}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses(!!error)} ${className ?? ""}`}
        {...props}
      />
    </FormField>
  );
}
