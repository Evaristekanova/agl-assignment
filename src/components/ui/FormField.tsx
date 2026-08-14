import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  /** Shows the red asterisk. Pair it with `required` on the control itself. */
  required?: boolean;
  error?: string;
  children: ReactNode;
}

/**
 * Label + control + error message wiring for one form field. The error
 * paragraph gets the `${id}-error` id so controls can point their
 * aria-describedby at it. The asterisk is decorative (aria-hidden) —
 * assistive tech learns the field is required from the control's own
 * `required` attribute.
 */
export function FormField({
  id,
  label,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-slate-700">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
