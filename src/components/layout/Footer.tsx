import NextLink from "next/link";
import type { SiteData } from "@/types";
import { Phone, Mail, MapPin } from "lucide-react";

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
            <li className="flex items-center gap-2.5">
              <MapPin size={16} />
              <span className="max-w-56 rounded-md  px-2.5 py-1.5 underline text-xs leading-5">
                {contact.address}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} />
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="transition hover:text-white"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} />
              <a
                href={`mailto:${contact.email}`}
                className="transition hover:text-white"
              >
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
