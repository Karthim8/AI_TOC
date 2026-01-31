/**
 * Layout Engine for Logical Whiteboard
 * Calculates the (x, y) coordinates for nodes in the semantic graph.
 */

export const calculateLayout = (semanticData, width = 800, height = 600) => {
    if (!semanticData || !semanticData.nodes) {
        return { nodes: [], edges: [] };
    }

    const nodes = semanticData.nodes;
    const edges = semanticData.edges || [];
    const nodeCount = nodes.length;

    // Radius for the circular layout
    const radius = Math.min(width, height) / 3;
    const centerX = width / 2;
    const centerY = height / 2;

    // Assign positions using a simple circular layout
    // For a DFA, putting the start state at the left is clearer, but circular is a good MVP default.
    const nodesWithPositions = nodes.map((node, index) => {
        // If it's a simple 2-node graph, hardcode left-right for better readability
        if (nodeCount === 2) {
            const x = index === 0 ? width * 0.3 : width * 0.7;
            return { ...node, x, y: centerY };
        }

        // Otherwise, use circular distribution
        const angle = (2 * Math.PI * index) / nodeCount - Math.PI / 2; // Start from top (-90 deg)
        return {
            ...node,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });

    return {
        nodes: nodesWithPositions,
        edges: edges
    };
};
