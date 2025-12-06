import prisma from '@/lib/prisma';
import Timeline from '@/components/pets/timeline';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Weight, Ruler, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function PetProfilePage({ params }: { params: { id: string } }) {
    const pet = await prisma.pet.findUnique({
        where: { id: params.id },
        include: {
            tutor: { include: { user: true } },
            medicalRecords: { orderBy: { date: 'desc' } }
        }
    });

    if (!pet) {
        notFound();
    }

    // Map records to Timeline events
    const events = pet.medicalRecords.map((r) => {
        const record = r as any; // Cast to access new AI fields
        // Construct display text for AI records if notes is empty
        let displayNotes = record.notes;
        if (!displayNotes && (record.anamnesis || record.diagnosis)) {
            displayNotes = [
                record.diagnosis ? `Diagnóstico: ${record.diagnosis}` : '',
                record.anamnesis ? `Queixa: ${record.anamnesis.substring(0, 100)}${record.anamnesis.length > 100 ? '...' : ''}` : '',
                record.prescription ? '📝 Prescrição realizada' : ''
            ].filter(Boolean).join(' • ');
        }

        return {
            id: record.id,
            date: record.date,
            title: record.title,
            notes: displayNotes || 'Sem detalhes registrados.',
            type: inferType(record.title)
        };
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/10">
                        {pet.photoUrl ? (
                            <AvatarImage src={pet.photoUrl} alt={pet.name} className="object-cover" />
                        ) : (
                            <AvatarFallback className="bg-orange-100 text-orange-600">
                                <PawPrint className="h-10 w-10" />
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{pet.name}</h1>
                        <p className="text-muted-foreground">{pet.species} • {pet.breed || 'Sem raça definida'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/tutors/${pet.tutor.userId}`}>
                        <Button variant="outline">Ver Tutor</Button>
                    </Link>
                    {/* Add Note/Record Button */}
                    <Link href={`/dashboard/consultation?petId=${pet.id}&petName=${encodeURIComponent(pet.name)}`}>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                            Nova Entrada
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Sidebar Info */}
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Dados</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center gap-3">
                                <Weight className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Peso</p>
                                    <p className="font-medium">{pet.weight ? `${pet.weight} kg` : '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Idade</p>
                                    <p className="font-medium">
                                        {pet.birthDate
                                            ? `${new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} anos`
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Tutor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{pet.tutor.user.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{pet.tutor.phone}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline Main Area */}
                <div className="md:col-span-3">
                    <h2 className="text-xl font-semibold mb-6">Prontuário (Timeline)</h2>
                    {/* @ts-ignore */}
                    <Timeline events={events} />
                </div>
            </div>
        </div>
    );
}

function inferType(title: string): 'CONSULT' | 'VACCINE' | 'EXAM' | 'OTHER' {
    const t = title.toLowerCase();
    if (t.includes('vacina')) return 'VACCINE';
    if (t.includes('exame') || t.includes('hemograma') || t.includes('raio-x')) return 'EXAM';
    if (t.includes('consulta') || t.includes('retorno')) return 'CONSULT';
    return 'OTHER';
}
