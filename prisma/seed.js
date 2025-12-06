const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create Admin
    const hashedPassword = await bcrypt.hash('password', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@fred.com' },
        update: {},
        create: {
            email: 'admin@fred.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    // Create Tutors
    const tutorsData = [
        {
            name: 'Ana Silva',
            email: 'ana@example.com',
            cpf: '123.456.789-00',
            phone: '(11) 99999-0000',
            pets: [
                { name: 'Rex', species: 'DOG', breed: 'Golden Retriever', birthDate: new Date('2020-01-01') },
                { name: 'Mia', species: 'CAT', breed: 'Siamese', birthDate: new Date('2021-05-15') }
            ]
        },
        {
            name: 'Carlos Oliveira',
            email: 'carlos@example.com',
            cpf: '321.654.987-11',
            phone: '(11) 98888-1111',
            pets: [
                { name: 'Thor', species: 'DOG', breed: 'Bulldog', birthDate: new Date('2019-11-20') }
            ]
        },
        {
            name: 'Mariana Costa',
            email: 'mariana@example.com',
            cpf: '111.222.333-44',
            phone: '(21) 97777-2222',
            pets: [
                { name: 'Loro', species: 'BIRD', breed: 'Papagaio', birthDate: new Date('2018-03-10') }
            ]
        }
    ]

    for (const t of tutorsData) {
        const user = await prisma.user.create({
            data: {
                name: t.name,
                email: t.email,
                password: hashedPassword,
                role: 'TUTOR',
                tutorProfile: {
                    create: {
                        cpf: t.cpf,
                        phone: t.phone,
                        pets: {
                            create: t.pets
                        }
                    }
                }
            }
        })
        console.log(`Created Tutor: ${user.name}`)
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
