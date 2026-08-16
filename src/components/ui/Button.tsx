import type { ComponentPropsWithRef } from "react";

const variants = {
  /** Brand pink pill — the default site-wide call-to-action look. */
  brand:
    "rounded-full bg-brand font-semibold text-white hover:bg-brand-dark focus-visible:ring-brand",
  /** Navy rectangle — the contact form's submit style. */
  navy: "rounded-md bg-navy font-semibold text-white hover:bg-navy-dark focus-visible:ring-navy",
  /** Dark pill on colored backgrounds — the newsletter's submit style. */
  ink: "rounded-full bg-ink font-semibold text-white hover:bg-black focus-visible:ring-white",
  /** Underlined text button; inherits color — set it via className at the call site. */
  link: "font-medium underline focus-visible:ring-current",
  /** Borderless icon/utility button on light backgrounds (e.g. the menu toggle). */
  ghost: "rounded-md text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
  /** Filter chip, unselected state. Pair with `chipActive` via aria-pressed. */
  chip: "rounded-full border border-slate-300 bg-white font-medium text-slate-700 hover:border-accent hover:text-accent focus-visible:ring-accent",
  /** Filter chip, selected state. */
  chipActive:
    "rounded-full bg-accent font-medium text-white shadow-sm focus-visible:ring-accent",
};

const sizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  /** No padding — for link-style buttons that sit in running text. */
  bare: "",
  /** Square padding for icon-only buttons. */
  icon: "p-2",
};

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

/**
 * The one button. Every button in the app renders through this, so a
 * change to the button character (radius, weight, focus ring, disabled
 * look) happens here once. Icon children lay out via the inline-flex gap.
 */
export function Button({
  variant = "brand",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
