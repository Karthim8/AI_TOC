require('dotenv').config();
const { generateDrawingLogic } = require('./services/aiService');

async function test() {
    try {
        console.log("Testing DFA generation...");
        const result = await generateDrawingLogic("create a dfa diagram that ends with a with input symbol={a,b}");
        console.log("Result received:");
        console.log(JSON.stringify(result, null, 2));

        // Basic verification
        const hasCircle = result.some(step => step.action === 'circle');
        const hasText = result.some(step => step.action === 'text');

        if (hasCircle && hasText) {
            console.log("✅ Verification Passed: Output contains circles and text.");
        } else {
            console.log("❌ Verification Failed: Output missing circles or text.");
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
