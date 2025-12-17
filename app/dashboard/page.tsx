import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, ArrowRight, PlayCircle, Clock } from "lucide-react"

import { AIAssistantCard } from "@/components/dashboard/ai-assistant-card"
import { TelemedCard } from "@/components/dashboard/telemed-card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export default async function DashboardPage() {
    const session = await auth()
    const userName = session?.user?.name || "Doutor"
    const formattedName = userName.startsWith("Dr.") || userName.startsWith("Dra.")
        ? userName
        : `Dr. ${userName}`

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal text-gray-800">
                        Bem-vindo, {formattedName}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/settings">
                        <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary">
                            Configurações
                        </Button>
                    </Link>
                    <Link href="/dashboard/consultation">
                        <Button className="bg-primary hover:bg-primary/90 text-white">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Iniciar Nova Consulta
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats / Actionable Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/patients">
                    <Card className="shadow-sm hover:shadow-md transition-all cursor-pointer bg-card group border-primary/10 hover:border-primary/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-normal font-serif text-muted-foreground group-hover:text-primary transition-colors">Pacientes Ativos</CardTitle>
                            <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-normal font-serif flex items-center gap-2">
                                12
                                <span className="text-sm font-sans text-muted-foreground">esta semana</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="shadow-sm hover:shadow-md transition-shadow bg-card border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-normal font-serif text-muted-foreground">Consultas Realizadas</CardTitle>
                        <Stethoscope className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-normal font-serif flex items-center gap-2">
                            8
                            <span className="text-xs font-sans font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                                Hoje
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow bg-card opacity-80 border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xl font-normal font-serif text-muted-foreground">Tempo Médio</CardTitle>
                        <Clock className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-normal font-serif">22 min</div>
                        <p className="text-xs text-muted-foreground mt-1 font-sans">por atendimento</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* New Feature Cards - Taking prominent space */}
                <div className="lg:col-span-2">
                    <div className="grid gap-4 md:grid-cols-2 h-full">
                        <AIAssistantCard />
                        <TelemedCard />
                    </div>
                </div>

                {/* Side Panel / Notifications or Quick Stats could go here later */}
                <div className="lg:col-span-1">
                    <Card className="h-full border-dashed border-2 flex flex-col items-center justify-center p-6 text-center text-muted-foreground bg-gray-50/50">
                        <Clock className="w-10 h-10 mb-2 opacity-20" />
                        <p>Insights Recentes</p>
                        <p className="text-sm opacity-60">Nenhum alerta crítico detectado nas últimas 24h.</p>
                    </Card>
                </div>
            </div>
        </div >
    )
}
