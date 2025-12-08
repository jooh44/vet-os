'use client';

import { useState } from 'react';
import { AudioRecorder } from '@/components/consultation/audio-recorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileText, Sparkles, BrainCircuit } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';

import { useEffect } from 'react';
import { getAudioFromStore, deleteAudioFromStore } from '@/lib/audio-store';
import { processConsultationAudio } from '@/app/lib/ai-actions';
import { createMedicalRecord } from '@/app/lib/actions';
import { generateMedicalRecordHTML } from '@/app/lib/document-generator';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

import { AsyncPatientSelect } from '@/components/patients/async-patient-select';

import { useSearchParams } from 'next/navigation';

export default function NewConsultationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Auto-select pet from URL if available
    const initialPetId = searchParams.get('petId');
    const initialPetName = searchParams.get('petName');

    const [selectedPet, setSelectedPet] = useState<{ id: string, name: string } | null>(
        initialPetId && initialPetName ? { id: initialPetId, name: initialPetName } : null
    );

    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [aiData, setAiData] = useState<any>(null);

    // Auto-load audio from IndexedDB if audioId is present
    const audioId = searchParams.get('audioId');
    const { getAudioFromStore, deleteAudioFromStore } = require('@/lib/audio-store'); // Dynamic import or require inside effect is tricky with server components vs client
    // Actually standard import at top is fine, but let's use useEffect

    // We need to import at top level really

    const handleAudioReady = (blob: Blob) => {
        setAudioBlob(blob);
        console.log('Audio ready:', blob.size, 'bytes', blob instanceof File ? blob.name : 'recorded');
    };

    useEffect(() => {
        if (audioId) {
            getAudioFromStore(audioId).then((blob: Blob | null) => {
                if (blob) {
                    setAudioBlob(blob);
                    console.log('Loaded audio from store:', audioId);
                    // Optional: Clean up store to assume ownership? Or keep it?
                    // Let's keep it until transcribed or explicit delete? 
                    // To keep it simple, we don't delete immediately.
                }
            });
        }
    }, [audioId]);

    const handleTranscribe = async () => {
        if (!audioBlob) return;
        setIsTranscribing(true);
        setAiData(null);

        const formData = new FormData();
        // Determine extension from blob type
        let extension = 'webm';
        if (audioBlob.type.includes('mp4')) extension = 'mp4';
        else if (audioBlob.type.includes('wav')) extension = 'wav';
        else if (audioBlob.type.includes('ogg')) extension = 'ogg';

        const filename = audioBlob instanceof File ? audioBlob.name : `recording.${extension}`;
        formData.append('audio', audioBlob, filename);

        try {
            const result = await processConsultationAudio(formData);

            if (result.success) {
                console.log('AI Result:', result);
                setAiData(result.data); // Store structured data to show form
            } else {
                alert('Erro na análise: ' + result.error);
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert(`Erro ao enviar áudio: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleSaveRecord = async (formData: FormData) => {
        try {
            if (!selectedPet) {
                alert('Selecione um paciente primeiro.');
                return;
            }
            // Append petId manually if not present (though hidden input handles it)
            if (!formData.get('petId')) {
                formData.append('petId', selectedPet.id);
            }

            const result = await createMedicalRecord(formData);

            if (result.success && result.record) {
                // ... (download logic) ...
                // Generate HTML
                const htmlContent = generateMedicalRecordHTML({
                    ...result.record,
                    date: new Date(result.record.date).toLocaleDateString('pt-BR')
                });

                // Trigger Download
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Prontuario-${result.record.patientName}-${new Date().toISOString().split('T')[0]}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                alert('Prontuário salvo e download iniciado! Redirecionando para o perfil do paciente...');
                router.push(`/dashboard/pets/${selectedPet.id}`);
            } else {
                // Show specific error from server
                console.error('Server Error:', result.error);
                alert(`Erro ao salvar: ${result.error || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Save Error:', error);
            alert(`Erro crítico ao salvar: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-secondary" />
                    Nova Consulta Inteligente
                </h1>
                <p className="text-muted-foreground text-lg">
                    Grave a conversa ou dite os sintomas. A IA estruturará o prontuário para você.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column: Process */}
                <div className="space-y-6">

                    {/* Step 1: Select Patient */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</div>
                            Selecione o Paciente
                        </h2>
                        <AsyncPatientSelect onSelect={(id, name) => setSelectedPet({ id, name })} />
                        {selectedPet && (
                            <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                Paciente selecionado: <strong>{selectedPet.name}</strong>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Audio */}
                    {selectedPet && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</div>
                                Captura de Áudio
                            </h2>
                            {!audioBlob ? (
                                <AudioRecorder onAudioReady={handleAudioReady} />
                            ) : (
                                <Card className="border-secondary/20 bg-secondary/5">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Áudio Capturado</CardTitle>
                                        <CardDescription>Pronto para análise</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <audio
                                            src={URL.createObjectURL(audioBlob)}
                                            controls
                                            className="w-full"
                                        />
                                        <div className="flex gap-3">
                                            {!aiData && (
                                                <SubmitButton
                                                    onClick={handleTranscribe}
                                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:to-primary"
                                                >
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    {isTranscribing ? 'Analisando...' : 'Gerar Prontuário Inteligente'}
                                                </SubmitButton>
                                            )}
                                            <Button
                                                variant="outline"
                                                onClick={() => { setAudioBlob(null); setAiData(null); }}
                                            >
                                                Descartar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {isTranscribing && (
                        <Card className="border-primary/50 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                            <CardContent className="pt-6 text-center space-y-4">
                                <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                                <div>
                                    <h3 className="font-semibold text-lg">Analisando Áudio...</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Transcrevendo com Whisper<br />
                                        Estruturando com GPT-4o
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Review Form */}
                <div className="space-y-6">
                    {aiData ? (
                        <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10 animate-in fade-in duration-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <FileText className="h-5 w-5" />
                                    3. Revisão do Prontuário
                                </CardTitle>
                                <CardDescription>Confirme os dados extraídos antes de salvar.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={handleSaveRecord} className="space-y-4">
                                    <input type="hidden" name="petId" value={selectedPet?.id || ''} />
                                    <div className="grid gap-2">
                                        <Label htmlFor="anamnesis">Anamnese / Queixa</Label>
                                        <Textarea
                                            id="anamnesis"
                                            name="anamnesis"
                                            defaultValue={aiData.anamnesis}
                                            className="min-h-[200px]"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="physicalExam">Exame Físico</Label>
                                        <Textarea
                                            id="physicalExam"
                                            name="physicalExam"
                                            defaultValue={aiData.physicalExam}
                                            className="min-h-[150px]"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="diagnosis">Suspeita Diagnóstica</Label>
                                        <Input
                                            id="diagnosis"
                                            name="diagnosis"
                                            defaultValue={aiData.diagnosis}
                                            className="font-semibold text-lg"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="prescription">Prescrição / Tratamento</Label>
                                        <Textarea
                                            id="prescription"
                                            name="prescription"
                                            defaultValue={aiData.prescription}
                                            className="min-h-[200px] font-mono text-sm"
                                        />
                                    </div>

                                    <SubmitButton className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-md">
                                        Salvar no Prontuário
                                    </SubmitButton>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex items-center justify-center border-l border-dashed pl-8 text-muted-foreground italic">
                            O prontuário gerado aparecerá aqui para sua revisão.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
