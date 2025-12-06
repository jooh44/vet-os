import CreatePetForm from '@/components/pets/create-pet-form';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function NewPetPage({ params }: { params: { id: string } }) {
    const tutorId = params.id;

    // Verify tutor exists
    const tutor = await prisma.tutor.findUnique({
        where: { userId: tutorId }, // Wait, id in route is usually userId if we listed users? NO.
        // My schema has Tutor.id separate from User.id. 
        // In the URL I should use Tutor.id probably, or User.id and lookup.
        // Let's assume the ID passed in URL is the Tutor.id (UUID).
    });

    // Actually let's assume it IS the Tutor ID because we usually link t.id.
    // But checking if it exists is good practice.
    // If not found, try finding by UserID (fallback) or just 404.

    // Let's fetch the tutor to display name? 
    const tutorRecord = await prisma.tutor.findFirst({
        where: { OR: [{ id: tutorId }, { userId: tutorId }] },
        include: { user: true }
    });

    if (!tutorRecord) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl text-primary">
                    Novo Pet para {tutorRecord.user.name}
                </h1>
            </div>
            <CreatePetForm tutorId={tutorRecord.id} />
        </div>
    );
}
