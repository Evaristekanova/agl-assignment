import type { ComponentPropsWithRef } from "react";
import { FormField } from "./FormField";
import { controlClasses } from "./control-classes";

interface TextareaProps extends ComponentPropsWithRef<"textarea"> {
  id: string;
  label: string;
  error?: string;
}

/** Complete multi-line form row — see Input for the rationale. */
export function Textarea({ id, label, error, required, className, ...props }: TextareaProps) {
  return (
    <FormField id={id} label={label} required={!!required} error={error}>
      <textarea
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
