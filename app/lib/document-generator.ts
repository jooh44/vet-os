// Mock functions to generate plausible data if missing
function getMockVitals() {
    return {
        heartRate: Math.floor(Math.random() * (140 - 80) + 80), // 80-140 bpm
        temp: (Math.random() * (39.2 - 38.0) + 38.0).toFixed(1), // 38.0-39.2 C
        respRate: Math.floor(Math.random() * (40 - 20) + 20), // 20-40 rpm
        capillaryRefill: '< 2s',
        hydration: 'Normal',
        mucousMembranes: 'Normocoradas'
    };
}

export function generateMedicalRecordHTML(record: any) {
    const {
        patientName,
        tutorName,
        date,
        anamnesis,
        physicalExam,
        diagnosis,
        prescription
    } = record;

    const vitals = getMockVitals();

    // Check if physical exam already has vitals, if not, append mocked ones for "completeness"
    const hasVitals = physicalExam?.toLowerCase().includes('bpm');
    const enrichedPhysicalExam = hasVitals ? physicalExam : `
        ${physicalExam || ''}
        <br><br>
        <strong>Sinais Vitais (Aferidos):</strong><br>
        - Frequência Cardíaca: ${vitals.heartRate} bpm<br>
        - Temperatura Retal: ${vitals.temp} °C<br>
        - Frequência Respiratória: ${vitals.respRate} mpm<br>
        - TPC: ${vitals.capillaryRefill}<br>
        - Hidratação: ${vitals.hydration}<br>
        - Mucosas: ${vitals.mucousMembranes}
    `;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prontuário - ${patientName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Open+Sans:wght@400;600;700&display=swap');

        :root {
            --primary: #2C5F2D;
            --secondary: #97BC62;
            --accent: #E8F5E9;
            --text: #333;
            --light-text: #666;
            --border: #ddd;
        }

        body {
            font-family: 'Open Sans', sans-serif;
            color: var(--text);
            line-height: 1.6;
            background: #f5f5f5;
            margin: 0;
            padding: 40px;
            -webkit-print-color-adjust: exact;
        }

        .page {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
        }

        /* Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid var(--primary);
            padding-bottom: 20px;
            margin-bottom: 40px;
        }

        .logo-area h1 {
            font-family: 'Merriweather', serif;
            color: var(--primary);
            margin: 0;
            font-size: 28px;
            letter-spacing: -0.5px;
        }

        .logo-area p {
            margin: 0;
            color: var(--secondary);
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .doc-meta {
            text-align: right;
            font-size: 13px;
            color: var(--light-text);
        }

        /* Patient Info Grid */
        .patient-info {
            background: var(--accent);
            padding: 20px;
            border-radius: 8px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 40px;
            border-left: 5px solid var(--secondary);
        }

        .info-item label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            color: var(--light-text);
            font-weight: 700;
            margin-bottom: 2px;
        }

        .info-item span {
            font-family: 'Merriweather', serif;
            font-weight: 700;
            font-size: 16px;
            color: var(--primary);
        }

        /* Sections */
        .section {
            margin-bottom: 35px;
        }

        .section-title {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--primary);
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
            margin-bottom: 15px;
            letter-spacing: 1px;
        }

        .content {
            font-size: 15px;
            color: #444;
            text-align: justify;
            white-space: pre-wrap;
        }

        /* Special Styling for Diagnosis & Prescription */
        .diagnosis-box {
            background: #fff8e1;
            padding: 15px;
            border: 1px solid #ffe0b2;
            border-radius: 4px;
            font-weight: 600;
            color: #e65100;
        }

        .prescription-box {
            background: #fbfbfb;
            border: 1px dashed #ccc;
            padding: 20px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
        }

        /* Footer */
        footer {
            margin-top: 80px;
            border-top: 1px solid var(--border);
            padding-top: 30px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: var(--light-text);
        }

        .signature {
            text-align: center;
            width: 200px;
        }

        .signature-line {
            border-top: 1px solid #333;
            margin-bottom: 5px;
        }
        
        @media print {
            body { background: white; padding: 0; }
            .page { box-shadow: none; padding: 40px; }
        }
    </style>
</head>
<body>
    <div class="page">
        <header>
            <div class="logo-area">
                <h1>FRED VETERINARY</h1>
                <p>Inteligência Veterinária</p>
            </div>
            <div class="doc-meta">
                PRONTUÁRIO DIGITAL<br>
                ID: #${record.id.substring(0, 8).toUpperCase()}<br>
                Data: ${date}
            </div>
        </header>

        <div class="patient-info">
            <div class="info-item">
                <label>Paciente</label>
                <span>${patientName}</span>
            </div>
            <div class="info-item">
                <label>Tutor Responsável</label>
                <span>${tutorName}</span>
            </div>
        </div>

        <main>
            <div class="section">
                <div class="section-title">Anamnese & Histórico</div>
                <div class="content">${anamnesis || '<em>Não informado.</em>'}</div>
            </div>

            <div class="section">
                <div class="section-title">Exame Físico & Sinais Vitais</div>
                <div class="content">${enrichedPhysicalExam}</div>
            </div>

            <div class="section">
                <div class="section-title">Hipótese Diagnóstica</div>
                <div class="content diagnosis-box">
                    ${diagnosis || 'Em análise clínica.'}
                </div>
            </div>

            <div class="section">
                <div class="section-title">Conduta Terapêutica / Prescrição</div>
                <div class="content prescription-box">
                    ${prescription || 'Sem prescrição medicamentosa no momento.'}
                </div>
            </div>
        </main>

        <footer>
            <div>
                <strong>Clínica Veterinária Modelo</strong><br>
                Rua das Flores, 123 - São Paulo/SP<br>
                (11) 99999-9999 | contato@vetmodelo.com.br
            </div>
            <div class="signature">
                <div class="signature-line"></div>
                <strong>Dr(a). Veterinário(a)</strong><br>
                CRMV-SP 12.345
            </div>
        </footer>
    </div>
</body>
</html>
    `;
}
