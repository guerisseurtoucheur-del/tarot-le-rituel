import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Le Rituel du Tarot de Grimaud",
  description: "Consultez les 22 arcanes majeurs du Tarot de Grimaud.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Cinzel', serif", margin: 0, padding: 0, backgroundColor: "#050505", color: "#d4af37", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
