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

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" aria-disabled={pending}>
            Entrar
        </Button>
    );
}

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Entre com seu email para acessar o sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <form action={dispatch} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" placeholder="m@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" name="password" required />
                    </div>
                    <LoginButton />
                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <p className="text-sm text-red-500">
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
