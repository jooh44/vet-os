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
import { fetchFilteredTutors } from "@/app/lib/data"
import Link from 'next/link'
import { TutorTableRow } from "./tutor-table-row"

export default async function TutorTable({
    query,
    currentPage,
}: {
    query: string
    currentPage: number
}) {
    const tutors = await fetchFilteredTutors(query, currentPage)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Avatar</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">CPF</TableHead>
                        <TableHead className="hidden md:table-cell">Telefone</TableHead>
                        <TableHead>Pets</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tutors?.map((tutor: any) => (
                        <TutorTableRow key={tutor.id} tutor={tutor} />
                    ))}
                    {tutors?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Nenhum tutor encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
