import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, ArrowRight, PlayCircle, Clock } from "lucide-react"
import { ConsultationQueue } from "@/components/dashboard/consultation-queue"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Seu Centro de Ação</h1>
                    <p className="text-muted-foreground">Bem-vindo, Dr. Johny. Vamos cuidar de quem precisa hoje?</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/consultation">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Iniciar Nova Consulta
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats / Actionable Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/patients">
                    <Card className="shadow-sm hover:shadow-md transition-all cursor-pointer bg-card group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium font-serif text-muted-foreground group-hover:text-primary transition-colors">Pacientes Ativos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                12
                                <span className="text-xs font-normal text-muted-foreground">esta semana</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="shadow-sm hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-serif text-muted-foreground">Consultas Realizadas</CardTitle>
                        <Stethoscope className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            8
                            <span className="text-xs font-normal text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full flex items-center">
                                Hoje
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow bg-card opacity-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-serif text-muted-foreground">Tempo Médio</CardTitle>
                        <Clock className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">22 min</div>
                        <p className="text-xs text-muted-foreground mt-1">por atendimento</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Visual Queue / Recent - Takes 3/3 basically, or 2/3 with something else */}
                <div className="lg:col-span-3">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Pacientes Recentes
                            </h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/patients">Ver todos <ArrowRight className="ml-1 h-3 w-3" /></Link>
                            </Button>
                        </div>
                        <ConsultationQueue />
                    </div>
                </div>
            </div>
        </div>
    )
}
