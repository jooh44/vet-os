import { Suspense } from 'react';
import Search from '@/components/search';
import PetTable from '@/components/pets/pet-table';
import Pagination from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchPetsPages } from '@/app/lib/data';

export default async function PatientsPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchPetsPages(query);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-normal text-primary">Pacientes</h1>
                <Link href="/dashboard/patients/new">
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Novo Pet (via Tutor)
                        </span>
                    </Button>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <Search placeholder="Buscar pet ou tutor..." />
            </div>
            <Suspense fallback={<div>Carregando pacientes...</div>}>
                <PetTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
