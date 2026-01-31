import React, { useState } from 'react';
import axios from 'axios';
import DiagramRenderer from './components/DiagramRenderer';
import ControlPanel from './components/ControlPanel';
import { calculateLayout } from './services/layoutEngine';

function App() {
  const [diagramData, setDiagramData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt) => {
    try {
      setIsGenerating(true);
      setDiagramData(null);

      const response = await axios.post('http://localhost:5000/api/generate', { prompt });
      const { logic } = response.data;

      console.log("AI Response:", logic);

      // Check if it's the new Semantic JSON format (Node Graph)
      if (logic.nodes) {
        // LAYOUT ENGINE: Calculate (x,y) positions for the graph
        const layoutData = calculateLayout(logic);
        setDiagramData(layoutData);
      } else {
        // Legacy Turtle Mode (not supported by new renderer directly, but could add fallback)
        // For now, prompt should enforce semantic mode.
        console.warn("Received non-semantic data:", logic);
      }

    } catch (error) {
      console.error("Error generating drawing:", error);
      alert("Failed to generate drawing instructions.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReplay = () => {
    // Replay animation not yet implemented for SVG, simplified for now.
    // Could just re-set data to trigger animation if we added it to renderer.
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ControlPanel
            onGenerate={handleGenerate}
            onReplay={handleReplay} // Kept for UI compatibility
            isGenerating={isGenerating}
            isPlaying={false}
          />
        </div>

        <div className="lg:col-span-3">
          <DiagramRenderer
            steps={diagramData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
