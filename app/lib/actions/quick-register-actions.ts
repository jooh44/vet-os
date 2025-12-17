'use server';

import prisma from '@/lib/prisma';
import { Species, Role } from '@prisma/client';
import { hash } from 'bcryptjs'; // Need to check if bcryptjs is installed/used, usually standard in NextAuth setups.
// Note: In a quick register, we might generate a temporary password or placeholder.

export async function quickRegisterTutorAndPet(data: {
    tutorName?: string;
    existingTutorId?: string;
    phone?: string;
    petName: string;
    species: Species;
}) {
    try {
        const result = await prisma.$transaction(async (tx: any) => {
            let tutorId = data.existingTutorId;

            // If no existing tutor, create new
            if (!tutorId) {
                if (!data.tutorName || !data.phone) {
                    throw new Error("Name and Phone are required for new Tutor");
                }

                // Quick/Dirty user creation
                const generatedEmail = `temp_${Date.now()}@vetos.system`;
                const hashedPassword = await hash('123456', 10);

                const user = await tx.user.create({
                    data: {
                        name: data.tutorName,
                        email: generatedEmail,
                        password: hashedPassword,
                        role: Role.TUTOR,
                    }
                });

                const tutor = await tx.tutor.create({
                    data: {
                        userId: user.id,
                        cpf: `TEMP_${Date.now()}`,
                        phone: data.phone,
                    }
                });
                tutorId = tutor.id;
            }

            // Create Pet
            const pet = await tx.pet.create({
                data: {
                    name: data.petName,
                    species: data.species,
                    tutorId: tutorId!,
                }
            });

            // Fetch relations to return formatted data
            const fullPet = await tx.pet.findUnique({
                where: { id: pet.id },
                include: { tutor: { include: { user: true } } }
            });

            return fullPet;
        });

        return {
            success: true, data: {
                pet: result!,
                user: result?.tutor.user,
                tutor: result?.tutor
            }
        };

    } catch (error: any) {
        console.error("Quick Register Error", error);
        return { error: error.message || 'Failed to quick register' };
    }
}
