const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.pet.count();
        console.log('Total Pets:', count);
        if (count > 0) {
            const pet = await prisma.pet.findFirst({ orderBy: { createdAt: 'desc' }, include: { tutor: true } });
            console.log('Latest Pet:', pet.name, 'ID:', pet.id);
            console.log('Tutor:', pet.tutor?.id);
        } else {
            console.log('NO PETS FOUND.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
