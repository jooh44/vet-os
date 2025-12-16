'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

// Mock Data - Recent Activity
const recentActivity = [
    {
        id: '1',
        petName: 'Thor',
        tutorName: 'Carlos Silva',
        time: 'Há 10 min',
        status: 'EM_CONSULTA',
        action: 'Retomar',
        tags: ['Gastroenterite']
    },
    {
        id: '2',
        petName: 'Luna',
        tutorName: 'Ana Maria',
        time: 'Há 45 min',
        status: 'FINALIZADO',
        action: 'Ver Resumo',
        tags: ['Vacina V8']
    },
    {
        id: '3',
        petName: 'Mel',
        tutorName: 'Fernanda',
        time: 'Ontem',
        status: 'AGUARDANDO_EXAME',
        action: 'Anexar Laudo',
        tags: ['Hemograma']
    }
];

const statusColor = (status: string) => {
    switch (status) {
        case 'EM_CONSULTA': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'FINALIZADO': return 'bg-green-50 text-green-700 border-green-200';
        case 'AGUARDANDO_EXAME': return 'bg-orange-50 text-orange-700 border-orange-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'EM_CONSULTA': return <Clock className="h-3 w-3 mr-1" />;
        case 'FINALIZADO': return <CheckCircle className="h-3 w-3 mr-1" />;
        default: return <AlertCircle className="h-3 w-3 mr-1" />;
    }
}

export function ConsultationQueue() {
    return (
        <Card className="h-full border-none shadow-none bg-transparent">
            <CardContent className="px-0 flex flex-col gap-3">
                {recentActivity.map((item) => (
                    <div key={item.id} className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border border-gray-100">
                                <AvatarFallback className="bg-primary/5 text-primary font-bold text-lg">
                                    {item.petName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">{item.petName}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{item.tutorName}</span>
                                    <span>•</span>
                                    <span className="flex items-center text-xs bg-gray-50 px-2 py-0.5 rounded-full">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${statusColor(item.status)}`}>
                                <StatusIcon status={item.status} />
                                {item.status.replace('_', ' ')}
                            </div>

                            <div className="hidden md:flex gap-1">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded border">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Button size="sm" variant={item.status === 'EM_CONSULTA' ? 'default' : 'outline'}>
                                {item.action}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
