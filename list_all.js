const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const all = await prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            date: true,
            status: true,
            vetId: true,
            pet: {
                select: { name: true, tutor: { select: { user: { select: { name: true } } } } }
            }
        }
    });

    console.log(`Total Records: ${all.length}`);
    all.forEach(c => {
        console.log(`[${c.status}] ${c.date.toISOString().split('T')[0]} - ${c.title} (Pet: ${c.pet?.name})`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
