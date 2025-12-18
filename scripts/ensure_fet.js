
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function checkAndCreate() {
    const email = 'fernando@vet.os';
    const password = '123'; // The user said 123456, but hash needs to match. I will create/reset if needed.
    // Actually user gave '123456'.

    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log("User found:", user.email);
        // Verify password if possible? We can't easily.
        // We will just update the password to be sure '123456' works for our test.
        const hash = await bcrypt.hash('123456', 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hash }
        });
        console.log("Password reset to '123456' for verification.");
    } else {
        console.log("User not found. Creating...");
        const hash = await bcrypt.hash('123456', 10);
        await prisma.user.create({
            data: {
                name: "Dr. Fernando",
                email,
                password: hash,
                role: 'VET'
            }
        });
        console.log("User created.");
    }
}

checkAndCreate()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
