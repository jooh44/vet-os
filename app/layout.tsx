import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Instrument_Serif } from "next/font/google"; // Instrument Serif for chic look
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { FredProvider } from "@/components/fred/fred-provider";
import { FredFloatingWidget } from "@/components/fred/fred-widget";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins"
});
const instrumentSerif = Instrument_Serif({
  weight: ['400'], // Instrument Serif typically only has 400 (and maybe italic)
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: "--font-serif" // Keeping same variable name for easy swap
});

export const metadata: Metadata = {
  title: {
    template: '%s | Vet.OS',
    default: 'Vet.OS Dashboard',
  },
  description: "Sistema Inteligente de Gestão Veterinária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        spaceGrotesk.variable,
        poppins.variable,
        instrumentSerif.variable
      )}>
        <FredProvider>
          {children}
          <FredFloatingWidget />
          <Toaster />
        </FredProvider>
      </body>
    </html>
  );
}
