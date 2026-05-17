"use client";

import { InstrumentHero } from "@/components/instrument-hero";
import { PlayableInstrument } from "@/components/playable-instrument";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  getInstrument,
  getRelatedInstruments,
  type Instrument,
} from "@/lib/instruments";
import { ArrowLeft, Clock3, Globe2, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

function InstrumentContent({ instrument }: { instrument: Instrument }) {
  const { t } = useLocale();
  const relatedInstruments = useMemo(
    () => getRelatedInstruments(instrument),
    [instrument],
  );

  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10">
        <InstrumentHero instrument={instrument} />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-8">
          <Link
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
            href="/archive"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t.instrument.backToArchive}
          </Link>
        </div>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.95fr_0.78fr] lg:gap-12">
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="museum-card relative overflow-hidden p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
                <Globe2 className="relative text-gold" size={22} aria-hidden="true" />
                <p className="relative mt-6 text-xs uppercase tracking-[0.3em] text-muted">
                  {t.instrument.origin}
                </p>
                <p className="relative mt-3 font-display text-2xl text-foreground">
                  {instrument.originCountry}
                </p>
              </div>
              <div className="museum-card relative overflow-hidden p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sage/15 to-transparent" />
                <Clock3 className="relative text-gold" size={22} aria-hidden="true" />
                <p className="relative mt-6 text-xs uppercase tracking-[0.3em] text-muted">
                  {t.instrument.era}
                </p>
                <p className="relative mt-3 font-display text-xl leading-8 text-foreground">
                  {instrument.era}
                </p>
              </div>
            </div>

            <article className="museum-card relative overflow-hidden p-6 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(200,169,107,0.12),transparent_55%)]" />
              <p className="relative text-xs uppercase tracking-[0.35em] text-gold">
                {t.instrument.culturalBackground}
              </p>
              <h2 className="font-epic relative mt-5 max-w-3xl text-4xl leading-tight text-foreground sm:text-5xl">
                {t.instrument.livingObject}
              </h2>
              <p className="relative mt-8 text-lg leading-9 text-muted">
                {instrument.history}
              </p>
            </article>

            <section className="museum-card p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                {t.instrument.relatedInstruments}
              </p>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {relatedInstruments.map((related) => (
                  <Link
                    className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition hover:border-gold/55 hover:bg-gold/10"
                    href={`/instrument/${related.id}`}
                    key={related.id}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={related.heroImage}
                        alt={related.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 18vw, 100vw"
                      />
                      <div className="image-vignette opacity-70" />
                    </div>
                    <div className="p-4">
                      <p className="font-display text-xl text-foreground">
                        {related.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {related.originCountry}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <LinkIcon size={15} aria-hidden="true" />
              {t.instrument.imageSource}:
              <a
                className="text-gold underline decoration-gold/35 underline-offset-4"
                href={instrument.imageCredit.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {instrument.imageCredit.title}
              </a>
              <span>({instrument.imageCredit.license})</span>
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <PlayableInstrument instrument={instrument} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function InstrumentPage() {
  const { locale } = useLocale();
  const params = useParams();
  const slug = params?.slug as string;
  const instrument = getInstrument(slug);

  if (!instrument) {
    return (
      <div className="museum-shell">
        <SiteNav />
        <main className="relative z-10 flex min-h-[60vh] items-center justify-center">
          <p className="text-muted">
            {"Không tìm thấy nhạc cụ."}
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return <InstrumentContent instrument={instrument} />;
}
