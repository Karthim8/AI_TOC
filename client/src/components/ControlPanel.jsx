import React, { useState } from 'react';
import { Send, Play, RotateCcw } from 'lucide-react';

const ControlPanel = ({ onGenerate, onReplay, isGenerating, isPlaying }) => {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Drawing Controls</h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instruction
                    </label>
                    <textarea
                        className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="e.g., Draw a square of size 100..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isGenerating || isPlaying}
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isGenerating || isPlaying || !prompt}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isGenerating ? 'Generating...' : <><Send size={18} /> Generate & Draw</>}
                    </button>

                    <button
                        type="button"
                        onClick={onReplay}
                        disabled={isGenerating || isPlaying}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        <RotateCcw size={18} /> Replay
                    </button>
                </div>
            </form>

            <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Instructions</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                    <li>"Draw a triangle"</li>
                    <li>"Draw a house"</li>
                    <li>"Move 100 turn 90..."</li>
                </ul>
            </div>
        </div>
    );
};

export default ControlPanel;
