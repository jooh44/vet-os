
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugDelete() {
    try {
        console.log("Searching for 'Johny Oliveira'...");
        const pet = await prisma.pet.findFirst({
            where: { name: "Johny Oliveira" }
        });

        if (!pet) {
            console.log("Pet not found in DB.");
            return;
        }

        console.log(`Found Pet: ${pet.id} (${pet.name})`);

        await prisma.$transaction(async (tx) => {
            console.log("1. Deleting Vaccines...");
            const v = await tx.vaccine.deleteMany({ where: { petId: pet.id } });
            console.log(`   Deleted ${v.count} vaccines.`);

            console.log("2. Finding Consultations...");
            const consultations = await tx.consultation.findMany({
                where: { petId: pet.id },
                select: { id: true }
            });
            const cIds = consultations.map(c => c.id);
            console.log(`   Found ${cIds.length} consultations.`);

            if (cIds.length > 0) {
                console.log("   Deleting Documents...");
                const d = await tx.document.deleteMany({
                    where: { consultationId: { in: cIds } }
                });
                console.log(`   Deleted ${d.count} documents.`);

                console.log("   Deleting Consultations...");
                const c = await tx.consultation.deleteMany({
                    where: { id: { in: cIds } }
                });
                console.log(`   Deleted ${c.count} consultations.`);
            }

            console.log("3. Deleting Pet...");
            await tx.pet.delete({
                where: { id: pet.id }
            });
            console.log("   Pet Deleted Successfully in Transaction.");
        });

        console.log("Transaction Committed.");

    } catch (e) {
        console.error("FAILURE:", e);
    } finally {
        await prisma.$disconnect();
    }
}

debugDelete();
