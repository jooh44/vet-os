import CreateTutorForm from '@/components/tutors/create-tutor-form';

export default function NewTutorPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-normal text-primary">Cadastro de Tutor</h1>
            </div>
            <CreateTutorForm />
        </div>
    );
}
