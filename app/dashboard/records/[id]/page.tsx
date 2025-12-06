
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowLeft, HeartPulse, Stethoscope, ClipboardList, Pill } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DownloadButton } from './download-button';

// We need a client component for the download action to access the DOM/document generator 
// or simpler: we can use a server action that returns the data, and a client component wrapper.
// Let's create a specialized client component for the download button.

export default async function RecordDetailsPage({ params }: { params: { id: string } }) {
    const record = await prisma.medicalRecord.findUnique({
        where: { id: params.id },
        include: {
            pet: {
                include: {
                    tutor: {
                        include: { user: true }
                    }
                }
            }
        }
    });

    if (!record) {
        notFound();
    }

    // Cast to any to access new fields (anamnesis, etc) without TS errors
    const r = record as any;

    // Prepare data object for the client component
    const recordData = {
        ...r,
        patientName: r.pet.name,
        tutorName: r.pet.tutor.user.name,
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Link href={`/dashboard/pets/${r.petId}`} className="hover:text-primary flex items-center gap-1 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para {r.pet.name}
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <FileText className="h-8 w-8 text-secondary" />
                        Detalhes do Prontuário
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {format(r.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                </div>

                <DownloadButton record={recordData} />
            </div>

            <div className="grid gap-6">
                {/* Patient Info Summary */}
                <Card className="bg-secondary/5 border-secondary/20">
                    <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Paciente</p>
                            <p className="text-lg font-bold text-primary">{r.pet.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Espécie/Raça</p>
                            <p>{r.pet.species} • {r.pet.breed || 'SRD'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Tutor</p>
                            <p>{r.pet.tutor.user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase">ID do Vínculo</p>
                            <p className="font-mono text-xs">{r.petId.substring(0, 8)}...</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Clinical Sections */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ClipboardList className="h-5 w-5 text-primary" />
                                Anamnese
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                                {r.anamnesis || 'Não informado.'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Stethoscope className="h-5 w-5 text-primary" />
                                Exame Físico
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                                {r.physicalExam || 'Não informado.'}
                            </p>
                            {/* Mock Vitals Display for UI */}
                            {(!r.physicalExam || !r.physicalExam.toLowerCase().includes('bpm')) && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
                                    <strong>Nota:</strong> Sinais vitais completos serão gerados automaticamente no documento PDF.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-orange-600">
                                <HeartPulse className="h-5 w-5" />
                                Diagnóstico
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-md font-medium text-orange-900">
                                {r.diagnosis || 'Em análise.'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                                <Pill className="h-5 w-5" />
                                Prescrição
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-green-50 border border-green-100 rounded-md font-mono text-sm text-green-900 whitespace-pre-wrap">
                                {r.prescription || 'Sem prescrição.'}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
