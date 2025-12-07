import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users, TrendingUp, Calendar as CalIcon, Stethoscope, ArrowUpRight } from "lucide-react"
import { CalendarView } from "@/components/dashboard/calendar-view"
import { ConsultationQueue } from "@/components/dashboard/consultation-queue"


export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Bem-vindo, Dr. Johny</h1>
                    <p className="text-muted-foreground">Aqui está o resumo da sua clínica hoje.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema Operante
                    </div>
                </div>
            </div>

            {/* Stats Grid - Nature/Poetry Look */}
            {/* Using a subtle, unified design language that emphasizes the clinic's brand (Green/Nature) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-l-4 border-l-gray-300 hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Receita</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            R$ 45.231
                            <span className="text-xs font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex items-center">
                                +20% <ArrowUpRight className="h-3 w-3" />
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Faturamento mensal</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-gray-300 hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Novos Tutores</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            +24
                            <span className="text-xs font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex items-center">
                                +12% <ArrowUpRight className="h-3 w-3" />
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Cadastros esta semana</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-gray-300 hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Consultas</CardTitle>
                        <Stethoscope className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            128
                            <span className="text-xs font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full flex items-center">
                                +5% <ArrowUpRight className="h-3 w-3" />
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Atendimentos realizados</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-l-4 border-l-gray-300 hover:shadow-md transition-shadow bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ocupação</CardTitle>
                        <Activity className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground mt-1">Capacidade operacional</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Visual Queue - Takes 2/3 */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border p-2">
                        <ConsultationQueue />
                    </div>
                </div>

                {/* Sidebar - Calendar & Quick Actions - Takes 1/3 */}
                <div className="space-y-6">
                    <CalendarView />

                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5 text-white/80" />
                                Insights IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-white/90 leading-relaxed">
                                A procura por vacinas de gripe aumentou <strong>15%</strong> nesta semana devido à frente fria.
                            </p>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
