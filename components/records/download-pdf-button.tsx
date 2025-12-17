'use client';

import { Button } from '@/components/ui/button';
import { generateMedicalRecordHTML } from '@/app/lib/document-generator';
import { Download, FileText } from 'lucide-react';

interface DownloadPdfButtonProps {
    record: any; // Using any for flexibility with the enriched record object
}

export function DownloadPdfButton({ record }: DownloadPdfButtonProps) {
    const handleDownload = () => {
        try {
            // Generate HTML
            const htmlContent = generateMedicalRecordHTML({
                ...record,
                patientName: record.pet.name,
                tutorName: record.pet.tutor.user.name,
                date: new Date(record.date).toISOString() // Ensure date format matches expectations
            });

            // Trigger Download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Prontuario-${record.pet.name}-${new Date(record.date).toISOString().split('T')[0]}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download Error:', error);
            alert('Erro ao gerar PDF: ' + String(error));
        }
    };

    return (
        <Button onClick={handleDownload} variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
            <Download className="h-4 w-4" />
            Baixar PDF
        </Button>
    );
}
