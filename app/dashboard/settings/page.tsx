import { auth } from "@/auth"
import { UserSettingsForm } from "./user-settings-form"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/api/auth/signin")
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-normal text-primary">Configurações</h1>
                <p className="text-muted-foreground">Gerencie suas preferências e informações de conta.</p>
            </div>

            <UserSettingsForm user={session.user} />
        </div>
    )
}
