import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Search } from 'lucide-react';
import { NewEntryButton } from '@/components/dashboard/new-entry-button';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { Input } from '@/components/ui/input';

const mockEvents = [
    {
        id: 1,
        time: '08:00',
        title: 'Consulta - Pandora',
        tutor: 'Juliana Paes',
        type: 'CONSULT',
        vet: 'Dr. Fred',
        status: 'CONFIRMED'
    },
    {
        id: 2,
        time: '09:30',
        title: 'Vacina V8 - Rex',
        tutor: 'Carlos Cunha',
        type: 'VACCINE',
        vet: 'Dra. Ana',
        status: 'COMPLETED'
    },
    {
        id: 3,
        time: '11:00',
        title: 'Exame de Sangue - Garfield',
        tutor: 'Jon Arbuckle',
        type: 'EXAM',
        vet: 'Dr. Fred',
        status: 'PENDING'
    },
    {
        id: 4,
        time: '14:00',
        title: 'Cirurgia - Thor',
        tutor: 'Odin Borson',
        type: 'SURGERY',
        vet: 'Dr. Carlos',
        status: 'CONFIRMED'
    },
    {
        id: 5,
        time: '16:00',
        title: 'Retorno - Luna',
        tutor: 'Maria Silva',
        type: 'CONSULT',
        vet: 'Dra. Ana',
        status: 'CONFIRMED'
    }
];

const typeColor = (type: string) => {
    switch (type) {
        case 'CONSULT': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'VACCINE': return 'bg-green-100 text-green-700 border-green-200';
        case 'EXAM': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'SURGERY': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function AgendaPage() {
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                        Agenda Clínica
                    </h1>
                    <p className="text-muted-foreground capitalize">{today}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar na agenda..." className="pl-9" />
                    </div>
                    <NewEntryButton className="bg-primary hover:bg-primary/90 shadow-md" />
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
                                <CalendarView />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary-foreground/80 text-primary">Disponibilidade Hoje</p>
                                <p className="text-2xl font-bold text-primary">3 Horários</p>
                            </div>
                            <Clock className="h-8 w-8 text-primary/40" />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Schedule List - 8 Cols */}
                <div className="lg:col-span-8 space-y-4">
                    {mockEvents.map((event) => (
                        <div key={event.id} className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">

                            {/* Time Column */}
                            <div className="flex flex-col items-center min-w-[4rem] text-center">
                                <span className="text-lg font-bold text-gray-700">{event.time}</span>
                                <span className="text-xs text-muted-foreground uppercase">{event.time >= '12:00' ? 'PM' : 'AM'}</span>
                                <div className="h-full w-px bg-gray-100 mt-2 group-last:hidden"></div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 pb-2">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <span className="font-medium text-gray-600">{event.tutor}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${typeColor(event.type)}`}>
                                            {event.type}
                                        </span>
                                        <Badge variant={event.status === 'COMPLETED' ? 'secondary' : 'outline'}>
                                            {event.status === 'CONFIRMED' ? 'Confirmado' : event.status === 'COMPLETED' ? 'Realizado' : 'Pendente'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-gray-50/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                        {event.vet}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        Sala 0{event.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State Mock */}
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <Clock className="w-8 h-8 mb-2 opacity-50" />
                        <p className="font-medium">Nenhum outro agendamento para hoje</p>
                        <p className="text-sm">Clique para adicionar um horário livre</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
