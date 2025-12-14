import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { FredProvider } from "@/components/fred/fred-provider";
import { FredFloatingWidget } from "@/components/fred/fred-widget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

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
        inter.variable,
        lora.variable
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
