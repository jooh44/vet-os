'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateMedicalRecordHTML } from '@/app/lib/document-generator';

export function DownloadButton({ record }: { record: any }) {

    const handleDownload = () => {
        const htmlContent = generateMedicalRecordHTML({
            ...record,
            date: new Date(record.date).toLocaleDateString('pt-BR')
        });

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Prontuario-${record.patientName}-${new Date(record.date).toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90 text-white shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF / Imprimir
        </Button>
    );
}
