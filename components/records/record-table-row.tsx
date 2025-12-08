'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecordTableRowProps {
    record: {
        id: string;
        date: Date;
        title: string;
        diagnosis: string | null;
        pet: {
            name: string;
            photoUrl: string | null;
            species: string;
            tutor: {
                user: {
                    name: string | null;
                }
            }
        }
    };
}

export function RecordTableRow({ record }: RecordTableRowProps) {
    const router = useRouter();

    const handleRowClick = () => {
        router.push(`/dashboard/records/${record.id}`);
    };

    return (
        <TableRow
            className="group hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={handleRowClick}
        >
            <TableCell className="font-medium whitespace-nowrap">
                {format(new Date(record.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={record.pet.photoUrl || ''} />
                        <AvatarFallback className="text-xs">{record.pet.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">{record.pet.name}</span>
                        <span className="text-xs text-muted-foreground">{record.pet.species}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <span className="text-sm">{record.pet.tutor.user.name || 'Sem nome'}</span>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-primary">{record.title}</span>
                    {record.diagnosis && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={record.diagnosis}>
                            Susp: {record.diagnosis}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent double navigation if button also links
                        router.push(`/dashboard/records/${record.id}`);
                    }}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                </Button>
            </TableCell>
        </TableRow>
    );
}
