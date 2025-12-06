'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? 'Entrando...' : 'Entrar'}
        </Button>
    );
}
