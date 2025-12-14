'use client';

import { usePageContext } from '@/hooks/use-page-context';

interface FredPetContextProps {
    pet: {
        id: string;
        name: string;
        species: string;
        breed?: string | null;
        weight?: number | null;
        birthDate?: Date | null;
        tutorName: string;
    };
    medicalRecords?: any[];
}

export function FredPetContext({ pet, medicalRecords = [] }: FredPetContextProps) {
    usePageContext({
        type: 'pet_profile',
        data: {
            ...pet,
            age: pet.birthDate
                ? `${new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} anos`
                : 'Unknown',
            last_medical_records: medicalRecords.slice(0, 5).map(r => ({
                date: r.date,
                title: r.title,
                notes: r.notes
            }))
        },
        description: `Viewing profile of ${pet.name}, a ${pet.species} (${pet.breed}). Tutor: ${pet.tutorName}.
        Recent Medical History: 
        ${medicalRecords.slice(0, 5).map(r =>
            `- ${new Date(r.date).toLocaleDateString()}: ${r.title} (${r.notes})`
        ).join('\n')}`
    });

    return null; // This component doesn't render anything visible
}
