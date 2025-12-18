'use server'

import { signIn, signOut, auth } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { success: false, message: 'Credenciais Inválidas.' };
                default:
                    return { success: false, message: `Erro: ${error.type}` };
            }
        }

        // If it's NOT an AuthError (and not a Redirect since we disabled it), throw it), throw it
        throw error;
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

    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Erro: Usuário não autenticado.' };
    }

    const userId = session!.user!.id!;

    try {
        await prisma.$transaction(async (tx: any) => {
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
                    userId: user.id,
                    createdByVetId: userId
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

    console.log('[createPet] Starting with tutorId:', tutorId);
    console.log('[createPet] Form data keys:', Array.from(formData.keys()));

    const validatedFields = PetFormSchema.safeParse({
        name: formData.get('name'),
        species: formData.get('species'),
        breed: formData.get('breed'),
        birthDate: formData.get('birthDate'),
        weight: formData.get('weight'),
        tutorId: tutorId,
    });

    if (!validatedFields.success) {
        console.log('[createPet] Validation failed:', validatedFields.error.flatten());
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Campos inválidos. Falha ao cadastrar pet.',
        };
    }

    const { name, species, breed, birthDate, weight } = validatedFields.data;
    let photoUrl = null;

    try {
        const photoFile = formData.get('photo');
        console.log('[createPet] Photo file present:', !!photoFile);
        console.log('[createPet] Photo instanceof File:', photoFile instanceof File);
        if (photoFile instanceof File) {
            console.log('[createPet] Photo details - name:', photoFile.name, 'type:', photoFile.type, 'size:', photoFile.size);
        }

        if (photoFile && photoFile instanceof File && photoFile.size > 0) {
            console.log('[createPet] Uploading photo...');
            photoUrl = await uploadFile(photoFile, 'pets');
            console.log('[createPet] Photo uploaded:', photoUrl);
        }

        console.log('[createPet] Creating pet in database...');
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
        console.log('[createPet] Pet created successfully');

    } catch (error) {
        console.error('[createPet] Error:', error);
        return {
            message: `Erro ao salvar pet: ${error instanceof Error ? error.message : String(error)}`,
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

        // Extract Vitals
        const vitalSigns = {
            temperature: formData.get('vital_temp') ? String(formData.get('vital_temp')) : null,
            weight: formData.get('vital_weight') ? String(formData.get('vital_weight')) : null,
            heartRate: formData.get('vital_hr') ? String(formData.get('vital_hr')) : null,
            respiratoryRate: formData.get('vital_rr') ? String(formData.get('vital_rr')) : null,
        };

        if (!petId) {
            return { success: false, error: 'Erro: Nenhum paciente foi selecionado.' };
        }

        const pet = await prisma.pet.findUnique({
            where: { id: petId }
        });

        if (!pet) {
            return { success: false, error: 'Paciente não encontrado.' };
        }

        // Fallback Auth Logic
        const session = await auth();
        let vetId = session?.user?.id;
        if (!vetId) {
            const fallbackUser = await prisma.user.findFirst();
            if (fallbackUser) vetId = fallbackUser.id;
            else throw new Error("Nenhum usuário encontrado no sistema.");
        }

        const record = await prisma.consultation.create({
            data: {
                date: new Date(),
                title: `Consulta Inteligente - ${new Date().toLocaleDateString('pt-BR')}`,
                status: 'IN_PROGRESS',
                anamnesis,
                physicalExam,
                diagnosis,
                prescription,
                vitalSigns: vitalSigns,
                petId: pet.id,
                vetId: vetId,
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

// Helper to get active vet ID (Fallback for Dev Mode)
async function getActiveVetId() {
    const session = await auth();
    if (session?.user?.id) return session.user.id;

    // Fallback: Get first user (to allow dev testing without strict auth)
    const fallbackUser = await prisma.user.findFirst();
    if (fallbackUser) return fallbackUser.id;

    throw new Error("Nenhum usuário encontrado no sistema para vincular o registro.");
}

export async function saveQuickNote(formData: FormData) {
    try {
        const vetId = await getActiveVetId();

        const petId = formData.get('petId') as string;
        if (!petId) throw new Error("Pet ID is required");

        // 1. Process Audio
        const aiResult = await processConsultationAudio(formData);

        if (!aiResult.success || !aiResult.data) {
            throw new Error("Falha na transcrição: " + (aiResult.error || 'Erro desconhecido'));
        }

        const aiData = aiResult.data;

        // 2. Create Record Directly
        const record = await prisma.consultation.create({
            data: {
                title: `Anotação Rápida - ${new Date().toLocaleDateString('pt-BR')}`,
                anamnesis: aiData.anamnesis || "Não informado",
                physicalExam: aiData.physicalExam || "Não informado",
                diagnosis: aiData.diagnosis || "Não informado",
                prescription: aiData.prescription || "Não informado",
                vitalSigns: aiData.vitalSigns || {}, // Save extracted vitals
                summary: "Gerado via Quick Note",
                petId: petId,
                vetId: vetId,
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

export async function handleSignOut() {
    await signOut({ redirectTo: '/login' });
}
