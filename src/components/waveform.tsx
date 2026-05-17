type WaveformProps = {
  bars?: number;
  className?: string;
};

export function Waveform({ bars = 22, className = "" }: WaveformProps) {
  return (
    <div
      className={`flex h-16 items-end justify-center gap-1.5 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, index) => {
        const height = 28 + ((index * 17) % 58);

        return (
          <span
            className="wave-bar block w-1 rounded-full bg-gold/80"
            key={index}
            style={{
              height,
              animationDelay: `${index * 0.055}s`,
            }}
          />
        );
      })}
    </div>
  );
}
