'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const profileSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
})

export async function updateProfile(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Não autorizado" }
    }

    const rawData = {
        name: formData.get("name"),
    }

    const validatedFields = profileSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: "Dados inválidos. Verifique o nome inserido." }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validatedFields.data.name,
            },
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/settings")

        return { success: "Perfil atualizado com sucesso!" }
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error)
        return { error: "Erro ao atualizar perfil. Tente novamente." }
    }
}
