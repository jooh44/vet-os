'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, BrainCircuit, Microscope, ArrowRight } from "lucide-react"
import Link from "next/link"

export function AIAssistantCard() {
    return (
        <Card className="flex flex-col h-full bg-card border-primary/20 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
            {/* Ambient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

            <CardHeader className="pb-3 z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-3xl text-foreground font-normal font-serif flex items-center gap-2">
                    Assistente IA
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full translate-y-[-4px]">Beta</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Segunda opinião instantânea e análise de casos complexos.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 z-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg border border-primary/10 hover:bg-white transition-colors cursor-pointer">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">Análise de Sintomas</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg border border-primary/10 hover:bg-white transition-colors cursor-pointer">
                        <Microscope className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-gray-700">Interpretação de Exames</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="z-10">
                <Link href="/dashboard/consultation" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 group-hover:shadow-lg transition-all">
                        Iniciar Nova Análise <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
