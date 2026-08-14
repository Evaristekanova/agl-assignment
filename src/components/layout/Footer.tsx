import NextLink from "next/link";
import type { SiteData } from "@/types";

/** Dark footer: link columns + contact block, all driven by site.json. */
export function Footer({ site }: { site: SiteData }) {
  const { columns, contact, legal } = site.footer;
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-base font-semibold text-white">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((item) => (
                <li key={item.text}>
                  <NextLink
                    href={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.text}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <p className="text-base font-semibold text-white">{contact.title}</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <PinIcon />
              <span className="max-w-56 rounded-md border border-slate-600 px-2.5 py-1.5 text-xs leading-5">
                {contact.address}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon />
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="transition hover:text-white">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon />
              <a href={`mailto:${contact.email}`} className="transition hover:text-white">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
          {legal}
        </p>
      </div>
    </footer>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-1 shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3A19.5 19.5 0 0 1 5.1 13 19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}
