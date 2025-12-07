'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Edit2, Save, FileText, Syringe, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { updatePetMedicalInfo } from "@/app/actions/pets";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MedicalAlertsCardProps {
    petId: string;
    initialAllergies: string | null;
    initialNotes: string | null;
}

export function MedicalAlertsCard({ petId, initialAllergies, initialNotes }: MedicalAlertsCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [allergies, setAllergies] = useState(initialAllergies || "");
    const [notes, setNotes] = useState(initialNotes || "");

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updatePetMedicalInfo(petId, {
                allergies: allergies.trim() || undefined,
                notes: notes.trim() || undefined
            });

            if (result.success) {
                toast.success("Informações médicas atualizadas!");
                setIsEditing(false);
            } else {
                toast.error("Erro ao atualizar informações.");
            }
        } catch (error) {
            toast.error("Erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-full border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Alertas e Observações
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isLoading}
                >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4 text-muted-foreground" />}
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Allergies Section */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Syringe className="h-3 w-3" /> Alergias
                    </label>
                    {isEditing ? (
                        <Textarea
                            placeholder="Ex: Dipirona, Frango, Picada de abelha..."
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            className="bg-white min-h-[60px]"
                        />
                    ) : (
                        allergies ? (
                            <Alert variant="destructive" className="py-2 bg-red-50 border-red-200 text-red-800">
                                <AlertTitle className="text-sm font-bold flex items-center gap-2">
                                    <AlertTriangle className="h-3 w-3" /> Atenção
                                </AlertTitle>
                                <AlertDescription className="text-sm">
                                    {allergies}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Nenhuma alergia registrada.</p>
                        )
                    )}
                </div>

                {/* Notes/Warnings Section */}
                <div className="space-y-1.5 pt-2 border-t">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" /> Observações Importantes
                    </label>
                    {isEditing ? (
                        <Textarea
                            placeholder="Ex: Cardiopata, Reativo com machos, Medroso..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-white min-h-[80px]"
                        />
                    ) : (
                        notes ? (
                            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 text-sm text-yellow-900">
                                {notes}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Nenhuma observação adicional.</p>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
