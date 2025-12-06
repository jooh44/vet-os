import { z } from 'zod';

export const TutorFormSchema = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
    email: z.string().email({ message: 'Email inválido.' }),
    cpf: z.string().min(11, { message: 'CPF deve ter 11 caracteres.' }), // Basic length check, implement strict validation later
    phone: z.string().optional(),
    address: z.string().optional(),
});

export const PetFormSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
    species: z.enum(['DOG', 'CAT', 'BIRD', 'OTHER'], {
        message: "Selecione uma espécie válida.",
    }),
    breed: z.string().optional(),
    birthDate: z.string().optional(), // We'll parse this to Date on server
    weight: z.coerce.number().min(0.1, 'Peso deve ser maior que 0').optional(),
    tutorId: z.string().min(1, 'Tutor é obrigatório'),
    // Photo validation is tricky with Zod on server actions via FormData, 
    // we often handle file separately or use a custom validation.
});
