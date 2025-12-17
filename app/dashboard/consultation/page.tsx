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
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-4xl font-normal text-primary flex items-center gap-3">
                        Nova Consulta
                    </h1>

                    {/* Mode Toggle */}
                    <div className="bg-muted p-1 rounded-lg flex gap-1">
                        <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground shadow-sm font-medium hover:bg-primary/90">
                            Presencial
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent" disabled>
                            Telemedicina (Em Breve)
                        </Button>
                    </div>
                </div>

                <p className="text-muted-foreground text-lg">
                    Grave a conversa ou dite os sintomas. A IA estruturará o prontuário para você.
                </p>

                {/* Compliance Warning (Mock for Telemedicina availability) */}
                {/* <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md flex items-start gap-3 text-sm">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <div>
                        <p className="font-bold">Termo de Consentimento Pendente</p>
                        <p>O tutor ainda não assinou os termos para Telemedicina. <Button variant="link" className="h-auto p-0 underline text-yellow-900">Enviar link para assinatura</Button></p>
                    </div>
                </div> */}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column: Process */}
                <div className="space-y-6">

                    {/* Step 1: Select Patient */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-normal flex items-center gap-2">
                            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-base">1</div>
                            Selecione o Paciente
                        </h2>
                        <AsyncPatientSelect onSelect={(id, name) => setSelectedPet({ id, name })} />
                        {selectedPet && (
                            <div className="text-sm text-primary bg-primary/10 p-2 rounded border border-primary/20">
                                Paciente selecionado: <strong>{selectedPet.name}</strong>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Audio */}
                    {selectedPet && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-normal flex items-center gap-2">
                                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-base">2</div>
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
                                                    className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
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
                        <Card className="border-green-200/50 bg-white/80 dark:bg-green-900/10 shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <CardHeader className="border-b border-border/5 bg-muted/20 pb-6">
                                <CardTitle className="flex items-center gap-3 text-2xl text-green-700 dark:text-green-400">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    Revisão do Prontuário
                                </CardTitle>
                                <CardDescription className="text-base ml-12">
                                    Confirme os dados extraídos pela IA antes de salvar no histórico.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <form action={handleSaveRecord} className="space-y-8">
                                    <input type="hidden" name="petId" value={selectedPet?.id || ''} />

                                    <div className="grid gap-2 p-4 bg-muted/30 rounded-xl border border-border/50 focus-within:ring-2 ring-primary/20 transition-all">
                                        <Label htmlFor="anamnesis" className="text-base font-semibold text-primary">Anamnese / Queixa Principal</Label>
                                        <Textarea
                                            id="anamnesis"
                                            name="anamnesis"
                                            defaultValue={aiData.anamnesis}
                                            className="min-h-[120px] border-0 bg-transparent text-lg leading-relaxed focus-visible:ring-0 resize-none p-0 shadow-none placeholder:text-muted-foreground/30 break-words whitespace-pre-wrap"
                                            placeholder="Descreva o histórico do paciente..."
                                        />
                                    </div>

                                    <div className="grid gap-2 p-4 bg-muted/30 rounded-xl border border-border/50 focus-within:ring-2 ring-primary/20 transition-all">
                                        <Label htmlFor="physicalExam" className="text-base font-semibold text-primary">Exame Físico</Label>
                                        <Textarea
                                            id="physicalExam"
                                            name="physicalExam"
                                            defaultValue={aiData.physicalExam}
                                            className="min-h-[120px] border-0 bg-transparent text-lg leading-relaxed focus-visible:ring-0 resize-none p-0 shadow-none placeholder:text-muted-foreground/30 break-words whitespace-pre-wrap"
                                            placeholder="Descreva os achados físicos..."
                                        />
                                    </div>

                                    {/* Vital Signs Review - Mini Cards */}
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold text-primary/80 flex items-center gap-2">
                                            <BrainCircuit className="h-4 w-4" />
                                            Sinais Vitais (Extraídos)
                                        </Label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Temperatura */}
                                            <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center gap-1 hover:border-primary/30 transition-colors">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Temp</span>
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <Input
                                                        id="vital_temp"
                                                        name="vital_temp"
                                                        defaultValue={aiData.vitalSigns?.temperature}
                                                        className="w-full text-center border-none p-0 h-auto text-3xl font-bold bg-transparent focus-visible:ring-0 text-foreground"
                                                        placeholder="-"
                                                        step="0.1"
                                                        type="number"
                                                    />
                                                    <span className="text-xs font-medium text-muted-foreground mt-[-4px]">°C</span>
                                                </div>
                                            </div>

                                            {/* Peso */}
                                            <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center gap-1 hover:border-primary/30 transition-colors">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peso</span>
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <Input
                                                        id="vital_weight"
                                                        name="vital_weight"
                                                        defaultValue={aiData.vitalSigns?.weight}
                                                        className="w-full text-center border-none p-0 h-auto text-3xl font-bold bg-transparent focus-visible:ring-0 text-foreground"
                                                        placeholder="-"
                                                        step="0.01"
                                                        type="number"
                                                    />
                                                    <span className="text-xs font-medium text-muted-foreground mt-[-4px]">kg</span>
                                                </div>
                                            </div>

                                            {/* Freq Cardíaca */}
                                            <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center gap-1 hover:border-primary/30 transition-colors">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">F. Card.</span>
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <Input
                                                        id="vital_hr"
                                                        name="vital_hr"
                                                        defaultValue={aiData.vitalSigns?.heartRate}
                                                        className="w-full text-center border-none p-0 h-auto text-3xl font-bold bg-transparent focus-visible:ring-0 text-foreground"
                                                        placeholder="-"
                                                        type="number"
                                                    />
                                                    <span className="text-xs font-medium text-muted-foreground mt-[-4px]">bpm</span>
                                                </div>
                                            </div>

                                            {/* Freq Respiratória */}
                                            <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center gap-1 hover:border-primary/30 transition-colors">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">F. Resp.</span>
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <Input
                                                        id="vital_rr"
                                                        name="vital_rr"
                                                        defaultValue={aiData.vitalSigns?.respiratoryRate}
                                                        className="w-full text-center border-none p-0 h-auto text-3xl font-bold bg-transparent focus-visible:ring-0 text-foreground"
                                                        placeholder="-"
                                                        type="number"
                                                    />
                                                    <span className="text-xs font-medium text-muted-foreground mt-[-4px]">rpm</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg">
                                        <Label htmlFor="diagnosis" className="text-primary font-bold uppercase tracking-wide text-xs">Suspeita Diagnóstica</Label>
                                        <Textarea
                                            id="diagnosis"
                                            name="diagnosis"
                                            defaultValue={aiData.diagnosis}
                                            className="font-heading text-xl font-bold border-none bg-transparent shadow-none p-0 min-h-[60px] focus-visible:ring-0 text-foreground resize-none leading-tight"
                                        />
                                    </div>

                                    <div className="grid gap-2 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                        <Label htmlFor="prescription" className="text-amber-800 font-medium flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-amber-600" />
                                            Prescrição Sugerida
                                        </Label>
                                        <Textarea
                                            id="prescription"
                                            name="prescription"
                                            defaultValue={aiData.prescription}
                                            className="min-h-[150px] text-base bg-white/50 border-amber-200/50 focus-visible:ring-amber-500/20 text-gray-800 leading-relaxed rounded-lg p-3"
                                        />
                                    </div>

                                    <SubmitButton className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all rounded-xl font-serif font-normal tracking-wide">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Salvar Prontuário
                                    </SubmitButton>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-3xl bg-muted/5 p-8 text-center gap-4 animate-in fade-in duration-700">
                            <div className="p-4 bg-muted rounded-full">
                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="font-normal text-2xl text-foreground">Aguardando Consulta</h3>
                                <p className="text-muted-foreground">Inicie a gravação para que a IA possa gerar o prontuário automaticamente aqui.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
