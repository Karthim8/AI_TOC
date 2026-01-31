import React from 'react';
import { ArrowBigRight } from 'lucide-react';

const DiagramRenderer = ({ steps, width = 800, height = 600 }) => {
    // If we have semantic data coming in (nodes/edges), render that.
    // NOTE: 'steps' prop name is kept from App.jsx but now might contain the full graph object

    // Check if we are in Legacy Mode (Turtle Graphics array) or New Semantic Mode (Object with nodes)
    const isSemantic = steps && !Array.isArray(steps) && steps.nodes;

    if (!isSemantic) {
        // Fallback for legacy turtle graphics if needed (or return null)
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
                    {/* Define an arrowhead marker */}
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="28" // Adjust refX to prevent overlap with the node circle
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                    </marker>
                </defs>

                {/* Edges (Lines) */}
                {edges.map((edge, i) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);

                    if (!fromNode || !toNode) return null;

                    // Calculate self-loop vs straight line
                    const isSelfLoop = fromNode.id === toNode.id;

                    if (isSelfLoop) {
                        // Draw a loop above the node
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
                    } else {
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
                                {/* Label in the middle */}
                                <text
                                    x={(fromNode.x + toNode.x) / 2}
                                    y={(fromNode.y + toNode.y) / 2 - 10}
                                    fill="black"
                                    fontSize="14"
                                    textAnchor="middle"
                                    className="bg-white" // Simple hack, real bg requires rect
                                >
                                    {edge.label}
                                </text>
                            </g>
                        );
                    }
                })}

                {/* Nodes (Circles) */}
                {nodes.map((node, i) => (
                    <g key={`node-${i}`}>
                        {/* Outer circle for accepting states */}
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

                        {/* Main state circle */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={30}
                            stroke="#2563eb"
                            strokeWidth="2"
                            fill="white"
                        />

                        {/* Node Label */}
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

                        {/* Start Indicator (arrow pointing to start state) */}
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
