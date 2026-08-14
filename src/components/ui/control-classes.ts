/** Shared styling for form controls (Input, Textarea). */
export function controlClasses(hasError: boolean): string {
  return `w-full rounded-md border bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-slate-300 focus:border-brand focus:ring-brand-soft"
  }`;
}
