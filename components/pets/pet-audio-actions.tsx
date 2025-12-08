'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioRecorder } from '@/components/consultation/audio-recorder';
import { Mic, Send, Trash2 } from 'lucide-react';
import { saveAudioToStore } from '@/lib/audio-store';
import { toast } from 'sonner';

import { saveQuickNote } from '@/app/lib/actions';

interface PetAudioActionsProps {
    petId: string;
    petName: string;
}

export function PetAudioActions({ petId, petName }: PetAudioActionsProps) {
    const router = useRouter();
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showRecorder, setShowRecorder] = useState(false);

    const handleAudioReady = (blob: Blob) => {
        setRecordedBlob(blob);
    };

    const handleSaveQuickNote = async () => {
        if (!recordedBlob) return;
        setIsSaving(true);
        try {
            const formData = new FormData();
            const extension = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
            formData.append('audio', recordedBlob, `quick-note.${extension}`);
            formData.append('petId', petId);

            const result = await saveQuickNote(formData);

            if (result.success) {
                toast.success("Anotação salva no histórico!");
                setRecordedBlob(null);
                setShowRecorder(false);
            } else {
                toast.error("Erro ao salvar: " + result.error);
            }
        } catch (error) {
            toast.error("Erro inesperado ao salvar anotação.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartConsultation = async () => {
        if (!recordedBlob) return;
        setIsSaving(true);
        try {
            // Use a unique ID for this recording session
            const audioId = `pending_audio_${petId}_${Date.now()}`;

            // Save to IndexedDB
            await saveAudioToStore(audioId, recordedBlob);

            // Navigate to consultation page with params
            const params = new URLSearchParams({
                petId,
                petName,
                audioId // Pass the reference ID
            });

            toast.success("Redirecionando para consulta...");
            router.push(`/dashboard/consultation?${params.toString()}`);

        } catch (error) {
            toast.error("Erro ao preparar áudio.");
            setIsSaving(false);
        }
    };

    if (!showRecorder) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4 bg-white hover:bg-slate-50 text-slate-900 border-2 border-primary/20 hover:border-primary/50 shadow-sm group transition-all"
                onClick={() => setShowRecorder(true)}
            >
                <div className="bg-primary/10 group-hover:bg-primary/20 p-2.5 rounded-full transition-colors">
                    <Mic className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="font-bold text-base text-primary">Anotação Rápida</span>
                    <span className="text-xs text-muted-foreground text-left whitespace-normal font-medium leading-tight">
                        Clique para gravar uma observação.
                    </span>
                </div>
            </Button>
        );
    }

    return (
        <Card className="border-secondary/20 bg-secondary/5 animate-in fade-in slide-in-from-top-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex justify-between items-center">
                    Anotação de Voz
                    <Button variant="ghost" size="sm" onClick={() => setShowRecorder(false)}>
                        Cancelar
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!recordedBlob ? (
                    <AudioRecorder onAudioReady={handleAudioReady} />
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-background rounded-lg border flex flex-col gap-2">
                            <audio
                                src={URL.createObjectURL(recordedBlob)}
                                controls
                                className="w-full h-8"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleSaveQuickNote}
                                disabled={isSaving}
                            >
                                {isSaving ? "Processando..." : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Salvar como Anotação
                                    </>
                                )}
                            </Button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OU</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full border-primary/30 text-primary hover:bg-primary/5"
                                onClick={handleStartConsultation}
                                disabled={isSaving}
                            >
                                <Mic className="mr-2 h-4 w-4" />
                                Iniciar Consulta Completa
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground"
                                onClick={() => setRecordedBlob(null)}
                                disabled={isSaving}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Descartar
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
