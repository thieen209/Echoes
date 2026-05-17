# Echoes

Echoes is an AI-styled interactive cultural instrument archive built with
Next.js, TailwindCSS, Framer Motion, and browser Web Audio.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MVP behavior

- Upload or capture an instrument image.
- Watch a cinematic simulated analysis flow.
- Route to the closest supported archive entry.
- Explore cultural context and play synthesized instrument interactions.

Supported instruments: Dan Bau, Dan Tranh, T'rung, Shamisen, and Sitar.

## Notes

Detection is intentionally mocked for the MVP. It uses filename and metadata
hints first, then a deterministic fallback to one of the supported instruments.
Audio is synthesized with Web Audio so real sample files can be added later
without changing the archive shape.

Instrument images are stored locally under `public/images/instruments` and were
downloaded from Wikimedia Commons source pages linked in the archive UI.
