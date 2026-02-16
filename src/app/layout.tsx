import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poetizhadas | Arte & Poesía hecho realidad",
  description: "Descubre nuestra colección de piezas únicas con alma y diseño boutique.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-pink-200">
        {children}
      </body>
    </html>
  );
}