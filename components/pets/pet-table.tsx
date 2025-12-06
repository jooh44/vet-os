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
                    {pets?.map((pet) => (
                        <TableRow key={pet.id}>
                            <TableCell>
                                <Avatar>
                                    {pet.photoUrl ? (
                                        <AvatarImage src={pet.photoUrl} className="object-cover" />
                                    ) : (
                                        <AvatarFallback>
                                            <PawPrint className="h-4 w-4 text-muted-foreground" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{pet.name}</TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Badge variant="outline">{pet.species}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{pet.breed || '-'}</TableCell>
                            <TableCell>
                                <Link href={`/dashboard/tutors/${pet.tutorId}`} className="hover:underline">
                                    {pet.tutor.user.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/pets/${pet.id}`} className="text-xs text-blue-500 hover:underline">
                                    Ver Prontuário
                                </Link>
                            </TableCell>
                        </TableRow>
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
