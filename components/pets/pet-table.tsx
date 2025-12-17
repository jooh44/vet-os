import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchFilteredPets } from "@/app/lib/data"
import Link from 'next/link'
import { PawPrint } from "lucide-react"
import { PetTableRow } from "./pet-table-row"

export default async function PetTable({
    query,
    currentPage,
}: {
    query: string
    currentPage: number
}) {
    const pets = await fetchFilteredPets(query, currentPage)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Foto</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Espécie</TableHead>
                        <TableHead className="hidden md:table-cell">Raça</TableHead>
                        <TableHead>Tutor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pets?.map((pet: any) => (
                        <PetTableRow key={pet.id} pet={pet} />
                    ))}
                    {pets?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Nenhum pet encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
