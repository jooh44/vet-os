
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowLeft, HeartPulse, Stethoscope, ClipboardList, Pill, Thermometer, Weight, Activity, Waves } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DownloadButton } from './download-button';

// We need a client component for the download action to access the DOM/document generator 
// or simpler: we can use a server action that returns the data, and a client component wrapper.
// Let's create a specialized client component for the download button.

export default async function RecordDetailsPage({ params }: { params: { id: string } }) {
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

                            {/* Vital Signs Grid */}
                            {r.vitalSigns && Object.keys(r.vitalSigns).length > 0 && (
                                <div className="mt-6 pt-6 border-t border-border">
                                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                                        <HeartPulse className="h-4 w-4" />
                                        Sinais Vitais
                                    </h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                            <div className="flex items-center gap-2 text-red-700 mb-1">
                                                <Thermometer className="h-4 w-4" />
                                                <span className="text-xs font-semibold">Temperatura</span>
                                            </div>
                                            <p className="text-lg font-bold text-red-900">{r.vitalSigns.temperature || '--'} <span className="text-xs font-normal">°C</span></p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2 text-blue-700 mb-1">
                                                <Weight className="h-4 w-4" />
                                                <span className="text-xs font-semibold">Peso</span>
                                            </div>
                                            <p className="text-lg font-bold text-blue-900">{r.vitalSigns.weight || '--'} <span className="text-xs font-normal">kg</span></p>
                                        </div>
                                        <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                                            <div className="flex items-center gap-2 text-pink-700 mb-1">
                                                <Activity className="h-4 w-4" />
                                                <span className="text-xs font-semibold">Freq. Cardíaca</span>
                                            </div>
                                            <p className="text-lg font-bold text-pink-900">{r.vitalSigns.heartRate || '--'} <span className="text-xs font-normal">bpm</span></p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                            <div className="flex items-center gap-2 text-green-700 mb-1">
                                                <Waves className="h-4 w-4" />
                                                <span className="text-xs font-semibold">Freq. Respiratória</span>
                                            </div>
                                            <p className="text-lg font-bold text-green-900">{r.vitalSigns.respiratoryRate || '--'} <span className="text-xs font-normal">rpm</span></p>
                                        </div>
                                    </div>
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
