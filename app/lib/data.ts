import prisma from '@/lib/prisma'

const ITEMS_PER_PAGE = 10

export async function fetchFilteredTutors(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    try {
        const tutors = await prisma.tutor.findMany({
            where: {
                OR: [
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        cpf: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
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
    try {
        const count = await prisma.tutor.count({
            where: {
                OR: [
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        cpf: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
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
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    try {
        const pets = await prisma.pet.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tutor: {
                            user: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            },
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
    try {
        const count = await prisma.pet.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tutor: {
                            user: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            },
        })
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error(`Failed to fetch total number of pets. Cause: ${error instanceof Error ? error.message : String(error)}`)
    }
}
