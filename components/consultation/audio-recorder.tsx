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
        <div className="flex flex-col items-center justify-center py-12 gap-8 animate-in fade-in zoom-in duration-500">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="audio/*"
                onChange={handleFileChange}
            />

            <div className="relative group">
                {/* Pulse Effects */}
                {isRecording && (
                    <>
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse blur-xl scale-125" />
                    </>
                )}

                {/* Main Button */}
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                        "relative z-10 flex items-center justify-center w-40 h-40 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-8",
                        isRecording
                            ? "bg-white border-red-500 hover:border-red-600"
                            : "bg-gradient-to-br from-primary to-primary/80 border-white hover:shadow-primary/50"
                    )}
                >
                    {isRecording ? (
                        <div className="flex flex-col items-center gap-1">
                            <Square className="h-12 w-12 text-red-500 fill-current" />
                            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Parar</span>
                        </div>
                    ) : (
                        <Mic className="h-16 w-16 text-white" />
                    )}
                </button>
            </div>

            <div className="text-center space-y-2">
                <div className={cn(
                    "text-4xl font-mono font-bold tracking-wider transition-colors",
                    isRecording ? "text-red-500" : "text-muted-foreground/50"
                )}>
                    {formatTime(duration)}
                </div>
                {!isRecording && (
                    <p className="text-lg font-medium text-muted-foreground">
                        Toque para iniciar a consulta
                    </p>
                )}
            </div>

            {/* Upload Option (Secondary) */}
            {!isRecording && (
                <button
                    onClick={triggerFileUpload}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-full hover:bg-muted"
                >
                    <UploadCloud className="h-4 w-4" />
                    <span>Ou carregue um arquivo de áudio</span>
                </button>
            )}
        </div>
    );
}
