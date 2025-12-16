import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Thermometer, Activity, Weight, Ruler, Waves } from "lucide-react";

interface TimelineEvent {
    id: string;
    date: Date;
    title: string;
    type: 'CONSULT' | 'VACCINE' | 'EXAM' | 'OTHER';
    notes?: string | null;
    vitalSigns?: any;
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
    if (!events || events.length === 0) {
        return <div className="text-center text-muted-foreground py-10">Nenhum evento registrado.</div>;
    }

    return (
        <div className="relative border-l border-muted ml-4 space-y-8">
            {events.map((event) => (
                <div key={event.id} className="relative pl-8">
                    {/* Dot */}
                    <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />

                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                            {format(event.date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                        {/* Clickable Logic: Only link if it's a full Consult AND not a Quick Note */}
                        {event.type === 'CONSULT' && !event.title.includes('Anotação Rápida') ? (
                            <Link href={`/dashboard/records/${event.id}`} className="block transition-transform hover:scale-[1.01]">
                                <Card className="hover:border-primary/50 cursor-pointer">
                                    <CardHeader className="py-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-semibold text-primary">{event.title}</CardTitle>
                                            <Badge variant="outline">{event.type}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="py-3 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{event.notes}</p>
                                        <p className="text-xs text-primary font-medium mt-2 flex items-center">
                                            Ver detalhes completos &rarr;
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ) : (
                            <Card>
                                <CardHeader className="py-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold">{event.title}</CardTitle>
                                        <Badge variant="outline">{event.type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="py-3 pt-0 space-y-3">
                                    <p className="text-sm text-muted-foreground">{event.notes}</p>

                                    {/* Vital Signs Grid */}
                                    {event.vitalSigns && Object.keys(event.vitalSigns).length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {event.vitalSigns.temperature && (
                                                <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-md text-xs">
                                                    <Thermometer className="h-4 w-4" />
                                                    <span className="font-semibold">{event.vitalSigns.temperature}°C</span>
                                                </div>
                                            )}
                                            {event.vitalSigns.weight && (
                                                <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md text-xs">
                                                    <Weight className="h-4 w-4" />
                                                    <span className="font-semibold">{event.vitalSigns.weight} kg</span>
                                                </div>
                                            )}
                                            {event.vitalSigns.heartRate && (
                                                <div className="flex items-center gap-2 p-2 bg-pink-50 text-pink-700 rounded-md text-xs">
                                                    <Activity className="h-4 w-4" />
                                                    <span className="font-semibold">{event.vitalSigns.heartRate} bpm</span>
                                                </div>
                                            )}
                                            {event.vitalSigns.respiratoryRate && (
                                                <div className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-md text-xs">
                                                    <Waves className="h-4 w-4" />
                                                    <span className="font-semibold">{event.vitalSigns.respiratoryRate} rpm</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
