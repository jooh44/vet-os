import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Timeline from '@/components/pets/timeline';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, Weight, Ruler, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MedicalAlertsCard } from '@/components/pets/medical-alerts-card';
import { PetPhotoUploader } from '@/components/pets/pet-photo-uploader';
import { EditPetDialog } from '@/components/pets/edit-pet-dialog';
import { DeletePetButton } from '@/components/pets/delete-pet-button';
import { PetAudioActions } from '@/components/pets/pet-audio-actions';
import { FredPetContext } from '@/components/pets/fred-pet-context';

export default async function PetProfilePage({ params }: { params: { id: string } }) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect('/login');
    }

    // Data Isolation: Only fetch pets belonging to tutors created by this vet
    const pet = await prisma.pet.findFirst({
        where: {
            id: params.id,
            tutor: { createdByVetId: userId }
        },
        include: {
            tutor: { include: { user: true } },
            consultations: { orderBy: { date: 'desc' } }
        }
    });

    if (!pet) {
        notFound();
    }

    // Map records to Timeline events
    const events = pet.consultations.map((r: any) => {
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
            type: inferType(record.title),
            vitalSigns: record.vitalSigns
        };
    });

    return (
        <div className="flex flex-col gap-4">
            <FredPetContext
                pet={{
                    id: pet.id,
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed,
                    weight: pet.weight,
                    birthDate: pet.birthDate,
                    tutorName: pet.tutor.user.name || 'Unknown'
                }}
                medicalRecords={events}
            />
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <PetPhotoUploader
                        petId={pet.id}
                        currentPhotoUrl={pet.photoUrl}
                        petName={pet.name}
                    />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-normal text-primary">{pet.name}</h1>
                        <p className="text-muted-foreground text-sm">{pet.species} • {pet.breed || 'Sem raça definida'}</p>
                    </div>
                </div>

                {/* Actions Toolbar - Scrollable on very small screens or wraps */}
                <div className="flex flex-wrap gap-2 items-center">
                    <EditPetDialog pet={{
                        id: pet.id,
                        name: pet.name,
                        species: pet.species,
                        breed: pet.breed,
                        weight: pet.weight,
                        birthDate: pet.birthDate,
                        notes: pet.notes,
                        allergies: pet.allergies
                    }} />
                    <DeletePetButton
                        petId={pet.id}
                        petName={pet.name}
                        redirectOnDelete="/dashboard/patients"
                    />
                    <Link href={`/dashboard/tutors/${pet.tutor.userId}`}>
                        <Button variant="outline" size="sm">Ver Tutor</Button>
                    </Link>

                    <Link href={`/dashboard/consultation?petId=${pet.id}&petName=${encodeURIComponent(pet.name)}`} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 border-0 transition-all duration-300 transform hover:-translate-y-0.5">
                            <Sparkles className="mr-2 h-4 w-4 text-white animate-pulse" />
                            Consulta
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

                    <div className="pt-2">
                        <PetAudioActions petId={pet.id} petName={pet.name} />
                    </div>

                    <MedicalAlertsCard
                        petId={pet.id}
                        initialAllergies={pet.allergies}
                        initialNotes={pet.notes}
                    />
                </div>

                {/* Timeline Main Area */}
                <div className="md:col-span-3 pr-2">
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
