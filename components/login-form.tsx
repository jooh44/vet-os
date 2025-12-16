'use client';

import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { authenticate } from '@/app/lib/actions';



export default function LoginForm() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setIsPending(true);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await authenticate(undefined, formData);

            if (result && typeof result === 'object' && result.success) {
                router.push('/dashboard');
                router.refresh();
            } else if (result && typeof result === 'object' && 'message' in result) {
                setErrorMessage(result.message as string);
            } else {
                setErrorMessage("Ocorreu um erro ao tentar entrar.");
            }
        } catch (error) {
            setErrorMessage("Erro inesperado. Tente novamente.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Entre com seu email para acessar o sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" placeholder="m@example.com" required disabled={isPending} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" name="password" required disabled={isPending} />
                    </div>

                    <Button className="w-full" disabled={isPending}>
                        {isPending ? "Entrando..." : "Entrar"}
                    </Button>

                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-500 font-medium">
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
