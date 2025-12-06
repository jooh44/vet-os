import UnifiedPetForm from '@/components/pets/unified-pet-form';

export default function NewPatientPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl text-primary">Novo Paciente</h1>
            </div>
            <UnifiedPetForm />
        </div>
    );
}
