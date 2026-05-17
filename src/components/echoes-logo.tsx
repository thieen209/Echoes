import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const LOGO_MARK = "/images/echoes-logo-mark.png";
const LOGO_HORIZONTAL = "/images/echoes-logo-mark.png";
const LOGO_ASPECT_RATIO = 680 / 520;

type EchoesLogoProps = {
  href?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
  size?: number;
  priority?: boolean;
  variant?: "mark" | "horizontal";
};

export function EchoesLogo({
  href = "/",
  showWordmark = false,
  wordmarkClassName = "",
  className = "",
  size = 44,
  priority = false,
  variant = "mark",
}: EchoesLogoProps) {
  const src = variant === "horizontal" ? LOGO_HORIZONTAL : LOGO_MARK;
  const width = Math.round(size * LOGO_ASPECT_RATIO);
  const height = size;

  const inner: ReactNode = (
    <>
      <span className="relative shrink-0">
        <Image
          src={src}
          alt="Echoes"
          width={width}
          height={height}
          className={
            variant === "horizontal"
              ? "object-contain object-left"
              : "object-contain"
          }
          style={{
            height: size,
            width,
            filter: "drop-shadow(0 0 24px rgba(200,169,107,0.22))",
          }}
          priority={priority}
        />
      </span>
      {showWordmark ? (
        <span className={`min-w-0 ${wordmarkClassName}`}>
          <span className="font-display block truncate text-lg leading-none tracking-tight text-foreground sm:text-xl">
            Echoes
          </span>
          <span className="mt-1 block truncate text-[0.65rem] uppercase tracking-[0.28em] text-muted">
            Interactive cultural archive
          </span>
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 outline-none transition hover:opacity-95 ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return <span className={`flex items-center gap-3 ${className}`}>{inner}</span>;
}

export function EchoesLogoMark({
  size = 120,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={LOGO_MARK}
        alt="Echoes"
        width={Math.round(size * LOGO_ASPECT_RATIO)}
        height={size}
        className="h-auto object-contain drop-shadow-[0_0_48px_rgba(200,169,107,0.35)]"
        priority={priority}
      />
    </div>
  );
}

