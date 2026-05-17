"use client";

import { Reveal } from "@/components/motion-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useLocale } from "@/lib/i18n/locale-context";
import { instruments, type Instrument } from "@/lib/instruments";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type RegionEntry = { key: string; match: (item: Instrument) => boolean };

const regionMatchers: RegionEntry[] = [
  {
    key: "southeastAsia",
    match: (item) =>
      ["Vietnam"].includes(item.originCountry) && item.id !== "shamisen",
  },
  { key: "eastAsia", match: (item) => item.originCountry === "Japan" },
  { key: "southAsia", match: (item) => item.originCountry === "India" },
];

export default function ArchivePage() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | "all">("all");

  const regionLabels: Record<string, string> = {
    southeastAsia: t.archive.southeastAsia,
    eastAsia: t.archive.eastAsia,
    southAsia: t.archive.southAsia,
  };

  const filtered = useMemo(() => {
    return instruments.filter((item) => {
      const haystack = `${item.name} ${item.originCountry} ${item.summary}`.toLowerCase();
      const matchesQuery = query.trim() ? haystack.includes(query.toLowerCase()) : true;
      const regionRule = regionMatchers.find((entry) => entry.key === region);
      const matchesRegion =
        region === "all" ? true : regionRule ? regionRule.match(item) : true;
      return matchesQuery && matchesRegion;
    });
  }, [query, region]);

  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10">
        <section className="relative overflow-hidden px-5 pb-16 pt-36 sm:px-8 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(200,169,107,0.14),transparent_45%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs uppercase tracking-[0.45em] text-gold">
              {t.archive.kicker}
            </p>
            <h1 className="font-epic mt-6 max-w-4xl text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              {t.archive.headline}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
              {t.archive.body}
            </p>
            <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative flex w-full max-w-xl items-center">
                <Search
                  className="pointer-events-none absolute left-4 text-muted"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.archive.searchPlaceholder}
                  className="w-full rounded-full border border-white/12 bg-background/70 py-3 pl-12 pr-5 text-sm text-foreground outline-none ring-gold/40 transition focus:border-gold/55 focus:ring-2"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRegion("all")}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                    region === "all"
                      ? "border-gold/70 bg-gold/15 text-foreground"
                      : "border-white/12 bg-white/[0.03] text-muted hover:border-gold/40 hover:text-foreground"
                  }`}
                >
                  {t.archive.allRegions}
                </button>
                {regionMatchers.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => setRegion(entry.key)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                      region === entry.key
                        ? "border-gold/70 bg-gold/15 text-foreground"
                        : "border-white/12 bg-white/[0.03] text-muted hover:border-gold/40 hover:text-foreground"
                    }`}
                  >
                    {regionLabels[entry.key]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 pb-28 sm:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((instrument, index) => (
              <Reveal key={instrument.id} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <Link
                    className="group relative block overflow-hidden rounded-sm border border-white/10 bg-surface/40 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                    href={`/instrument/${instrument.id}`}
                  >
                    <div className="relative aspect-[16/11]">
                      <Image
                        src={instrument.heroImage}
                        alt={instrument.name}
                        fill
                        className="object-cover transition duration-1000 group-hover:scale-105"
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="image-vignette opacity-80 transition group-hover:opacity-60" />
                      <div className="absolute inset-0 translate-y-6 bg-gradient-to-t from-background via-background/55 to-transparent opacity-90 transition group-hover:translate-y-0" />
                      <div className="absolute inset-x-6 bottom-6">
                        <p className="text-xs uppercase tracking-[0.35em] text-gold">
                          {instrument.originCountry}
                        </p>
                        <p className="font-display mt-3 text-3xl text-foreground">
                          {instrument.name}
                        </p>
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
                          {instrument.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="mx-auto mt-16 max-w-xl text-center text-muted">
              {t.archive.noResults}
            </p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
