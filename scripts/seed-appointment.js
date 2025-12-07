
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding test appointment...');

    // Create or connect to existing Appointment
    const start = new Date(); // Now
    start.setHours(17, 30, 0, 0); // 5:30 PM today

    const end = new Date(start);
    end.setHours(18, 30, 0, 0); // 1 hour duration

    const appointment = await prisma.appointment.create({
        data: {
            title: 'Consulta Teste - Manual Seed',
            startTime: start,
            endTime: end,
            type: 'CONSULT',
            status: 'CONFIRMED',
            notes: 'Created via seed script for testing.'
        }
    });

    console.log('Created appointment:', appointment);
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
