
import { Suspense } from 'react';
import Search from '@/components/search';
import TutorTable from '@/components/tutors/tutor-table';
import Pagination from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchTutorsPages } from '@/app/lib/data';

export default async function TutorsPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchTutorsPages(query);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-normal text-primary">Tutores</h1>
                <Link href="/dashboard/tutors/new">
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Novo Tutor
                        </span>
                    </Button>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <Search placeholder="Buscar por nome ou CPF..." />
            </div>
            <Suspense fallback={<div>Carregando tutores...</div>}>
                <TutorTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}

