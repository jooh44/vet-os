
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLifecycle() {
    console.log("🚀 Starting DB Logic Test...");

    try {
        // 1. Create Vet
        let vet = await prisma.user.findFirst({ where: { email: 'fernando@vet.os' } });
        if (!vet) throw new Error("Vet not found");

        // 2. Create Tutor
        const tutor = await prisma.tutor.create({
            data: {
                cpf: "000.000.000-00" + Date.now(),
                user: {
                    create: {
                        name: "Tutor Teste Script",
                        email: "tutor_script_" + Date.now() + "@test.com",
                        password: "hash",
                        role: "TUTOR"
                    }
                },
                createdByVet: { connect: { id: vet.id } }
            }
        });
        console.log(`✅ Tutor Created: ${tutor.id}`);

        // 3. Create Pet
        const pet = await prisma.pet.create({
            data: {
                name: "Pet To Delete",
                species: "DOG",
                tutorId: tutor.id
            }
        });
        console.log(`✅ Pet Created: ${pet.id}`);

        // 4. Create Dependent Records (The ones causing errors before)
        await prisma.vaccine.create({
            data: { name: "Rabies", petId: pet.id }
        });
        console.log("   + Vaccine created");

        const cons = await prisma.consultation.create({
            data: {
                title: "Checkup",
                date: new Date(),
                petId: pet.id,
                vetId: vet.id
            }
        });
        console.log("   + Consultation created");

        await prisma.document.create({
            data: {
                name: "Exam Result",
                url: "http://fake",
                type: "EXAM",
                consultationId: cons.id
            }
        });
        console.log("   + Document created");

        // 5. TEST DELETION LOGIC (Replicating deletePet action)
        console.log("\n🧪 Testing Deletion Logic...");

        await prisma.$transaction(async (tx) => {
            // A. Delete Vaccines
            const v = await tx.vaccine.deleteMany({ where: { petId: pet.id } });
            console.log(`   - Deleted ${v.count} vaccines.`);

            // B. Delete Consultations & Docs
            const consults = await tx.consultation.findMany({
                where: { petId: pet.id },
                select: { id: true }
            });
            const cIds = consults.map(c => c.id);

            if (cIds.length > 0) {
                const d = await tx.document.deleteMany({
                    where: { consultationId: { in: cIds } }
                });
                console.log(`   - Deleted ${d.count} documents.`);

                const c = await tx.consultation.deleteMany({
                    where: { id: { in: cIds } }
                });
                console.log(`   - Deleted ${c.count} consultations.`);
            }

            // C. Delete Pet
            await tx.pet.delete({ where: { id: pet.id } });
            console.log(`   - Pet Deleted!`);
        });

        // 6. Verify Deletion
        const checkPet = await prisma.pet.findUnique({ where: { id: pet.id } });
        if (!checkPet) {
            console.log("\n🎉 SUCCESS: Pet was completely removed along with dependencies.");
        } else {
            console.error("\n❌ CAUTION: Pet still exists!");
        }

        // Cleanup Tutor
        await prisma.tutor.delete({ where: { id: tutor.id } });
        await prisma.user.delete({ where: { id: tutor.userId } }); // Tutor User
        console.log("🧹 Cleanup complete.");

    } catch (e) {
        console.error("TEST FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testLifecycle();
