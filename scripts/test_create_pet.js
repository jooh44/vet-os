
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Mocking storage logic purely for DB test
// We need to test the logic, not imports if we run node.
// I will simulate the logic in the script.

async function testCreatePet() {
    console.log("🚀 Testing Create Pet Logic...");

    // Simulate Data
    const rawData = {
        name: "Kira",
        species: "CAT",
        breed: "SRD",
        birthDate: "2025-06-12", // Future date?
        weight: "4",
        tutorId: "cmjbs9qpj0000vc5b1e0ihgy0" // Use a real ID from previous step if possible, or search one.
    };

    // 1. Get Tutor
    const tutor = await prisma.tutor.findFirst();
    if (!tutor) { console.error("No tutor found"); return; }
    rawData.tutorId = tutor.id;

    try {
        // Logic from actions.ts
        const birthDate = rawData.birthDate ? new Date(rawData.birthDate) : null;
        if (birthDate && isNaN(birthDate.getTime())) {
            console.error("Invalid Date parsed");
        }

        const weight = parseFloat(rawData.weight); // Schema coerce does this

        // Simulate Photo Upload (Mocking the function call success)
        const photoUrl = "https://supabase.../kira.jpg";

        console.log("Attempting creation with:", {
            name: rawData.name,
            species: rawData.species,
            birthDate,
            weight,
            photoUrl,
            tutorId: rawData.tutorId
        });

        const pet = await prisma.pet.create({
            data: {
                name: rawData.name,
                species: rawData.species, // Cast check?
                breed: rawData.breed,
                birthDate: birthDate,
                weight: weight,
                photoUrl: photoUrl,
                tutorId: rawData.tutorId
            }
        });

        console.log("✅ Simulation Success:", pet.id);

    } catch (e) {
        console.error("❌ Logic Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testCreatePet();
