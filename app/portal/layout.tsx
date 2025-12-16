import { Inter, Lora } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata = {
    title: 'Área do Tutor | Vet.OS',
    description: 'Portal do Paciente',
};

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={cn(
                "min-h-screen bg-slate-50 font-sans antialiased",
                inter.variable,
                lora.variable
            )}>
                <main className="mx-auto max-w-md min-h-screen bg-white shadow-2xl overflow-hidden relative">
                    {/* mimic a mobile app container centered on screen if desktop */}
                    {children}
                </main>
            </body>
        </html>
    );
}
