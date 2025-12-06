import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface TimelineEvent {
    id: string;
    date: Date;
    title: string;
    type: 'CONSULT' | 'VACCINE' | 'EXAM' | 'OTHER';
    notes?: string | null;
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
                        {event.type === 'CONSULT' ? (
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
                                <CardContent className="py-3 pt-0">
                                    <p className="text-sm text-muted-foreground">{event.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
