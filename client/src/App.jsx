import React, { useState } from 'react';
import axios from 'axios';
import DiagramRenderer from './components/DiagramRenderer';
import TransitionTable from './components/TransitionTable';
import ControlPanel from './components/ControlPanel';
import { calculateLayout } from './services/layoutEngine';

function App() {
  const [diagramData, setDiagramData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (prompt) => {
    try {
      setIsGenerating(true);
      setDiagramData(null);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/generate`, { prompt });
      const { logic } = response.data;

      console.log("AI Response:", logic);

      // Check if it's the new Semantic JSON format (Node Graph)
      if (logic.nodes) {
        // LAYOUT ENGINE: Calculate (x,y) positions for the graph
        const layoutData = calculateLayout(logic);
        setDiagramData(layoutData);
      } else {
        // Legacy Turtle Mode (not supported by new renderer directly, but could add fallback)
        console.warn("Received non-semantic data:", logic);
        setError("Received legacy data format. Please use the new detailed style.");
      }

    } catch (err) {
      console.error("Error generating drawing:", err);
      // Extract specific validation message if available
      const errorMessage = err.response?.data?.error || err.message || "Failed to generate drawing instructions.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReplay = () => {
    // Replay animation not yet implemented for SVG
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          <span className="text-blue-600">Logical</span> Whiteboard
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          AI-Powered Procedural Drawing from Text
        </p>
      </header>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              {/* Icon */}
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Generation Error</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ControlPanel
            onGenerate={handleGenerate}
            onReplay={handleReplay}
            isGenerating={isGenerating}
            isPlaying={false}
          />
        </div>

        <div className="lg:col-span-3 space-y-8">
          <DiagramRenderer
            steps={diagramData}
          />

          {/* Transition Table (Source of Truth) */}
          {diagramData && (
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <TransitionTable data={diagramData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
