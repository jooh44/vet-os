'use client';

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, PawPrint } from "lucide-react";
import { uploadPetPhoto } from "@/app/actions/upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PetPhotoUploaderProps {
    petId: string;
    currentPhotoUrl: string | null;
    petName: string;
}

export function PetPhotoUploader({ petId, currentPhotoUrl, petName }: PetPhotoUploaderProps) {
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadPetPhoto(petId, formData);

            if (result.success && result.photoUrl) {
                setPhotoUrl(result.photoUrl);
                toast.success("Foto atualizada com sucesso!");
            } else {
                toast.error(result.error || "Erro ao atualizar foto.");
            }
        } catch (error) {
            toast.error("Erro inesperado ao enviar arquivo.");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <Avatar className={cn(
                "h-24 w-24 border-4 border-white shadow-lg transition-all duration-300",
                isHovered ? "brightness-75" : ""
            )}>
                {photoUrl ? (
                    <AvatarImage src={photoUrl} alt={petName} className="object-cover" />
                ) : (
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                        <PawPrint className="h-10 w-10" />
                    </AvatarFallback>
                )}
            </Avatar>

            {/* Overlay / Indicator */}
            <div className={cn(
                "absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300",
                isHovered || isUploading ? "opacity-100" : "opacity-0"
            )}>
                {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                    <div className="bg-black/50 p-2 rounded-full">
                        <Camera className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {isHovered && !isUploading && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-muted-foreground whitespace-nowrap bg-white/90 px-2 py-0.5 rounded shadow-sm">
                    Alterar Foto
                </span>
            )}
        </div>
    );
}
