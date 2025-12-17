'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export function TelemedCard() {
    return (
        <Card className="flex flex-col h-full bg-card border-primary/20 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
            {/* Ambient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

            <CardHeader className="pb-3 z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                    <Video className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-3xl text-foreground font-normal font-serif">
                    Telemedicina
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Gerencie suas consultas remotas e sala de espera virtual.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 z-10">
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/60 rounded-xl border border-primary/10 flex flex-col items-center justify-center text-center hover:bg-white transition-colors">
                        <span className="text-2xl font-bold text-primary">0</span>
                        <span className="text-xs text-muted-foreground font-medium">Na Espera</span>
                    </div>
                    <div className="p-3 bg-white/60 rounded-xl border border-primary/10 flex flex-col items-center justify-center text-center hover:bg-white transition-colors">
                        <span className="text-2xl font-bold text-primary">3</span>
                        <span className="text-xs text-muted-foreground font-medium">Hoje</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="z-10 flex gap-2">
                <Link href="/dashboard/agenda" className="flex-1">
                    <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 hover:text-primary">
                        Agenda
                    </Button>
                </Link>
                <Link href="/dashboard/consultation" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                        Abrir Sala
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
