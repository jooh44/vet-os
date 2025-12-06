const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting Demo Seeding...')

    // 1. Clean up (optional, or just upsert)
    // await prisma.medicalRecord.deleteMany({})
    // await prisma.pet.deleteMany({})
    // await prisma.tutor.deleteMany({})
    // await prisma.user.deleteMany({ where: { role: 'TUTOR' } })

    const hashedPassword = await bcrypt.hash('123456', 10)

    // 2. Create Admin (Ensure exists)
    await prisma.user.upsert({
        where: { email: 'admin@fred.com' },
        update: {},
        create: {
            email: 'admin@fred.com',
            name: 'Dr. Fred Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    // 3. Mock Data
    const tutors = [
        {
            name: 'Juliana Paes',
            email: 'ju.paes@example.com',
            phone: '(11) 99999-1234',
            cpf: '111.111.111-11',
            address: 'Rua das Flores, 123, Jardins - SP',
            pets: [
                {
                    name: 'Pandora',
                    species: 'DOG',
                    breed: 'Border Collie',
                    weight: 18.5,
                    birthDate: new Date('2021-04-10'),
                    history: [
                        { title: 'Consulta de Rotina', type: 'CONSULT', date: '2023-11-10', notes: 'Paciente ativo, mucosas coradas. Vacinação em dia.' },
                        { title: 'Vacina V10', type: 'VACCINE', date: '2023-11-10', notes: 'Reforço anual aplicado. Lote AB123.' },
                        { title: 'Exame de Fezes', type: 'EXAM', date: '2023-05-15', notes: 'Negativo para giardia.' }
                    ]
                },
                {
                    name: 'Garfield',
                    species: 'CAT',
                    breed: 'Persa',
                    weight: 5.2,
                    birthDate: new Date('2019-08-20'),
                    history: [
                        { title: 'Consulta Dermatológica', type: 'CONSULT', date: '2023-12-01', notes: 'Apresenta descamação na cauda. Prescrito shampoo antifúngico.' },
                        { title: 'Ultrassom Abdominal', type: 'EXAM', date: '2023-12-01', notes: 'Rins com tamanho preservado. Bexiga cheia.' }
                    ]
                }
            ]
        },
        {
            name: 'Roberto Carlos',
            email: 'rc@example.com',
            phone: '(21) 98888-7777',
            cpf: '222.222.222-22',
            address: 'Av. Atlântica, 500, Copacabana - RJ',
            pets: [
                {
                    name: 'Amigo',
                    species: 'DOG',
                    breed: 'Pastor Alemão',
                    weight: 32.0,
                    birthDate: new Date('2015-02-15'),
                    history: [
                        { title: 'Consulta Geriátrica', type: 'CONSULT', date: '2023-10-20', notes: 'Paciente com dificuldade de locomoção. Suspeita de displasia.' },
                        { title: 'Raio-X Coxofemoral', type: 'EXAM', date: '2023-10-22', notes: 'Confirmada displasia grau II. Iniciado condroprotetor.' },
                        { title: 'Fisioterapia (Sessão 1)', type: 'OTHER', date: '2023-11-01', notes: 'Hidroterapia realizada com sucesso.' }
                    ]
                }
            ]
        },
        {
            name: 'Ana Maria',
            email: 'ana.maria@example.com',
            phone: '(11) 97777-6666',
            cpf: '333.333.333-33',
            address: 'Rua Augusta, 1000, Centro - SP',
            pets: [
                {
                    name: 'Louro',
                    species: 'BIRD',
                    breed: 'Papagaio',
                    weight: 0.4,
                    birthDate: new Date('2020-01-01'),
                    history: [
                        { title: 'Corte de Asas', type: 'PC', date: '2023-09-10', notes: 'Procedimento realizado sem intercorrências.' }
                    ]
                }
            ]
        }
    ]

    for (const t of tutors) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email: t.email } })
        if (existingUser) {
            console.log(`Skipping ${t.name} (already exists)`)
            continue
        }

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
                        address: t.address,
                        pets: {
                            create: t.pets.map(p => ({
                                name: p.name,
                                species: p.species,
                                breed: p.breed,
                                weight: p.weight,
                                birthDate: p.birthDate,
                                medicalRecords: {
                                    create: p.history.map(h => ({
                                        title: h.title,
                                        date: new Date(h.date),
                                        notes: h.notes,
                                        vetId: 'sys-vet' // mock
                                    }))
                                }
                            }))
                        }
                    }
                }
            }
        })
        console.log(`Created Tutor: ${t.name} with ${t.pets.length} pets.`)
    }

    console.log('✅ Seeding Completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
