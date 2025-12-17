import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DownloadPdfButton } from '@/components/records/download-pdf-button';

export default async function RecordDetailPage({ params }: { params: { id: string } }) {
    const record = await prisma.consultation.findUnique({
        where: { id: params.id },
        include: {
            pet: {
                include: {
                    tutor: {
                        include: { user: true }
                    }
                }
            },
            vet: true
        }
    });

    if (!record) {
        return <div>Prontuário não encontrado.</div>;
    }

    return (
        <div className="p-6 flex flex-col gap-6">
            <div>
                <Link href="/dashboard/records">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar para Lista
                    </Button>
                </Link>
                <div className="flex items-center justify-between mt-2">
                    <h1 className="text-3xl font-bold text-gray-800">{record.title}</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(record.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                        <DownloadPdfButton record={record} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Detalhes do Atendimento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-700">Anamnese</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{record.anamnesis || 'Não registrado.'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Exame Físico</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{record.physicalExam || 'Não registrado.'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Diagnóstico</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{record.diagnosis || 'Não registrado.'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Prescrição</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{record.prescription || 'Não registrado.'}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Paciente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                                    {record.pet.name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{record.pet.name}</p>
                                    <p className="text-sm text-muted-foreground">{record.pet.species} - {record.pet.breed}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tutor:</span>
                                    <span className="font-medium">{record.pet.tutor.user.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Peso:</span>
                                    <span className="font-medium">{record.pet.weight || '-'} kg</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
