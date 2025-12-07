
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Server Time Check:', new Date().toISOString());
    console.log('Server Local String:', new Date().toString());

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log('Query Start:', startOfDay.toISOString());
    console.log('Query End:', endOfDay.toISOString());

    const appointments = await prisma.appointment.findMany({
        where: {
            startTime: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    console.log('Appointments Found:', appointments);
    console.log('Total:', appointments.length);

    // Also check all appointments to see where they landed
    const all = await prisma.appointment.findMany();
    console.log('All Appointments in DB:', all.map(a => ({ id: a.id, start: a.startTime })));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
