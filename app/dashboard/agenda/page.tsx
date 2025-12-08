import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Search } from 'lucide-react';
import { NewEntryButton } from '@/components/dashboard/new-entry-button';
import { NewAppointmentButton } from '@/components/dashboard/agenda/new-appointment-button';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { Input } from '@/components/ui/input';
import { getDailyAppointments } from '@/app/lib/actions/appointment-actions';
import prisma from '@/lib/prisma';



const typeColor = (type: string) => {
    switch (type) {
        case 'CONSULT': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'VACCINE': return 'bg-green-100 text-green-700 border-green-200';
        case 'EXAM': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'SURGERY': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const mapStatus = (status: string) => {
    switch (status) {
        case 'CONFIRMED': return 'Confirmado';
        case 'COMPLETED': return 'Realizado';
        case 'PENDING': return 'Pendente';
        case 'CANCELED': return 'Cancelado';
        default: return status;
    }
}

export default async function AgendaPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    console.log("AgendaPage: Starting render");

    // Parse date from searchParams or default to today
    const dateParam = searchParams?.date;
    // Fix: Appending T12:00:00 to ensure we stay on the correct day regardless of timezone offsets
    // when parsing a YYYY-MM-DD string.
    const today = dateParam
        ? new Date(`${dateParam}T12:00:00`)
        : new Date();

    // Fetch daily appointments
    const { data: appointments, error } = await getDailyAppointments(today);

    // Fetch monthly highlights (server-side for initial render)
    const { getMonthlyHighlights } = await import('@/app/lib/actions/appointment-actions');
    const { data: highlights } = await getMonthlyHighlights(today);

    if (error) {
        console.error("AgendaPage Error:", error);
    } else {
        console.log(`AgendaPage: Loaded ${appointments?.length} appointments via Server Action.`);
    }

    const formattedDate = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                        Agenda Clínica
                    </h1>
                    <p className="text-muted-foreground capitalize">{formattedDate}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar na agenda..." className="pl-9" />
                    </div>
                    {/* passing isAgenda=true to indicate specific behavior if needed, or just using generic new entry */}
                    <NewAppointmentButton />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-start">

                {/* Sidebar Calendar - 4 Cols */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Navegação</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 pt-0">
                                <CalendarView initialDate={today} highlights={(highlights || []) as number[]} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary-foreground/80 text-primary">Agendamentos Hoje</p>
                                <p className="text-2xl font-bold text-primary">{appointments?.length || 0}</p>
                            </div>
                            <Clock className="h-8 w-8 text-primary/40" />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Schedule List - 8 Cols */}
                <div className="lg:col-span-8 space-y-4">
                    {appointments && appointments.length > 0 ? (
                        appointments.map((event: any) => (
                            <div key={event.id} className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">

                                {/* Time Column */}
                                <div className="flex flex-col items-center min-w-[4rem] text-center">
                                    <span className="text-lg font-bold text-gray-700">
                                        {event.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className="h-full w-px bg-gray-100 mt-2 group-last:hidden"></div>
                                </div>

                                {/* Content Column */}
                                <div className="flex-1 pb-2">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                {event.pet?.tutor?.user?.name ? (
                                                    <span className="font-medium text-gray-600">{event.pet.tutor.user.name} ({event.pet.name})</span>
                                                ) : (
                                                    <span className="font-medium text-gray-600">--</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${typeColor(event.type)}`}>
                                                {event.type}
                                            </span>
                                            <Badge variant={event.status === 'COMPLETED' ? 'secondary' : 'outline'}>
                                                {mapStatus(event.status)}
                                            </Badge>
                                        </div>
                                    </div>

                                    {event.pet?.id && (
                                        <div className="mb-2">
                                            <a
                                                href={`/dashboard/pets/${event.pet.id}`}
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors font-medium inline-flex items-center gap-1"
                                            >
                                                Ver Prontuário
                                            </a>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-gray-50/50 p-2 rounded-lg">
                                        {event.vetId && (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                {/* Ideally fetch Vet name */}
                                                Vet ID: {event.vetId.substring(0, 8)}...
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                            {/* Placeholder for Room/Location */}
                                            Clínica Principal
                                        </div>
                                        {event.notes && (
                                            <div className="w-full mt-1 italic text-xs">
                                                "{event.notes}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))) : (
                        /* Empty State */
                        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground hover:bg-gray-50/50 transition-colors cursor-pointer">
                            <Clock className="w-8 h-8 mb-2 opacity-50" />
                            <p className="font-medium">Nenhum agendamento para hoje</p>
                            <p className="text-sm">Clique em "Novo Agendamento" para adicionar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

