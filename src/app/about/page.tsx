"use client";

import { Reveal } from "@/components/motion-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useLocale } from "@/lib/i18n/locale-context";
import { ArrowRight, Orbit, Users, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10">
        <section className="relative min-h-[78vh] overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pt-40">
          <Image
            src="/images/instruments/shamisen.jpg"
            alt=""
            fill
            className="object-cover opacity-35"
            sizes="100vw"
            priority
          />
          <div className="image-vignette" />
          <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gold">
              <Orbit size={16} aria-hidden="true" />
              {t.mission.kicker}
            </p>
            <h1 className="font-epic mt-8 max-w-5xl text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-7xl">
              {t.mission.headline}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-24 px-5 py-24 sm:px-8">
          <Reveal>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <p className="font-display text-4xl leading-snug text-foreground sm:text-5xl">
                {t.mission.treatEvery}
              </p>
              <div className="space-y-6 text-lg leading-9 text-muted">
                <p>{t.mission.museumFreeze}</p>
                <p>{t.mission.studentCorridor}</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="relative overflow-hidden rounded-sm border border-white/10">
              <div className="relative aspect-[21/9]">
                <Image
                  src="/images/instruments/dan-tranh.jpg"
                  alt=""
                  fill
                  className="object-cover opacity-60"
                  sizes="100vw"
                />
                <div className="image-vignette" />
              </div>
              <div className="grid grid-cols-1 gap-10 bg-surface/70 p-10 lg:grid-cols-2">
                <div>
                  <h2 className="font-display text-4xl text-foreground">
                    {t.mission.forgottenSounds}
                  </h2>
                  <p className="mt-6 text-base leading-8 text-muted">
                    {t.mission.forgottenBody}
                  </p>
                </div>
                <div className="space-y-5 text-base leading-8 text-muted">
                  <p>{t.mission.interfaceBorrows}</p>
                  <Link
                    className="museum-button inline-flex px-6 py-3 text-sm uppercase tracking-[0.2em]"
                    href="/upload"
                  >
                    {t.mission.offerImage}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Team Section ── */}
        <section id="team" className="border-t border-white/10 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gold">
                <Users size={16} aria-hidden="true" />
                {t.team.kicker}
              </p>
              <h2 className="font-display mt-6 text-4xl text-foreground sm:text-5xl">
                {t.team.headline}
              </h2>
            </Reveal>
            
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {t.team.members.map((member, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-8 transition hover:bg-white/[0.04]">
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <span className="font-display text-xl">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground">{member.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-widest text-gold/80">{member.role}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{member.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section id="faq" className="border-t border-white/10 py-24 sm:py-32 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,0.05),transparent_50%)]">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <Reveal>
              <div className="text-center">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-gold">
                  <HelpCircle size={16} aria-hidden="true" />
                  {t.faq.kicker}
                </p>
                <h2 className="font-display mt-6 text-4xl text-foreground sm:text-5xl">
                  {t.faq.headline}
                </h2>
              </div>
            </Reveal>

            <div className="mt-16 space-y-6">
              {t.faq.items.map((item, index) => (
                <Reveal key={index} delay={index * 0.05}>
                  <div className="rounded-lg border border-white/10 bg-black/40 p-6 sm:p-8">
                    <h3 className="text-lg font-medium text-foreground">{item.q}</h3>
                    <p className="mt-4 text-muted leading-relaxed">{item.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
