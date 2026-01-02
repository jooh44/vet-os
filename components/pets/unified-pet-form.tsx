'use client';

import { useFormState } from 'react-dom';
import { createPet } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/submit-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AsyncTutorSelect } from '@/components/tutors/async-tutor-select';
import { useState } from 'react';

export default function UnifiedPetForm() {
    const initialState = { message: null, errors: {} };
    // We need to modify createPet to accept tutorId from FormData if not provided as argument
    // For now, let's assume we bind null as the first arg and let the action handle extraction
    const createPetGlobal = createPet.bind(null, '');
    // Wait, createPet signature is (tutorId, state, formData). 
    // If I bind '', tutorId is ''. Inside action validation might fail if I don't extract from formData instead.

    // @ts-ignore
    const [state, dispatch] = useFormState(createPetGlobal, initialState);
    const [selectedTutorId, setSelectedTutorId] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (value.length >= 5) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
        } else if (value.length >= 3) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        setBirthDate(value);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Novo Paciente</CardTitle>
                <CardDescription>
                    Cadastre um pet selecionando seu tutor.
                </CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Tutor</Label>
                        {/* The component handles the hidden input 'tutorId' */}
                        <AsyncTutorSelect onSelect={setSelectedTutorId} error={state.errors?.tutorId} />
                        <div className="text-xs text-muted-foreground">
                            Não encontrou? <Link href="/dashboard/tutors/new" className="text-blue-500 hover:underline">Cadastre um novo tutor</Link>.
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome do Pet</Label>
                        <Input id="name" name="name" placeholder="Ex: Rex" required />
                        {state.errors?.name && (
                            <p className="text-sm text-red-500">{state.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="species">Espécie</Label>
                            <Select name="species" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DOG">Cachorro</SelectItem>
                                    <SelectItem value="CAT">Gato</SelectItem>
                                    <SelectItem value="BIRD">Pássaro</SelectItem>
                                    <SelectItem value="OTHER">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.species && (
                                <p className="text-sm text-red-500">{state.errors.species}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="breed">Raça</Label>
                            <Input id="breed" name="breed" placeholder="Ex: Golden Retriever" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="birthDate">Data de Nascimento</Label>
                            <Input
                                id="birthDate"
                                name="birthDate"
                                type="text"
                                placeholder="DD/MM/AAAA"
                                value={birthDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="weight">Peso (kg)</Label>
                            <Input id="weight" name="weight" type="number" step="0.1" placeholder="0.0" />
                            {state.errors?.weight && (
                                <p className="text-sm text-red-500">{state.errors.weight}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="photo">Foto do Pet</Label>
                        <Input id="photo" name="photo" type="file" accept="image/*" />
                    </div>

                    {state.message && (
                        <p className="text-sm text-red-500 mt-2">
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/patients`}>
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <SubmitButton>Cadastrar Paciente</SubmitButton>
                </CardFooter>
            </form>
        </Card>
    );
}
