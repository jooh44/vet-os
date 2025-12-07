import { searchCompetitors } from "../lib/gemini/grounding";
import * as path from 'path';
import * as dotenv from 'dotenv';

// Explicitly load .env from root
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading env from: ${envPath}`);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env:", result.error);
}
console.log("GEMINI_API_KEY loaded:", !!process.env.GEMINI_API_KEY);

async function main() {
    console.log("🔍 Testing Gemini Grounding Service...");
    const location = "Av. Paulista, São Paulo";
    console.log(`Searching competitors near: ${location}`);

    const results = await searchCompetitors(location);

    console.log("--- Results ---");
    console.log(JSON.stringify(results, null, 2));
}

main();
