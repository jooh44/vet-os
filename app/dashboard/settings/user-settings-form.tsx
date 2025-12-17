'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/app/actions/profile-actions"
import { toast } from "sonner"
import { User } from "next-auth"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface UserSettingsFormProps {
    user: User
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const result = await updateProfile(formData)
        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Perfil atualizado com sucesso!")
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
                <CardDescription>
                    Gerencie suas informações pessoais. Essas informações serão usadas para identificar você no sistema.
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            defaultValue={user.email || ""}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name || ""}
                            placeholder="Ex: Fernando Silva"
                        />
                        <p className="text-xs text-muted-foreground">
                            Digite seu nome como gostaria que aparecesse. Nós adicionaremos "Dr." automaticamente onde for apropriado, a menos que você inclua aqui.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
