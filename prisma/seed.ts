
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await hash('123456', 12);

    // 1. Create Vet (Dr. Fernando)
    const vet = await prisma.user.upsert({
        where: { email: 'fernando@vet.os' },
        update: {},
        create: {
            email: 'fernando@vet.os',
            name: 'Dr. Fernando',
            password,
            role: 'VET',
        },
    });

    console.log({ vet });

    // 2. Create Tutor (Johny)
    const tutorUser = await prisma.user.upsert({
        where: { email: 'johny@gmail.com' },
        update: {},
        create: {
            email: 'johny@gmail.com',
            name: 'Johny',
            password, // 123456
            role: 'TUTOR',
        },
    });

    // 3. Create Tutor Profile
    const tutorProfile = await prisma.tutor.create({
        data: {
            userId: tutorUser.id,
            cpf: '123.456.789-00',
            phone: '11999999999'
        }
    });

    // 4. Create Pet (Thor)
    const pet = await prisma.pet.create({
        data: {
            name: 'Thor',
            species: 'DOG',
            breed: 'Golden Retriever',
            weight: 32.5,
            tutorId: tutorProfile.id,
            vaccines: {
                create: [
                    { name: 'V10', date: new Date('2024-01-15'), nextDue: new Date('2025-01-15'), batch: 'L8832' },
                    { name: 'Antirrábica', date: new Date('2024-02-20'), nextDue: new Date('2025-02-20'), batch: 'R221' }
                ]
            }
        }
    });

    console.log({ tutorUser, pet });

    // 5. Create a Chat Session
    const chat = await prisma.chatSession.create({
        data: {
            vetId: vet.id,
            tutorId: tutorProfile.id,
            accessCode: 'thor123' // Simple code for testing portal
        }
    });

    console.log({ chat });
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
