"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { Reveal } from "@/components/motion-reveal";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    id: "archive",
    name: "Premium Archive Access",
    price: "$12",
    cadence: "per month",
    blurb: "High-resolution instrument plates, extended cultural essays, and priority scan queue (simulated).",
    perks: ["Deep-dive dossiers", "Curator commentary track", "Offline reading pack"],
  },
  {
    id: "museum",
    name: "Museum Pass",
    price: "$28",
    cadence: "per season",
    blurb: "Everything in Archive, plus guided listening paths and a cinematic after-hours mode.",
    perks: ["Seasonal exhibitions", "Night-mode lighting", "Shared playlists"],
  },
  {
    id: "early",
    name: "Early Access Archive",
    price: "$48",
    cadence: "founding tier",
    blurb: "Name inscribed in the demo credits wall and first access to new instruments as they arrive.",
    perks: ["Instrument requests", "Field recording previews", "Studio roundtables"],
  },
] as const;

export function PremiumExperience() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<(typeof plans)[number] | null>(null);

  return (
    <div className="museum-shell">
      <SiteNav />
      <main className="relative z-10">
        <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(200,169,107,0.2),transparent_55%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="text-xs uppercase tracking-[0.45em] text-gold">
              Patron layer (demo)
            </p>
            <h1 className="font-epic mt-6 max-w-4xl text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              Fund the fiction of a living archive.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
              No charges are processed. This page exists to make Echoes feel
              like a complete cultural platform — complete with passes, perks,
              and a checkout ritual.
            </p>
          </div>
        </section>

        <section className="px-5 pb-32 sm:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 0.06}>
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-sm border bg-surface/50 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] ${
                    plan.id === "museum"
                      ? "border-gold/60 shadow-[0_40px_120px_rgba(200,169,107,0.18)]"
                      : "border-white/10"
                  }`}
                >
                  {plan.id === "museum" ? (
                    <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-gold">
                      <Sparkles size={13} aria-hidden="true" />
                      Most cinematic
                    </div>
                  ) : null}
                  <p className="text-xs uppercase tracking-[0.35em] text-muted">
                    {plan.cadence}
                  </p>
                  <h2 className="font-display mt-4 text-3xl text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">{plan.blurb}</p>
                  <p className="mt-8 font-epic text-5xl text-foreground">
                    {plan.price}
                  </p>
                  <ul className="mt-8 space-y-3 text-sm text-muted">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-3">
                        <span className="grid size-6 place-items-center rounded-full border border-gold/35 text-gold">
                          <Check size={14} aria-hidden="true" />
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="museum-button mt-10 w-full justify-center py-3 text-sm uppercase tracking-[0.22em]"
                    onClick={() => {
                      setChoice(plan);
                      setOpen(true);
                    }}
                  >
                    Select {plan.name}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-16 max-w-2xl text-center text-sm leading-7 text-muted">
            Ready to keep wandering without a pass?{" "}
            <Link className="text-gold underline-offset-4 hover:underline" href="/">
              Return to the main hall
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />

      <AnimatePresence>
        {open && choice ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              className="relative w-full max-w-lg overflow-hidden rounded-md border border-white/15 bg-background/95 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-muted transition hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close checkout"
              >
                <X size={18} />
              </button>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">
                Cinematic checkout (fake)
              </p>
              <h3 id="checkout-title" className="font-display mt-4 text-3xl text-foreground">
                {choice.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                Echoes will pretend to authorize a card, send a receipt to the
                void, and unlock purely cosmetic badges in a future build.
              </p>
              <div className="mt-8 space-y-4">
                <input
                  className="w-full rounded-md border border-white/12 bg-black/30 px-4 py-3 text-sm text-foreground outline-none ring-gold/30 focus:border-gold/55 focus:ring-2"
                  placeholder="Name on card"
                />
                <input
                  className="w-full rounded-md border border-white/12 bg-black/30 px-4 py-3 text-sm text-foreground outline-none ring-gold/30 focus:border-gold/55 focus:ring-2"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <button
                type="button"
                className="museum-button mt-8 w-full justify-center py-3 text-sm uppercase tracking-[0.25em]"
                onClick={() => setOpen(false)}
              >
                Complete imaginary payment
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
