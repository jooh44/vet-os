'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, AlertCircle } from 'lucide-react';

const COMMON_DRUGS = [
    { name: 'Tramadol', dose: 2, unit: 'mg/kg' },
    { name: 'Dipirona', dose: 25, unit: 'mg/kg' },
    { name: 'Meloxicam', dose: 0.1, unit: 'mg/kg' },
    { name: 'Amoxicilina', dose: 15, unit: 'mg/kg' },
    { name: 'Metronidazol', dose: 15, unit: 'mg/kg' },
];

export default function CalculatorPage() {
    const [weight, setWeight] = useState<number | ''>('');

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Calculator className="h-8 w-8 text-primary" />
                    Calculadora
                </h1>
                <p className="text-muted-foreground">Digite o peso para calcular doses automaticamente.</p>
            </div>

            <Card className="bg-card shadow-md">
                <CardHeader>
                    <Label className="text-lg">Peso do Paciente (kg)</Label>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Ex: 5.4"
                            className="text-2xl h-14"
                            value={weight}
                            onChange={(e) => setWeight(parseFloat(e.target.value))}
                        />
                        <span className="text-xl font-bold text-muted-foreground">kg</span>
                    </div>
                </CardContent>
            </Card>

            {weight && typeof weight === 'number' && (
                <div className="grid gap-4 md:grid-cols-2">
                    {COMMON_DRUGS.map((drug) => (
                        <Card key={drug.name} className="overflow-hidden border-l-4 border-l-primary">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">{drug.name}</h3>
                                    <p className="text-sm text-muted-foreground">Dose pad: {drug.dose} {drug.unit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                        {(weight * drug.dose).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">mg</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="col-span-full mt-4 p-4 bg-amber-50 rounded-lg flex gap-2 text-amber-800 text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>Sempre confira a concentração do medicamento antes de administrar. Estas são doses padrão de referência.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
