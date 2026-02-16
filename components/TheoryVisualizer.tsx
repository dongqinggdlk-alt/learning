import React, { useState, useEffect } from 'react';
import { generateTheoryData } from '../services/gemini';
import Piano from './Piano';
import { TheoryResponse } from '../types';
import { Loader2, Music, Search, AlertCircle } from 'lucide-react';
import { INITIAL_PROMPT_THEORY } from '../constants';

const TheoryVisualizer: React.FC = () => {
  const [prompt, setPrompt] = useState(INITIAL_PROMPT_THEORY);
  const [data, setData] = useState<TheoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVisualize = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateTheoryData(prompt);
      setData(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate visualization");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleVisualize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Visual Harmony
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Type any scale or chord name (e.g., "Eb Minor Harmonic", "F# Major 7") and Gemini will identify the notes and visualize them.
        </p>
      </div>

      {/* Input Section */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVisualize()}
          placeholder="Enter a scale or chord..."
          className="block w-full pl-10 pr-24 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-lg"
        />
        <button
          onClick={handleVisualize}
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Visualize"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Visualization Output */}
      {data && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                   <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                     {data.type}
                   </span>
                   <h3 className="text-2xl font-bold text-white">{data.name}</h3>
                   <p className="text-slate-400 mt-1">{data.description}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {data.notes.map((note, idx) => (
                    <div key={idx} className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full font-bold text-slate-200 border border-slate-600">
                      {note}
                    </div>
                  ))}
                </div>
             </div>

             <Piano 
                activeNotes={data.notes} 
                rootNote={data.notes[0]} 
             />
          </div>

          {/* Theory Tips (Fake static for layout or could be dynamic) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                   <Music className="w-4 h-4" /> Interval Structure
                </h4>
                <p className="text-sm text-slate-400">
                  Observe the spacing between notes on the keyboard. This pattern defines the unique sound of the {data.type}.
                </p>
             </div>
             {/* Add more widgets here if needed */}
          </div>

        </div>
      )}
    </div>
  );
};

export default TheoryVisualizer;