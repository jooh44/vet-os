import { getGenAI, GEMINI_MODEL_NAME } from "./client";

export interface CompetitorData {
    name: string;
    address?: string;
    rating?: number;
    website?: string;
    placeId?: string;
    phone?: string;
    instagram?: string;
    facebook?: string;
    reviews?: number;
}

export async function searchCompetitors(location: string, radiusKm: number = 5): Promise<CompetitorData[]> {
    try {
        const client = getGenAI();

        const prompt = `Find veterinary clinics in ${location} within ${radiusKm}km. 
    For each one found via Google Search, extract the following details:
    - Name
    - Full Address
    - User Rating (0-5)
    - Review Count
    - Website URL
    - Phone Number
    - Instagram URL (if found)
    - Facebook URL (if found)
    
    Return the result strictly as a JSON array of objects with keys: 
    name, address, rating, reviews, website, phone, instagram, facebook.
    
    Do not add markdown formatting like \`\`\`json. Just the raw JSON string.`;

        const result = await client.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log("[Grounding] Raw response for search:", text); // Debug log

        if (!text) {
            console.warn("No text returned from Gemini Grounding");
            return [];
        }

        try {
            // Robust JSON extraction for Array
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                console.warn("[Grounding] No JSON Array found in response");
                return [];
            }

            const cleanText = jsonMatch[0];
            const data = JSON.parse(cleanText) as any[];

            return data.map(item => ({
                name: item.name || "Unknown",
                address: item.address || item.formatted_address,
                rating: item.rating || item.user_rating,
                reviews: item.reviews || item.user_ratings_total || 0,
                website: item.website,
                phone: item.phone || item.formatted_phone_number,
                instagram: item.instagram,
                facebook: item.facebook
            }));
        } catch (e) {
            console.warn("Failed to parse JSON from Gemini Grounding response:", text);
            return [];
        }

    } catch (error: any) {
        console.error("Error searching competitors with Gemini Grounding:", error);
        throw error;
    }
}

export async function findSpecificClinic(name: string, location: string, extraLink?: string): Promise<CompetitorData | null> {
    try {
        const client = getGenAI();

        let prompt = `Identify the specific veterinary clinic named "${name}" (or similar) located in "${location}".`;

        if (extraLink) {
            prompt += `\n\nCRITICAL: The user provided this SPECIFIC LINK to the clinic: "${extraLink}".
            You MUST start by searching for this exact URL to extract the clinic details.
            Trust the details found on this page (or Google Maps entry) over general search results.`;
        } else {
            prompt += `\nUse Google Search to find its details.`;
        }

        prompt += `\n\nExtract:
        - Exact Name
        - Full Address
        - User Rating (0-5)
        - Review Count
        - Website URL
        - Phone Number
        
        Return ONLY a JSON object (no markdown) with keys: name, address, rating, reviews, website, phone.
        
        IMPORTANT: Use the Google Search results to fill these fields. 
        - If you find the clinic, you MUST fill 'name' and 'address' at minimum.
        - If the exact name isn't perfect, use the name found in the search result.
        - If you cannot find a matching clinic after searching, return the string "null".`;

        const result = await client.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { tools: [{ googleSearch: {} }] }
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log("[Grounding] Raw response for specific clinic:", text); // Debug log

        if (!text) return null;

        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn("[Grounding] No JSON found in response");
            return null;
        }

        const cleanText = jsonMatch[0];
        const data = JSON.parse(cleanText);

        if (!data.name && !data.address) {
            console.warn("[Grounding] JSON found but contained no name/address");
            return null;
        }

        return {
            name: data.name,
            address: data.address,
            rating: data.rating,
            reviews: data.reviews,
            website: data.website,
            phone: data.phone
        };
    } catch (e) {
        console.error("Error identifying specific clinic:", e);
        return null;
    }
}

export async function generateMarketOverview(myClinic: CompetitorData, competitors: CompetitorData[]): Promise<string> {
    try {
        const client = getGenAI();
        const prompt = `I am the owner of "${myClinic.name}" in "${myClinic.address}".
        
        Here are my local competitors found:
        ${JSON.stringify(competitors.map(c => ({ name: c.name, rating: c.rating, reviews: c.reviews, address: c.address })))}
        
        Generate a "Market Overview" summary (in Portuguese) for me.
        - Analyze the density of competitors.
        - Compare my rating/reviews vs the average.
        - Highlight the biggest threat (highest rated/most reviewed).
        - Identify a potential opportunity gap.
        
        Keep it concise (max 3 paragraphs), professional but encouraging. Use markdown formatting.`;

        const result = await client.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        return result.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a análise de mercado.";

    } catch (e) {
        console.error("Error generating market overview:", e);
        return "Erro ao analisar o mercado.";
    }
}
