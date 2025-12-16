'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
    petId?: string;
    petName?: string;
    tutorId?: string;
    consultationId?: string;
    data?: any;
}

interface FredContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggle: () => void;
    pageContext: PageContextType;
    setPageContext: (context: PageContextType) => void;
}

const FredContext = createContext<FredContextType | undefined>(undefined);

export function FredProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [pageContext, setPageContext] = useState<any>({});

    const toggle = () => setIsOpen((prev) => !prev);

    return (
        <FredContext.Provider value={{ isOpen, setIsOpen, toggle, pageContext, setPageContext }}>
            {children}
        </FredContext.Provider>
    );
}

export function useFred() {
    const context = useContext(FredContext);
    if (context === undefined) {
        throw new Error('useFred must be used within a FredProvider');
    }
    return context;
}
