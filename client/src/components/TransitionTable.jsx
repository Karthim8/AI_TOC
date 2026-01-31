import React from 'react';

const TransitionTable = ({ data }) => {
    if (!data || !data.nodes || !data.edges) return null;

    const { nodes, edges, alphabet } = data;

    // Sort nodes to ensure consistent order (q0, q1, ...)
    const sortedNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id));

    // If alphabet is missing, infer it from edges
    const derivedAlphabet = alphabet && alphabet.length > 0
        ? alphabet
        : Array.from(new Set(edges.flatMap(e => e.symbols || []))).sort();

    return (
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-800">
                <h3 className="text-lg font-bold text-white tracking-wide">Transition Table (Source of Truth)</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-blue-50">
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-gray-200">
                                State (Q)
                            </th>
                            {derivedAlphabet.map(symbol => (
                                <th key={symbol} scope="col" className="px-6 py-4 text-center text-xs font-bold text-blue-800 uppercase tracking-wider border-r border-gray-200">
                                    Input ({symbol})
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-blue-800 uppercase tracking-wider">
                                Accepting?
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedNodes.map((node, index) => (
                            <tr
                                key={node.id}
                                className={`transition-colors duration-150 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 border-r border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        {/* Start State Indicator */}
                                        <div className="w-6 flex justify-center">
                                            {node.isStart && <span className="text-blue-600 text-lg font-bold" title="Start State">→</span>}
                                        </div>

                                        {/* Accepting State Indicator */}
                                        <div className="w-4 flex justify-center">
                                            {node.isAccepting && <span className="text-purple-600 text-lg font-bold" title="Accepting State">*</span>}
                                        </div>

                                        <span className="font-mono text-base">{node.label || node.id}</span>
                                    </div>
                                </td>
                                {derivedAlphabet.map(symbol => {
                                    // Find transition for this node and symbol
                                    const targetEdges = edges.filter(e =>
                                        e.from === node.id &&
                                        ((e.symbols && e.symbols.includes(symbol)) || e.label === symbol)
                                    );

                                    const targets = targetEdges.map(e => {
                                        const targetNode = nodes.find(n => n.id === e.to);
                                        return targetNode ? (targetNode.label || targetNode.id) : e.to;
                                    });

                                    return (
                                        <td key={symbol} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center font-mono border-r border-gray-200">
                                            {targets.length > 0 ? (
                                                <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 font-medium">
                                                    {targets.join(", ")}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    {node.isAccepting ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">No</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransitionTable;
