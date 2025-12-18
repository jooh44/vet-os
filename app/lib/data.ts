import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Role } from '@prisma/client'

const ITEMS_PER_PAGE = 10

export async function fetchFilteredTutors(
    query: string,
    currentPage: number,
) {
    const session = await auth();
    const userId = session?.user?.id;

    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    // Strict Private Practice Filter (SaaS Model)
    // "Na real não era nem pra aparecer tutores cadastrados que não fossem do medico."
    // Every user sees ONLY their own data.
    const whereCondition: any = {
        OR: [
            { user: { name: { contains: query, mode: 'insensitive' } } },
            { cpf: { contains: query, mode: 'insensitive' } },
        ],
    };

    if (userId) {
        whereCondition.createdByVetId = userId;
    } else {
        // If no user (should rely on auth() above? yes), return empty or error?
        // Let's assume protected route. If no userId, returns nothing.
        return [];
    }

    try {
        const tutors = await prisma.tutor.findMany({
            where: whereCondition,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                pets: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
        })
        return tutors
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error(`Failed to fetch tutors. Cause: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function fetchTutorsPages(query: string) {
    const session = await auth();
    const userId = session?.user?.id;

    const whereCondition: any = {
        OR: [
            { user: { name: { contains: query, mode: 'insensitive' } } },
            { cpf: { contains: query, mode: 'insensitive' } },
        ],
    };

    if (userId) {
        whereCondition.createdByVetId = userId;
    } else {
        return 0;
    }

    try {
        const count = await prisma.tutor.count({
            where: whereCondition,
        })
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error(`Failed to fetch total number of tutors. Cause: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function fetchFilteredPets(
    query: string,
    currentPage: number,
) {
    const session = await auth();
    const userId = session?.user?.id;

    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    const whereCondition: any = {
        OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { tutor: { user: { name: { contains: query, mode: 'insensitive' } } } },
        ],
    };

    // If VET (or any user in SaaS mode), restrict to pets owned by tutors created by this user
    if (userId) {
        whereCondition.tutor = {
            ...(whereCondition.tutor || {}),
            createdByVetId: userId
        };
    } else {
        return [];
    }

    try {
        const pets = await prisma.pet.findMany({
            where: whereCondition,
            include: {
                tutor: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
        })
        return pets
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error(`Failed to fetch pets. Cause: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function fetchPetsPages(query: string) {
    const session = await auth();
    const userId = session?.user?.id;

    const whereCondition: any = {
        OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { tutor: { user: { name: { contains: query, mode: 'insensitive' } } } },
        ],
    };

    if (userId) {
        whereCondition.tutor = {
            ...(whereCondition.tutor || {}),
            createdByVetId: userId
        };
    } else {
        return 0;
    }

    try {
        const count = await prisma.pet.count({
            where: whereCondition,
        })
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error(`Failed to fetch total number of pets. Cause: ${error instanceof Error ? error.message : String(error)}`)
    }
}
