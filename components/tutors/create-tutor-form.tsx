'use client';

import { useFormState } from 'react-dom';
import { createTutor } from '@/app/lib/actions';
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

export default function CreateTutorForm() {
    const initialState = { message: null, errors: {} };
    // @ts-ignore
    const [state, dispatch] = useFormState(createTutor, initialState);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Novo Tutor</CardTitle>
                <CardDescription>
                    Cadastre um novo tutor para gerenciar seus pets.
                </CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" name="name" placeholder="Ex: João da Silva" required />
                        {state.errors?.name && (
                            <p className="text-sm text-red-500">{state.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="joao@example.com" required />
                            {state.errors?.email && (
                                <p className="text-sm text-red-500">{state.errors.email}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input id="cpf" name="cpf" placeholder="000.000.000-00" required />
                            {state.errors?.cpf && (
                                <p className="text-sm text-red-500">{state.errors.cpf}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" name="phone" placeholder="(00) 00000-0000" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input id="address" name="address" placeholder="Rua Exemplo, 123" />
                        </div>
                    </div>
                    {state.message && (
                        <p className="text-sm text-red-500 mt-2">
                            {state.message}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/tutors">
                        <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary">Cancelar</Button>
                    </Link>
                    <SubmitButton>Cadastrar Tutor</SubmitButton>
                </CardFooter>
            </form>
        </Card>
    );
}
