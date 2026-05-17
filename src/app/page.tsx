"use client";

import { CinematicHome } from "@/components/cinematic-home";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Reveal } from "@/components/motion-reveal";
import { useLocale } from "@/lib/i18n/locale-context";
import Link from "next/link";

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative">
        <CinematicHome />
        <section className="relative z-10 border-t border-white/10 px-5 py-28 sm:px-8">
          <Reveal className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gold">
                  {t.mission.kicker}
                </p>
                <h2 className="font-epic mt-6 text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
                  {t.mission.preservationReunion}
                </h2>
              </div>
              <div className="max-w-xl text-lg leading-9 text-muted">
                <p>{t.mission.preservationBody}</p>
                <Link
                  className="museum-button mt-8 inline-flex border-white/15 bg-white/[0.04] px-6 py-3 text-sm uppercase tracking-[0.2em]"
                  href="/about"
                >
                  {t.mission.readMission}
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
