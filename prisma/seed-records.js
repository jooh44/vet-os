const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Medical Records...')

    const pet = await prisma.pet.findFirst()
    if (!pet) {
        console.log('No pets found. Skipping.')
        return
    }

    await prisma.medicalRecord.createMany({
        data: [
            {
                petId: pet.id,
                title: 'Consulta de Rotina',
                date: new Date('2023-01-15'),
                notes: 'Animal saudável. Vacinas em dia.',
                vetId: 'sys-vet'
            },
            {
                petId: pet.id,
                title: 'Vacina Antirrábica',
                date: new Date('2023-06-20'),
                notes: 'Aplicação anual.',
                vetId: 'sys-vet'
            },
            {
                petId: pet.id,
                title: 'Exame de Sangue',
                date: new Date('2023-11-05'),
                notes: 'Rotina geriátrica. Leve alteração renal.',
                vetId: 'sys-vet'
            }
        ]
    })

    console.log(`Seeded records for pet: ${pet.name}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
