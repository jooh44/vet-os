'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { NewEntryButton } from '@/components/dashboard/new-entry-button';

// Mock Data
const queue = [
    {
        id: '1',
        petName: 'Thor',
        tutorName: 'Carlos Silva',
        time: '09:00',
        type: 'CONSULTA',
        status: 'EM_ATENDIMENTO',
        avatar: '',
        tags: ['Urgência', 'Vômito']
    },
    {
        id: '2',
        petName: 'Luna',
        tutorName: 'Ana Maria',
        time: '09:30',
        type: 'VACINA',
        status: 'AGUARDANDO',
        avatar: '',
        tags: ['V8', 'Raiva']
    },
    {
        id: '3',
        petName: 'Bolinha',
        tutorName: 'Roberto',
        time: '10:00',
        type: 'RETORNO',
        status: 'AGENDADO',
        avatar: '',
        tags: ['Pós-Cirúrgico']
    },
    {
        id: '4',
        petName: 'Mel',
        tutorName: 'Fernanda',
        time: '10:30',
        type: 'EXAME',
        status: 'AGENDADO',
        avatar: '',
        tags: ['Ultrassom']
    }
];

const statusColor = (status: string) => {
    switch (status) {
        case 'EM_ATENDIMENTO': return 'bg-green-100 text-green-700 border-green-200';
        case 'AGUARDANDO': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const tagColor = (tag: string) => {
    const t = tag.toLowerCase();
    // High contrast mappings
    if (t.includes('urgência') || t.includes('vômito')) return 'bg-red-100 text-red-800 border border-red-200';
    if (t.includes('vacina') || t.includes('v8') || t.includes('raiva')) return 'bg-blue-100 text-blue-800 border border-blue-200';
    if (t.includes('retorno') || t.includes('pós')) return 'bg-purple-100 text-purple-800 border border-purple-200';
    if (t.includes('exame') || t.includes('ultrassom')) return 'bg-orange-100 text-orange-800 border border-orange-200';

    // Default fallback with good contrast
    return 'bg-gray-100 text-gray-800 border border-gray-200';
};

export function ConsultationQueue() {
    return (
        <Card className="h-full border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0 pb-4 flex flex-row items-center justify-between">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl font-bold font-serif text-gray-800">Fila de Atendimento</CardTitle>
                    <p className="text-sm text-muted-foreground">4 pacientes agendados para hoje</p>
                </div>
                <NewEntryButton size="sm" className="bg-primary shadow-sm hover:translate-y-[-1px] transition-transform" />
            </CardHeader>
            <CardContent className="px-0 flex flex-col gap-3">
                {queue.map((item) => (
                    <div key={item.id} className="group relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-primary/20">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-gray-100">
                                    <AvatarFallback className="bg-orange-50 text-orange-600 font-bold">
                                        {item.petName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-gray-800">{item.petName}</h4>
                                    <p className="text-xs text-muted-foreground">{item.tutorName}</p>
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${statusColor(item.status)}`}>
                                {item.status.replace('_', ' ')}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-wrap gap-1">
                                {item.tags.map(tag => (
                                    <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColor(tag)}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center text-xs font-semibold text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.time}
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
