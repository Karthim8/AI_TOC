/**
 * DFA Validator
 * Enforces formal rules for Deterministic Finite Automata.
 */

const validateDFA = (model) => {
    const errors = [];

    // 1. Basic Structure Check
    if (!model || !model.nodes || !model.edges) {
        return { valid: false, errors: ["Invalid semantic model structure: missing nodes or edges."] };
    }

    const nodes = model.nodes;
    const edges = model.edges;
    const alphabet = model.alphabet || [];

    // 2. Rule: Alphabet must be defined (Optional for relaxed mode, but strict for DFA)
    if (!model.alphabet || model.alphabet.length === 0) {
        // For now, we might infer alphabet from edges if missing, but let's warn or error.
        // errors.push("Alphabet (sigma) is missing or empty.");
    }

    // 3. Rule: Exactly ONE start state
    const startStates = nodes.filter(n => n.isStart);
    if (startStates.length === 0) {
        errors.push("DFA must have exactly one start state. Found 0.");
    } else if (startStates.length > 1) {
        errors.push(`DFA must have exactly one start state. Found ${startStates.length}.`);
    }

    // 4. Rule: No Epsilon transitions in DFA
    const hasEpsilon = edges.some(e => e.symbols && e.symbols.includes("ε"));
    if (hasEpsilon) {
        errors.push("DFA cannot contain ε (epsilon) transitions.");
    }

    // 5. Rule: Transitions must refer to valid states
    const nodeIds = new Set(nodes.map(n => n.id));
    edges.forEach(e => {
        if (!nodeIds.has(e.from)) errors.push(`Edge from unknown state '${e.from}'.`);
        if (!nodeIds.has(e.to)) errors.push(`Edge to unknown state '${e.to}'.`);
    });

    // 6. Rule: Total Determinism (The big one)
    // Every state must have exactly one transition for every symbol in the alphabet.
    if (alphabet.length > 0) {
        nodes.forEach(node => {
            alphabet.forEach(symbol => {
                // Find edges from this node that handle this symbol
                const transitions = edges.filter(e =>
                    e.from === node.id && e.symbols && e.symbols.includes(symbol)
                );

                if (transitions.length === 0) {
                    errors.push(`State '${node.id}' is missing a transition for symbol '${symbol}'.`);
                } else if (transitions.length > 1) {
                    errors.push(`State '${node.id}' has multiple transitions for symbol '${symbol}' (Nondeterminism).`);
                }
            });
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

module.exports = { validateDFA };
