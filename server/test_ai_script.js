require('dotenv').config();
const { generateDrawingLogic } = require('./services/aiService');

async function test() {
    try {
        console.log("Testing generation with gemini-2.5-flash...");
        const result = await generateDrawingLogic("Draw a triangle");
        console.log("Result received:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.log("Test failed:");
        console.log(error.message);
        if (error.response) {
            console.log("Response status:", error.response.status);
            console.log("Response data:", JSON.stringify(error.response.data));
        }
        console.log(error);
    }
}

test();
