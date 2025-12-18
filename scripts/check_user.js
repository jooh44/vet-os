const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: 'Melissa', mode: 'insensitive' } },
                    { email: { contains: 'melissa', mode: 'insensitive' } }
                ]
            },
            include: {
                consultations: true // Check if she has consultations
            }
        });

        console.log(`Found ${users.length} users matching 'Melissa'.`);
        console.log(JSON.stringify(users, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
