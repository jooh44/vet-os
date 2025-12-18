
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Searching for "johny oliveira"...');
    const tutors = await prisma.tutor.findMany({
        where: {
            user: {
                name: {
                    contains: 'johny oliveira',
                    mode: 'insensitive'
                }
            }
        },
        include: { user: true }
    });

    console.log(`Found ${tutors.length} tutors.`);

    for (const tutor of tutors) {
        console.log(`Deleting Tutor: ${tutor.user.name} (${tutor.id})`);

        // 1. Delete Pets
        const deletePets = await prisma.pet.deleteMany({
            where: { tutorId: tutor.id }
        });
        console.log(`- Deleted ${deletePets.count} pets.`);

        // 2. Delete Chat Sessions
        const deleteChats = await prisma.chatSession.deleteMany({
            where: { tutorId: tutor.id }
        });
        console.log(`- Deleted ${deleteChats.count} chat sessions.`);

        // 3. Delete Tutor
        await prisma.tutor.delete({
            where: { id: tutor.id }
        });
        console.log(`- Deleted Tutor record.`);

        // 4. Delete User
        if (tutor.userId) {
            await prisma.user.delete({
                where: { id: tutor.userId }
            });
            console.log(`- Deleted User account.`);
        }
    }

    // Also check User table for orphans
    const orphans = await prisma.user.findMany({
        where: {
            name: { contains: 'johny oliveira', mode: 'insensitive' },
            role: 'TUTOR',
            tutorProfile: { is: null }
        }
    });

    console.log(`Found ${orphans.length} orphan users.`);
    for (const user of orphans) {
        await prisma.user.delete({ where: { id: user.id } });
        console.log(`- Deleted Orphan User: ${user.name}`);
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
