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
                    {tutors?.map((tutor) => (
                        <TableRow key={tutor.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tutor.user.name}`} />
                                    <AvatarFallback>{tutor.user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{tutor.user.name}</span>
                                    <span className="text-xs text-muted-foreground md:hidden">{tutor.cpf}</span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{tutor.cpf}</TableCell>
                            <TableCell className="hidden md:table-cell">{tutor.phone}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {tutor.pets.map((pet) => (
                                        <Badge key={pet.id} variant="secondary" className="text-xs">
                                            {pet.name}
                                        </Badge>
                                    ))}
                                    {tutor.pets.length === 0 && <span className="text-xs text-muted-foreground">Sem pets</span>}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/tutors/${tutor.userId}`} className="text-xs text-blue-500 hover:underline">
                                    Detalhes
                                </Link>
                            </TableCell>
                        </TableRow>
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
