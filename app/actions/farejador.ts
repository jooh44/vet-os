'use server';

import { searchCompetitors, CompetitorData, findSpecificClinic, generateMarketOverview } from "@/lib/gemini/grounding";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Intelligent Onboarding Actions

export async function findMyClinicAction(name: string, location: string, extraLink?: string) {
    try {
        console.log(`[Action] Finding clinic: ${name} in ${location} (Link: ${extraLink || 'none'})`);
        const clinic = await findSpecificClinic(name, location, extraLink);
        if (!clinic) return { success: false, error: "Clínica não encontrada. Tente refinar o nome ou local." };
        return { success: true, data: clinic };
    } catch (error) {
        return { success: false, error: "Erro na busca." };
    }
}

export async function analyzeMarketAction(myClinic: CompetitorData, competitors: CompetitorData[]) {
    try {
        const overview = await generateMarketOverview(myClinic, competitors);
        return { success: true, data: overview };
    } catch (error) {
        return { success: false, error: "Erro na análise." };
    }
}

export async function findCompetitorsAction(location: string): Promise<{ success: boolean; data?: CompetitorData[]; error?: string }> {
    try {
        if (!location) return { success: false, error: "Localização obrigatória" };

        const competitors = await searchCompetitors(location);
        return { success: true, data: competitors };
    } catch (error) {
        console.error("Failed to find competitors:", error);
        // Error handling for 429 is done via the throw in service, caught here
        return { success: false, error: "Falha ao buscar concorrentes. Verifique a cota da API." };
    }
}

export async function saveCompetitorAction(competitor: CompetitorData) {
    try {
        await prisma.competitor.create({
            data: {
                name: competitor.name,
                address: competitor.address,
                rating: competitor.rating,
                reviews: competitor.reviews,
                website: competitor.website,
                phone: competitor.phone,
                instagram: competitor.instagram,
                facebook: competitor.facebook,
                snapshots: {
                    create: {
                        rating: competitor.rating,
                        reviewCount: competitor.reviews
                    }
                }
            }
        });
        revalidatePath('/dashboard/farejador');
        return { success: true };
    } catch (error) {
        console.error("Failed to save competitor:", error);
        return { success: false, error: "Erro ao salvar concorrente" };
    }
}

export async function getMonitoredCompetitorsAction() {
    try {
        const competitors = await prisma.competitor.findMany({
            orderBy: { createdAt: 'desc' },
            include: { snapshots: { take: 1, orderBy: { date: 'desc' } } }
        });
        return { success: true, data: competitors };
    } catch (error) {
        console.error("Failed to get competitors:", error);
        return { success: false, error: "Erro ao carregar concorrentes" };
    }
} export async function resetFarejadorAction() {
    try {
        await prisma.competitorSnapshot.deleteMany({});
        await prisma.competitor.deleteMany({});
        revalidatePath('/dashboard/farejador');
        return { success: true };
    } catch (error) {
        console.error("Failed to reset:", error);
        return { success: false, error: "Erro ao resetar" };
    }
}
