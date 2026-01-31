import React from 'react';

const DiagramRenderer = ({ steps, width = 800, height = 600 }) => {
    // If we have semantic data coming in (nodes/edges), render that.
    const isSemantic = steps && !Array.isArray(steps) && steps.nodes;

    if (!isSemantic) {
        return (
            <div className="flex justify-center items-center h-full text-gray-400">
                Waiting for diagram data...
            </div>
        );
    }

    const { nodes, edges } = steps;

    return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden flex justify-center items-center">
            <svg width={width} height={height} className="bg-gray-50">
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="28" // Adjust refX to land on the node circle border (r=30 approx)
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                    </marker>
                </defs>

                {edges.map((edge, i) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);

                    if (!fromNode || !toNode) return null;

                    const isSelfLoop = fromNode.id === toNode.id;

                    // CHECK FOR BIDIRECTIONAL EDGE (Collision detection)
                    // Is there another edge going from (toNode) back to (fromNode)?
                    const isBidirectional = edges.some(e => e.from === toNode.id && e.to === fromNode.id);

                    if (isSelfLoop) {
                        const loopRadius = 30;
                        const startX = fromNode.x;
                        const startY = fromNode.y - 30; // Top of the node

                        return (
                            <g key={`edge-${i}`}>
                                <path
                                    d={`M ${startX - 10} ${startY} C ${startX - 30} ${startY - 50}, ${startX + 30} ${startY - 50}, ${startX + 10} ${startY}`}
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                                <text
                                    x={startX}
                                    y={startY - 55}
                                    fill="black"
                                    fontSize="12"
                                    textAnchor="middle"
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    } else if (isBidirectional) {
                        // CURVED LINE for bidirectional edges to avoid overlap
                        // Calculate midpoint and normal vector for control point
                        const midX = (fromNode.x + toNode.x) / 2;
                        const midY = (fromNode.y + toNode.y) / 2;

                        const dx = toNode.x - fromNode.x;
                        const dy = toNode.y - fromNode.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // Normal vector (-dy, dx) normalized
                        const nx = -dy / dist;
                        const ny = dx / dist;

                        // Offset amount (curve height)
                        const offset = 40;

                        const cpX = midX + nx * offset;
                        const cpY = midY + ny * offset;

                        // Quadratic Bezier Curve: M start Q control end
                        const pathData = `M ${fromNode.x} ${fromNode.y} Q ${cpX} ${cpY} ${toNode.x} ${toNode.y}`;

                        // Label position (near control point)
                        const labelX = (fromNode.x + 2 * cpX + toNode.x) / 4;
                        const labelY = (fromNode.y + 2 * cpY + toNode.y) / 4;

                        return (
                            <g key={`edge-${i}`}>
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                                <text
                                    x={labelX}
                                    y={labelY}
                                    fill="black"
                                    fontSize="14"
                                    textAnchor="middle"
                                    className="bg-white"
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    } else {
                        // STRAIGHT LINE
                        return (
                            <g key={`edge-${i}`}>
                                <line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke="#2563eb"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                                <text
                                    x={(fromNode.x + toNode.x) / 2}
                                    y={(fromNode.y + toNode.y) / 2 - 10}
                                    fill="black"
                                    fontSize="14"
                                    textAnchor="middle"
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    }
                })}

                {/* Nodes (Circles) - Rendered AFTER edges to be on top */}
                {nodes.map((node, i) => (
                    <g key={`node-${i}`}>
                        {node.isAccepting && (
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={36}
                                stroke="#2563eb"
                                strokeWidth="2"
                                fill="none"
                            />
                        )}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={30}
                            stroke="#2563eb"
                            strokeWidth="2"
                            fill="white"
                        />
                        <text
                            x={node.x}
                            y={node.y}
                            dy=".3em"
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="bold"
                            fill="#1e293b"
                        >
                            {node.label || node.id}
                        </text>
                        {node.isStart && (
                            <path
                                d={`M ${node.x - 60} ${node.y} L ${node.x - 35} ${node.y}`}
                                stroke="#2563eb"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default DiagramRenderer;
