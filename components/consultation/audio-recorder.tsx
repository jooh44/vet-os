'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Loader2, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
    onAudioReady: (blob: Blob) => void;
}

export function AudioRecorder({ onAudioReady }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onAudioReady(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Determine supported mime type
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                onAudioReady(blob);
                if (timerRef.current) clearInterval(timerRef.current);
                setDuration(0);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Erro ao acessar o microfone. Verifique as permissões.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="w-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted/70">
            <CardContent className="flex flex-col items-center justify-center p-10 gap-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="audio/*"
                    onChange={handleFileChange}
                />

                <div className={cn(
                    "flex items-center justify-center h-24 w-24 rounded-full transition-all duration-500",
                    isRecording ? "bg-red-100 animate-pulse ring-4 ring-red-50" : "bg-primary/10"
                )}>
                    {isRecording ? (
                        <Mic className="h-10 w-10 text-red-600" />
                    ) : (
                        <Mic className="h-10 w-10 text-primary" />
                    )}
                </div>

                <div className="text-center space-y-2">
                    {isRecording ? (
                        <>
                            <h3 className="text-xl font-semibold text-red-600 animate-pulse">Gravando...</h3>
                            <p className="text-3xl font-mono text-foreground font-medium tracking-wider">
                                {formatTime(duration)}
                            </p>
                            <p className="text-sm text-muted-foreground">Fale claramente sobre o paciente</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold">Toque para Gravar ou Envie Arq.</h3>
                            <p className="text-sm text-muted-foreground">Suporta MP3, WAV, ou gravações do WhatsApp</p>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                    {!isRecording ? (
                        <>
                            <Button
                                size="lg"
                                className="w-full gap-2 rounded-full h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                onClick={startRecording}
                            >
                                <Mic className="h-5 w-5" />
                                Iniciar Gravação
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full gap-2 rounded-full h-12 text-base border-primary/20 hover:bg-primary/5"
                                onClick={triggerFileUpload}
                            >
                                <UploadCloud className="h-5 w-5" />
                                Carregar Áudio
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="lg"
                            variant="destructive"
                            className="w-full gap-2 rounded-full h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            onClick={stopRecording}
                        >
                            <Square className="h-5 w-5 fill-current" />
                            Parar e Processar
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
