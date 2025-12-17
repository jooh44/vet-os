import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function TutorHomePage() {
    const session = await auth();
    if (!session?.user?.email) return <div>Acesso negado.</div>;

    // Fetch Tutor Data based on User
    const tutor = await prisma.tutor.findFirst({
        where: { userId: session.user.id },
        include: {
            pets: {
                include: {
                    vaccines: {
                        orderBy: { date: 'desc' },
                        take: 1
                    }
                }
            }
        }
    });

    if (!tutor) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Bem-vindo, {session.user.name}</h1>
                <p>Seu perfil de tutor ainda não foi vinculado. Entre em contato com a clínica.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary">Meus Pets 🐾</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tutor.pets.map((pet: any) => (
                    <Card key={pet.id} className="overflow-hidden hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
                            <Avatar className="h-16 w-16 border-2 border-background">
                                <AvatarImage src={pet.photoUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${pet.name}`} />
                                <AvatarFallback>{pet.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{pet.name}</CardTitle>
                                <CardDescription>{pet.breed} • {pet.species}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 grid gap-2">
                            {pet.vaccines.length > 0 ? (
                                <div className="flex items-center gap-2 text-sm text-yellow-600 font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Última Vacina: {pet.vaccines[0].name} ({new Date(pet.vaccines[0].date).toLocaleDateString('pt-BR')})
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Vacinas em dia
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <Link href={`/dashboard/tutor-cards?petId=${pet.id}`}>
                                    <Button variant="outline" size="sm" className="w-full gap-2">
                                        <FileText className="h-4 w-4" />
                                        Carteirinha
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/chat`}>
                                    <Button variant="secondary" size="sm" className="w-full gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Falar com Vet
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {tutor.pets.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    Você ainda não tem pets cadastrados.
                </div>
            )}
        </div>
    );
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
