import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search } from '@/components/ui/search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RecordTableRow } from '@/components/records/record-table-row';

export default async function RecordsListPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const where = query ? {
        OR: [
            { pet: { name: { contains: query, mode: 'insensitive' } } },
            { pet: { tutor: { user: { name: { contains: query, mode: 'insensitive' } } } } },
            { diagnosis: { contains: query, mode: 'insensitive' } },
        ] as any
    } : {};

    const records = await prisma.consultation.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
            pet: {
                include: {
                    tutor: {
                        include: { user: true }
                    }
                }
            },
            vet: true
        },
    });

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                        <FileText className="h-8 w-8" />
                        Prontuários Médicos
                    </h1>
                    <p className="text-muted-foreground">Histórico completo de atendimentos da clínica.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link href="/dashboard/consultation">
                        <Button className="w-full md:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nova Consulta
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Todos os Registros</CardTitle>
                        <div className="w-full md:w-[300px]">
                            <Search placeholder="Filtrar por paciente, tutor ou diagnóstico..." />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Paciente</TableHead>
                                <TableHead>Tutor</TableHead>
                                <TableHead>Diagnóstico / Título</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        Nenhum prontuário encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : records.map((record) => (
                                <RecordTableRow key={record.id} record={record} />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
