'use server';

import prisma from '@/lib/prisma';

export async function searchTutors(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const tutors = await prisma.tutor.findMany({
            where: {
                OR: [
                    { user: { name: { contains: query, mode: 'insensitive' } } },
                    { cpf: { contains: query } }
                ]
            },
            include: { user: { select: { name: true, email: true } } },
            take: 5,
        });

        return tutors.map((t: any) => ({
            id: t.id,
            name: t.user.name,
            cpf: t.cpf,
            label: `${t.user.name} (${t.cpf})`
        }));
    } catch (error) {
        console.error("Search Error", error);
        return [];
    }
}

export async function searchPets(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const pets = await prisma.pet.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' }
            },
            include: {
                tutor: {
                    include: { user: { select: { name: true } } }
                }
            },
            take: 5,
        });

        return pets.map((p: any) => ({
            id: p.id,
            name: p.name,
            tutorName: p.tutor.user.name,
            label: `${p.name} (Tutor: ${p.tutor.user.name})`
        }));
    } catch (error) {
        console.error("Search Pets Error", error);
        return [];
    }
}
