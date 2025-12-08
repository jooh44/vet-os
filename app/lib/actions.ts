'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

import { TutorFormSchema } from '@/lib/schemas';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function createTutor(prevState: any, formData: FormData) {
    const validatedFields = TutorFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        cpf: formData.get('cpf'),
        phone: formData.get('phone'),
        address: formData.get('address'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Campos inválidos. Falha ao criar tutor.',
        };
    }

    const { name, email, cpf, phone, address } = validatedFields.data;
    const hashedPassword = await bcrypt.hash('123456', 10); // Default password

    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'TUTOR',
                }
            });

            await tx.tutor.create({
                data: {
                    cpf,
                    phone,
                    address,
                    userId: user.id
                }
            });
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Erro de banco de dados: Falha ao criar tutor. Verifique se o email ou CPF já existem.',
        };
    }

    revalidatePath('/dashboard/tutors');
    redirect('/dashboard/tutors');
}

import { PetFormSchema } from '@/lib/schemas';
import { uploadFile } from '@/lib/storage';

export async function createPet(tutorIdArg: string | null | undefined, prevState: any, formData: FormData) {
    // If tutorIdArg is provided (from Bind), use it. Otherwise, try to get from FormData.
    const tutorId = tutorIdArg || formData.get('tutorId') as string;

    const validatedFields = PetFormSchema.safeParse({
        name: formData.get('name'),
        species: formData.get('species'),
        breed: formData.get('breed'),
        birthDate: formData.get('birthDate'),
        weight: formData.get('weight'),
        tutorId: tutorId,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Campos inválidos. Falha ao cadastrar pet.',
        };
    }

    const { name, species, breed, birthDate, weight } = validatedFields.data;
    let photoUrl = null;

    try {
        const photoFile = formData.get('photo');
        if (photoFile && photoFile instanceof File && photoFile.size > 0) {
            photoUrl = await uploadFile(photoFile, 'pets');
        }

        await prisma.pet.create({
            data: {
                name,
                species: species as any, // Cast to enum
                breed,
                birthDate: birthDate ? new Date(birthDate) : null,
                weight,
                photoUrl,
                tutorId
            }
        });

    } catch (error) {
        console.error('Database/Storage Error:', error);
        return {
            message: 'Erro ao salvar pet. Tente novamente.',
        };
    }

    revalidatePath('/dashboard/tutors');
    redirect('/dashboard/tutors'); // Or redirect to tutor profile
}

// MEDICAL RECORDS
export async function createMedicalRecord(formData: FormData) {
    try {
        const anamnesis = formData.get('anamnesis') as string;
        const physicalExam = formData.get('physicalExam') as string;
        const diagnosis = formData.get('diagnosis') as string;
        const prescription = formData.get('prescription') as string;
        const petId = formData.get('petId') as string;

        if (!petId) {
            return { success: false, error: 'Erro: Nenhum paciente foi selecionado.' };
        }

        const pet = await prisma.pet.findUnique({
            where: { id: petId }
        });

        if (!pet) {
            return { success: false, error: 'Paciente não encontrado.' };
        }

        const record = await prisma.medicalRecord.create({
            data: {
                title: `Consulta Inteligente - ${new Date().toLocaleDateString('pt-BR')}`,
                anamnesis,
                physicalExam,
                diagnosis,
                prescription,
                petId: pet.id,
                vetId: 'demo-vet-id',
            },
            include: {
                pet: {
                    include: {
                        tutor: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });

        revalidatePath('/dashboard/records');

        const enrichedRecord = record as any;
        return {
            success: true,
            record: {
                ...enrichedRecord,
                patientName: enrichedRecord.pet?.name || 'Paciente',
                tutorName: enrichedRecord.pet?.tutor?.user?.name || 'Tutor',
            }
        };
    } catch (error) {
        console.error('Create Record Error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido ao salvar.' };
    }
}

import { processConsultationAudio } from './ai-actions';

export async function saveQuickNote(formData: FormData) {
    try {
        const petId = formData.get('petId') as string;
        if (!petId) throw new Error("Pet ID is required");

        // 1. Process Audio
        const aiResult = await processConsultationAudio(formData);

        if (!aiResult.success || !aiResult.data) {
            throw new Error("Falha na transcrição: " + (aiResult.error || 'Erro desconhecido'));
        }

        const aiData = aiResult.data;

        // 2. Create Record Directly
        const record = await prisma.medicalRecord.create({
            data: {
                title: `Anotação Rápida - ${new Date().toLocaleDateString('pt-BR')}`,
                anamnesis: aiData.anamnesis || "Não informado",
                physicalExam: aiData.physicalExam || "Não informado",
                diagnosis: aiData.diagnosis || "Não informado",
                prescription: aiData.prescription || "Não informado",
                petId: petId,
                vetId: 'demo-vet-id', // Hardcoded for now
            }
        });

        // 3. Revalidate
        revalidatePath(`/dashboard/pets/${petId}`);
        revalidatePath('/dashboard/records');

        return { success: true };
    } catch (error) {
        console.error("Quick Note Error:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
