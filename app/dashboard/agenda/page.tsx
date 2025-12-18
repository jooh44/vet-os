import { CalendarView } from "@/components/dashboard/calendar-view";
import { NewAppointmentButton } from "@/components/dashboard/agenda/new-appointment-button";
import { AppointmentCard } from "@/components/dashboard/agenda/appointment-card";
import { getDayAppointments } from "@/app/lib/actions/appointment-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, User, MessageCircle, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

export default async function AgendaPage({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    const dateParam = searchParams?.date;

    // Fix: Parse YYYY-MM-DD manually to create a Local Date (00:00:00) 
    // instead of new Date(string) which assumes UTC and might shift day
    let selectedDate = new Date();
    // Default to Noon to safely handle timezone shifts when passing to client (avoid 00:00 -> Previous Day)
    if (dateParam) {
        const [year, month, day] = dateParam.split('-').map(Number);
        selectedDate = new Date(year, month - 1, day, 12, 0, 0);
    } else {
        selectedDate.setHours(12, 0, 0, 0);
    }

    const { data: appointments } = await getDayAppointments(selectedDate);

    // Group by simple status just for visual separation if needed, or just list time-ordered
    const hasAppointments = appointments && appointments.length > 0;

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-normal text-primary">Agenda</h1>
                    <p className="text-muted-foreground">Gerencie suas consultas e tele atendimentos.</p>
                </div>
                <NewAppointmentButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Left Column: Calendar Navigation */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <CalendarView initialDate={selectedDate} />

                    {/* Mini Stats or Info */}
                    <Card className="mt-4 bg-indigo-50 border-indigo-100">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Video className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-indigo-900">Telemedicina</p>
                                <p className="text-xs text-indigo-700">Link acessível 10min antes.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Daily Agenda List */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 w-1 bg-primary rounded-full"></div>
                        <h2 className="text-xl font-semibold capitalize">
                            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </h2>
                        <span className="text-muted-foreground text-sm ml-2">
                            ({appointments?.length || 0} agendamentos)
                        </span>
                    </div>

                    {!hasAppointments ? (
                        <Card className="border-dashed border-2 bg-gray-50/50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                                    <Clock className="h-8 w-8 text-gray-300" />
                                </div>
                                <p className="font-medium">Nenhum agendamento para este dia.</p>
                                <p className="text-sm opacity-60 max-w-xs mt-1">Aproveite o tempo livre para revisar prontuários ou estudar casos.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {appointments.map((apt) => (
                                <AppointmentCard key={apt.id} appointment={apt} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
