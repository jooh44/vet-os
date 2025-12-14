'use client';

import { useEffect } from 'react';
import { useFred } from '@/components/fred/fred-provider';

export function usePageContext(context: any) {
    const { setPageContext } = useFred();

    useEffect(() => {
        setPageContext(context);
        // Cleanup context when unmounting (optional, might want to keep last context)
        // return () => setPageContext({}); 
    }, [JSON.stringify(context), setPageContext]);
}
