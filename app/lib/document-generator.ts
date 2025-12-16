// Helper to safely format vitals
function formatVital(value: any, unit: string) {
    if (!value) return '--';
    return `${value} ${unit}`;
}

export function generateMedicalRecordHTML(record: any) {
    const {
        patientName,
        tutorName,
        date,
        anamnesis,
        physicalExam,
        diagnosis,
        prescription,
        vitalSigns
    } = record;

    const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Generate Vitals HTML
    let vitalsHtml = '';
    if (vitalSigns && Object.keys(vitalSigns).length > 0) {
        vitalsHtml = `
        <div class="vitals-container">
            <h3 class="subsection-title">Sinais Vitais</h3>
            <div class="vitals-grid">
                <div class="vital-card temp">
                    <span class="vital-label">Temperatura</span>
                    <span class="vital-value">${formatVital(vitalSigns.temperature, '°C')}</span>
                </div>
                <div class="vital-card weight">
                    <span class="vital-label">Peso</span>
                    <span class="vital-value">${formatVital(vitalSigns.weight, 'kg')}</span>
                </div>
                <div class="vital-card hr">
                    <span class="vital-label">Freq. Cardíaca</span>
                    <span class="vital-value">${formatVital(vitalSigns.heartRate, 'bpm')}</span>
                </div>
                <div class="vital-card rr">
                    <span class="vital-label">Freq. Respiratória</span>
                    <span class="vital-value">${formatVital(vitalSigns.respiratoryRate, 'rpm')}</span>
                </div>
            </div>
        </div>
        `;
    }

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prontuário - ${patientName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@700&display=swap');

        :root {
            --primary: hsl(154, 14%, 49%); /* Warm Sage */
            --secondary: hsl(154, 25%, 75%); /* Lighter Sage (Text/Accents) */
            --accent: hsl(154, 20%, 97%); /* Very Light Sage Background */
            --text: hsl(154, 10%, 10%); /* Dark Green/Gray */
            --border: hsl(154, 10%, 90%);
        }

        body {
            font-family: 'Roboto', sans-serif;
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: #fff;
        }

        .page {
            max-width: 800px;
            margin: 0 auto;
        }

        /* Header */
        header {
            border-bottom: 2px solid var(--primary);
            padding-bottom: 20px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .logo h1 {
            font-family: 'Playfair Display', serif;
            color: var(--primary);
            margin: 0;
            font-size: 32px;
        }
        .logo p {
            margin: 0;
            color: var(--secondary);
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .meta {
            text-align: right;
            font-size: 12px;
            color: var(--secondary);
        }

        /* Patient Info Box */
        .patient-box {
            background: var(--accent);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 40px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .info-label {
            font-size: 10px;
            text-transform: uppercase;
            color: var(--secondary);
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .info-value {
            font-size: 16px;
            font-weight: 500;
            color: #0f172a;
        }

        /* Content Sections */
        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--primary);
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
            margin-bottom: 15px;
        }

        .content {
            font-size: 15px;
            text-align: justify;
            white-space: pre-wrap;
        }

        /* Vitals Grid */
        .vitals-container {
            margin-top: 20px;
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 15px;
        }

        .subsection-title {
            margin: 0 0 10px 0;
            font-size: 12px;
            text-transform: uppercase;
            color: var(--secondary);
        }

        .vitals-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .vital-card {
            padding: 10px;
            border-radius: 6px;
            text-align: center;
        }
        
        .vital-card.temp { background: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; }
        .vital-card.weight { background: #eff6ff; border: 1px solid #dbeafe; color: #1e40af; }
        .vital-card.hr { background: #fdf2f8; border: 1px solid #fce7f3; color: #9d174d; }
        .vital-card.rr { background: #f0fdf4; border: 1px solid #dcfce7; color: #166534; }

        .vital-label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            opacity: 0.8;
            margin-bottom: 4px;
        }

        .vital-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
        }

        /* Highlight Boxes */
        .diagnosis-box {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            color: #92400e;
        }

        .prescription-box {
            font-family: 'Courier New', monospace;
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            padding: 20px;
            font-size: 14px;
        }

        /* Footer */
        footer {
            margin-top: 60px;
            border-top: 1px solid var(--border);
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: var(--secondary);
        }
        
        .signature-line {
            width: 200px;
            border-top: 1px solid #000;
            margin-top: 40px;
            padding-top: 5px;
            text-align: center;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            body { padding: 10px; }
            .page { padding: 20px; }
            .vitals-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
            header { flex-direction: column; align-items: flex-start; gap: 15px; }
            .meta { text-align: left; margin-top: 5px; }
            .patient-box { grid-template-columns: 1fr; gap: 15px; }
            footer { flex-direction: column; gap: 20px; align-items: flex-start; }
            .signature-line { width: 100%; margin-top: 20px; }
        }
    </style>
</head>
<body>
    <div class="page">
        <header>
            <div class="logo">
                <h1>FRED VETERINARY</h1>
                <p>Clinical Copilot</p>
            </div>
            <div class="meta">
                PRONTUÁRIO #${record.id.substring(0, 8).toUpperCase()}<br>
                DATA: ${formattedDate}
            </div>
        </header>

        <div class="patient-box">
            <div>
                <div class="info-label">Paciente</div>
                <div class="info-value">${patientName}</div>
            </div>
            <div>
                <div class="info-label">Tutor</div>
                <div class="info-value">${tutorName}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Anamnese</div>
            <div class="content">${anamnesis || 'Não informado.'}</div>
        </div>

        <div class="section">
            <div class="section-title">Exame Físico</div>
            <div class="content">
                ${physicalExam || 'Não informado.'}
                ${vitalsHtml}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Diagnóstico</div>
            <div class="content diagnosis-box">
                ${diagnosis || 'Em análise.'}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Prescrição</div>
            <div class="content prescription-box">
                ${prescription || 'Sem prescrição.'}
            </div>
        </div>

        <footer>
            <div>
                <strong>Fred Veterinary Clinic</strong><br>
                Tecnologia e Cuidado para seu pet.
            </div>
            <div class="signature-line">
                Assinatura do Veterinário
            </div>
        </footer>
    </div>
</body>
</html>
    `;
}
