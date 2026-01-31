const { GoogleGenerativeAI } = require("@google/generative-ai");
const { validateDFA } = require("./validator");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDrawingLogic = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      You are an expert in Formal Languages and Automata Theory.
      Your task is to convert natural language descriptions of State Machines (DFA, NFA, etc.) into a SEMANTIC JSON model.
      
      OUTPUT FORMAT:
      Return ONLY a JSON object representing the graph.
      - Do NOT include markdown formatting (like \`\`\`json).
      - Do NOT include comments.
      
      JSON STRUCTURE:
      {
        "type": "DFA" | "NFA" | "Graph",
        "alphabet": ["0", "1"],
        "nodes": [
          { "id": "q0", "label": "Start", "isAccepting": boolean, "isStart": boolean }
        ],
        "edges": [
          { "from": "q0", "to": "q1", "symbols": ["0"] }
        ]
      }
      
      EXAMPLE INPUT: "Draw a DFA that accepts strings ending in 1"
      EXAMPLE OUTPUT:
      {
        "type": "DFA",
        "alphabet": ["0", "1"],
        "nodes": [
          { "id": "q0", "label": "q0", "isStart": true, "isAccepting": false },
          { "id": "q1", "label": "q1", "isStart": false, "isAccepting": true }
        ],
        "edges": [
          { "from": "q0", "to": "q0", "symbols": ["0"] },
          { "from": "q0", "to": "q1", "symbols": ["1"] },
          { "from": "q1", "to": "q0", "symbols": ["0"] },
          { "from": "q1", "to": "q1", "symbols": ["1"] }
        ]
      }
      
      RULES:
      1. DFA must have exactly one start state.
      2. DFA must be DETEMINISTIC: For every state and every symbol in the alphabet, there must be exactly one transition.
      3. No epsilon transitions in DFA.
    `;

    const result = await model.generateContent([systemPrompt, `User Request: ${prompt}`]);
    const response = await result.response;
    const text = response.text();

    console.log("Raw LLM Response:", text); // Debug log

    // 1. Remove markdown code blocks
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // 2. Remove Single-line comments (// ...)
    cleanText = cleanText.replace(/\/\/.*$/gm, '');

    // 3. Remove Multi-line comments (/* ... */)
    cleanText = cleanText.replace(/\/\*[\s\S]*?\*\//g, '');

    // 4. Extract standard JSON Object {...} or Array [...]
    // The prompt now requests an Object, so we prioritize '{'
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    } else {
      // Fallback for array if model hallucinates old format
      const firstBracket = cleanText.indexOf('[');
      const lastBracket = cleanText.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleanText = cleanText.substring(firstBracket, lastBracket + 1);
      }
    }

    const jsonModel = JSON.parse(cleanText);

    // 5. VALIDATION LAYER (New)
    // Only validate if it's a DFA (allow loose "graph" for other generic requests if any)
    if (jsonModel.type === "DFA") {
      const validation = validateDFA(jsonModel);
      if (!validation.valid) {
        console.error("DFA Validation Failed:", validation.errors);
        throw new Error(`Invalid DFA Generated:\n` + validation.errors.join("\n"));
      }
    }

    // 6. ADAPT FOR FRONTEND
    // Frontend expects "label" on edges (from previous implementation).
    // Adapter schema to match frontend expectations:
    if (jsonModel.edges) {
      jsonModel.edges.forEach(e => {
        if (e.symbols && !e.label) {
          e.label = e.symbols.join(",");
        }
      });
    }

    return jsonModel;

  } catch (error) {
    console.error("Error generating drawing logic:", error);
    throw new Error("Failed to generate drawing logic: " + error.message);
  }
};

module.exports = { generateDrawingLogic };
