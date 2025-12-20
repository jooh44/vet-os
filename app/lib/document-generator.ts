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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&display=swap');

        :root {
            /* VetOS Brand Colors (Matching App) */
            --primary: #6B8E7F; /* Warm Sage Green */
            --secondary: #D4A574; /* Warm Amber */
            --accent: #4A7A6C; /* Darker Sage for contrast */
            
            --bg-light: #F8FAFC;
            --text-dark: #1e293b;
            --text-light: #64748B;
            --border: #E2E8F0;
        }

        body {
            font-family: 'Poppins', sans-serif;
            color: var(--text-dark);
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
            border-bottom: 3px solid var(--primary);
            padding-bottom: 20px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .logo h1 {
            font-family: 'Space Grotesk', sans-serif;
            color: var(--secondary);
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -1px;
        }
        
        .logo h1 span {
            color: var(--primary);
        }

        .logo p {
            margin: 0;
            color: var(--text-light);
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 600;
        }

        .meta {
            text-align: right;
            font-size: 12px;
            color: var(--text-light);
            font-family: 'Space Grotesk', sans-serif;
        }

        /* Patient Info Box */
        .patient-box {
            background: var(--bg-light);
            border-left: 4px solid var(--secondary);
            border-radius: 0 8px 8px 0;
            padding: 24px;
            margin-bottom: 40px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .info-label {
            font-size: 11px;
            text-transform: uppercase;
            color: var(--text-light);
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .info-value {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--secondary);
        }

        /* Content Sections */
        .section {
            margin-bottom: 35px;
        }

        .section-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--primary);
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
            margin-bottom: 15px;
            letter-spacing: 0.5px;
        }

        .content {
            font-size: 15px;
            text-align: justify;
            white-space: pre-wrap;
            color: #334155;
        }

        /* Vitals Grid */
        .vitals-container {
            margin-top: 25px;
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .subsection-title {
            margin: 0 0 12px 0;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-light);
        }

        .vitals-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
        }

        .vital-card {
            padding: 12px;
            border-radius: 8px;
            text-align: center;
        }
        
        .vital-card.temp { background: #FFF7ED; color: #C2410C; }
        .vital-card.weight { background: #F8FAFC; color: #475569; }
        .vital-card.hr { background: #FDF2F8; color: #DB2777; }
        .vital-card.rr { background: #F0F9FF; color: #0284C7; }

        .vital-label {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 600;
            opacity: 0.7;
            margin-bottom: 4px;
        }

        .vital-value {
            display: block;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 18px;
            font-weight: 700;
        }

        /* Highlight Boxes */
        .diagnosis-box {
            background: #FFF7ED;
            border-left: 4px solid var(--primary);
            padding: 16px;
            color: #9A3412;
            border-radius: 0 8px 8px 0;
            font-weight: 500;
        }

        .prescription-box {
            font-family: 'Courier New', monospace;
            background: #FFFBEB;
            color: #78350F;
            border: 1px solid #FCD34D;
            border-radius: 8px;
            padding: 24px;
            font-size: 14px;
            line-height: 1.6;
        }

        /* Footer */
        footer {
            margin-top: 80px;
            border-top: 1px solid var(--border);
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: var(--text-light);
        }
        
        .signature-line {
            width: 250px;
            border-top: 1px solid var(--secondary);
            margin-top: 40px;
            padding-top: 8px;
            text-align: center;
            font-weight: 500;
            color: var(--secondary);
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            body { padding: 20px; }
            .page { padding: 0; }
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
                <h1>VET<span>.OS</span></h1>
                <p>Digital Intelligence for Vets</p>
            </div>
            <div class="meta">
                <strong>PRONTUÁRIO DIGITAL</strong><br>
                ID: #${record.id.substring(0, 8).toUpperCase()}<br>
                DATA: ${formattedDate}
            </div>
        </header>

        <div class="patient-box">
            <div>
                <div class="info-label">Paciente</div>
                <div class="info-value">${patientName}</div>
            </div>
            <div>
                <div class="info-label">Tutor (Responsável)</div>
                <div class="info-value">${tutorName}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Anamnese & Queixa Principal</div>
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
            <div class="section-title">Prescrição e Conduta</div>
            <div class="content prescription-box">
                ${prescription || 'Sem prescrição.'}
            </div>
        </div>

        <footer>
            <div>
                <strong>Gerado por Vet.OS</strong><br>
                Tecnologia de ponta para cuidados veterinários.
            </div>
            <div class="signature-line">
                Assinatura do Médico Veterinário
            </div>
        </footer>
    </div>
</body>
</html>
    `;
}
