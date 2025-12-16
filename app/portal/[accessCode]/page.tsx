import { getPortalData } from '@/lib/portal-actions';
import { notFound } from 'next/navigation';
import { PortalInterface } from './portal-interface';

export default async function PortalPage({ params }: { params: { accessCode: string } }) {
    const data = await getPortalData(params.accessCode);

    if (!data) return notFound();

    return (
        <PortalInterface data={data} accessCode={params.accessCode} />
    );
}
