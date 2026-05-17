"use client";

import { EchoesLogo } from "@/components/echoes-logo";
import { useLocale } from "@/lib/i18n/locale-context";
import Link from "next/link";

export function SiteFooter() {
  const { t } = useLocale();

  const links = [
    { href: "/archive", label: t.footer.archive },
    { href: "/about", label: t.footer.mission },
    { href: "/upload", label: t.footer.identify },
    { href: "/auth/sign-in", label: t.footer.signIn },
  ];

  return (
    <footer className="relative z-10 mt-24 border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(200,169,107,0.12),transparent_45%),radial-gradient(circle_at_90%_30%,rgba(110,59,50,0.14),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <EchoesLogo showWordmark priority={false} />
            <p className="mt-8 max-w-xl text-lg leading-9 text-muted">
              {t.footer.description}
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.35em] text-gold/80">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {t.footer.navigate}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/90">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    className="transition hover:text-gold"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hairline mt-16 opacity-50" />
        <div className="mt-8 text-sm text-muted">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
