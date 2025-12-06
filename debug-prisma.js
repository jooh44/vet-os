const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Testing Tutor Count Query...')
    try {
        const query = ''
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
        console.log('Success. Count:', count)
    } catch (e) {
        console.error('Detailed Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
