"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useLocale } from "@/lib/i18n/locale-context";
import { instruments } from "@/lib/instruments";
import { Archive, ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UnsupportedPage() {
  const { t } = useLocale();

  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10 px-5 py-28 sm:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-full border border-gold/35 bg-gold/10 text-gold shadow-[0_0_60px_rgba(200,169,107,0.25)]">
            <Archive size={34} aria-hidden="true" />
          </div>
          <p className="mt-12 text-xs uppercase tracking-[0.45em] text-gold">
            {t.unsupported.archiveLabel}
          </p>
          <h1 className="font-epic mt-6 text-5xl leading-[0.95] text-foreground sm:text-7xl">
            {t.unsupported.title}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted">
            {t.unsupported.body}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gold/90">
            {t.scan.lowConfidence}
          </p>
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="museum-button px-8 py-3 text-sm uppercase tracking-[0.2em]"
              href="/#scan"
            >
              <Camera size={18} aria-hidden="true" />
              {t.unsupported.retry}
            </Link>
            <Link
              className="museum-button border-white/18 bg-white/[0.04] px-8 py-3 text-sm uppercase tracking-[0.2em]"
              href="/archive"
            >
              {t.unsupported.browse}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-5">
            {instruments.map((inst) => (
              <Link
                key={inst.id}
                href={`/instrument/${inst.id}`}
                className="group relative aspect-square overflow-hidden rounded-sm border border-white/10"
              >
                <Image
                  src={inst.heroImage}
                  alt={inst.name}
                  fill
                  className="object-cover opacity-70 transition group-hover:opacity-100"
                  sizes="120px"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-2 text-xs text-foreground">
                  {inst.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
