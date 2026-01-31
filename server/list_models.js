require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: The SDK might not expose listModels directly on genAI instance depending on version,
        // but typically it's on the client or via a specific manager. 
        // Let's try to infer from the error message suggestion "Call ListModels".
        // Actually, looking at docs, it might be via the ModelManager or simply not directly helper-wrapped in all versions.
        // Let's try to use the raw API or the manager if available.

        // Attempting standard way if available in recent SDKs
        // If this fails, we will try a fetch approach to be sure.

        console.log("Attempting to list models...");

        // For many versions of the Node SDK, direct listing might not be a top-level method on GoogleGenerativeAI.
        // We can try to use the `axios` or `fetch` directly to debug if the SDK doesn't make it easy.
        // The error message explicitly said "Call ListModels", which usually implies the REST API capability.

        // Let's try a direct REST call to be 100% sure what the key sees, bypassing SDK quirks.
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            console.error("No API Key found in .env");
            return;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            console.error(`Failed to list models. Status: ${response.status}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const fs = require('fs');
        const data = await response.json();
        let output = "Available Models:\n";
        if (data.models) {
            data.models.forEach(m => {
                output += `${m.name.replace('models/', '')}\n`;
            });
        } else {
            output += "No models found.\n";
        }
        fs.writeFileSync('models_clean.txt', output, 'utf8');
        console.log("Written to models_clean.txt");

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
