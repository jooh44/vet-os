'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { activateAccount } from "@/lib/portal-actions";
import { useRouter } from "next/navigation";

export default function InviteForm({ accessCode, email }: { accessCode: string, email: string }) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        formData.append('accessCode', accessCode);

        const result = await activateAccount(formData);

        if (result.success) {
            // Redirect happens in action? No, verify action.
            // Action calls signIn with redirect: false.
            // So we must redirect here manually.
            window.location.href = '/dashboard'; // Or Portal URL
        } else {
            setError(result.message || "Erro desconhecido");
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar Senha</Label>
                <Input id="confirm" name="confirm" type="password" required minLength={6} />
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Ativando..." : "Ativar e Entrar"}
            </Button>
        </form>
    );
}
