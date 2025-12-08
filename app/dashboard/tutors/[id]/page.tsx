import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { EditTutorDialog } from '@/components/tutors/edit-tutor-dialog';
import { DeleteTutorButton } from '@/components/tutors/delete-tutor-button';

export default async function TutorDetailsPage({ params }: { params: { id: string } }) {
    // Determine if ID is Tutor ID or User ID (handling both for robustness)
    const tutor = await prisma.tutor.findFirst({
        where: { OR: [{ id: params.id }, { userId: params.id }] },
        include: {
            user: true,
            pets: { orderBy: { createdAt: 'desc' } }
        }
    });

    if (!tutor) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">{tutor.user.name}</h1>
                    <p className="text-muted-foreground">{tutor.user.email} • {tutor.phone}</p>
                </div>
                <div className="flex gap-2">
                    <EditTutorDialog tutor={tutor} />
                    <DeleteTutorButton
                        tutorId={tutor.id}
                        tutorName={tutor.user.name || 'Tutor sem nome'}
                        petCount={tutor.pets.length}
                        redirectOnDelete="/dashboard/tutors"
                    />
                    <Link href={`/dashboard/tutors/${tutor.id}/new-pet`}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Adicionar Pet
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Tutor Info Card */}
                <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <span className="text-sm text-muted-foreground">CPF</span>
                            <p>{tutor.cpf}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Endereço</span>
                            <p>{tutor.address || "Não informado"}</p>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">Cadastrado em</span>
                            <p>{tutor.createdAt.toLocaleDateString('pt-BR')}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 lg:col-span-3">
                    <h2 className="text-xl font-semibold mb-4">Pets ({tutor.pets.length})</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tutor.pets.map((pet) => (
                            <Link key={pet.id} href={`/dashboard/pets/${pet.id}`}>
                                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <Avatar className="h-12 w-12">
                                            {pet.photoUrl ? (
                                                <AvatarImage src={pet.photoUrl} alt={pet.name} className="object-cover" />
                                            ) : (
                                                <AvatarFallback className="bg-orange-100 text-orange-600">
                                                    <PawPrint className="h-6 w-6" />
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <CardTitle className="text-base">{pet.name}</CardTitle>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="text-xs">{pet.species}</Badge>
                                                {pet.breed && <span className="text-xs text-muted-foreground self-center">{pet.breed}</span>}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                            <p>{pet.weight ? `${pet.weight} kg` : 'Peso não informado'}</p>
                                            <p>{pet.birthDate ? `${new Date(pet.birthDate).toLocaleDateString('pt-BR')} (${new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} anos)` : 'Idade desconhecida'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                        {tutor.pets.length === 0 && (
                            <div className="md:col-span-3 text-center py-10 border rounded-lg border-dashed text-muted-foreground">
                                <p>Este tutor ainda não possui pets cadastrados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
