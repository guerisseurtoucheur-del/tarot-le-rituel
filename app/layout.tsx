import type { Metadata, Viewport } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Le Rituel du Tarot de Grimaud",
  description:
    "Consultez les 22 arcanes majeurs du Tarot de Grimaud dans une experience mystique immersive.",
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={cinzel.className}>{children}</body>
    </html>
  );
}
