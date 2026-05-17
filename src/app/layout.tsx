import { Providers } from "@/components/providers";
import { RootEffects } from "@/components/root-effects";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Echoes | Playable Cultural Archive",
  description:
    "Upload a traditional instrument image and explore its sound, story, and cultural legacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${manrope.variable} ${playfair.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <RootEffects />
          {children}
        </Providers>
      </body>
    </html>
  );
}
