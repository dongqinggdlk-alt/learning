import React, { useState, useEffect } from 'react';
import { generateMusicImage, checkApiKeySelection, promptForKeySelection } from '../services/gemini';
import { ImageSize } from '../types';
import { Loader2, Image as ImageIcon, Download, Settings, Lock } from 'lucide-react';

const SIZES: ImageSize[] = [
  { label: '1024x1024 (1K)', value: '1K' },
  { label: '2048x2048 (2K)', value: '2K' },
  { label: '4096x4096 (4K)', value: '4K' },
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize['value']>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [keyCheckLoading, setKeyCheckLoading] = useState(true);

  const checkKey = async () => {
    setKeyCheckLoading(true);
    try {
      const selected = await checkApiKeySelection();
      setHasKey(selected);
    } catch (e) {
      console.error("Error checking key", e);
      // If error, assume false or unavailable, but let's default to false to be safe
      setHasKey(false);
    } finally {
      setKeyCheckLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleConnectBilling = async () => {
    try {
      await promptForKeySelection();
      // Assume success after dialog returns, or re-check
      await checkKey();
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // Re-verify key before call if possible, or just call
      const url = await generateMusicImage(prompt, size);
      setImageUrl(url);
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes('Requested entity was not found')) {
         // Reset key state if we get this specific error as per instructions
         setHasKey(false);
         alert("API Key not found or invalid. Please select a project again.");
      } else {
         alert("Failed to generate image: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (keyCheckLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-slate-500"/></div>;
  }

  if (!hasKey) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-12 px-4">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
           <Lock className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-3xl font-bold text-white">Unlock Professional Image Generation</h2>
        <p className="text-slate-400">
          The <strong>Nano Banana Pro (Gemini 3 Pro Image)</strong> model requires a paid API key from a Google Cloud Project.
          Please connect your billing enabled project to continue.
        </p>
        <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={handleConnectBilling}
              className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-rose-500/20"
            >
              Connect Billing & Select Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer"
              className="text-rose-400 text-sm hover:underline"
            >
              Read Billing Documentation
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <ImageIcon className="w-6 h-6 text-purple-400" />
             Studio
          </h2>
          <p className="text-slate-400 text-sm">
            Generate high-fidelity album art, instrument concepts, or atmospheric musical scenes.
          </p>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prompt</label>
           <textarea
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder="A futuristic grand piano made of glass on a beach at sunset, synthwave style..."
             className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-sm"
           />
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolution</label>
           <div className="grid grid-cols-3 gap-2">
             {SIZES.map((s) => (
               <button
                 key={s.value}
                 onClick={() => setSize(s.value)}
                 className={`
                   py-2 px-1 rounded-lg text-xs font-bold border transition-all
                   ${size === s.value 
                     ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/50' 
                     : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}
                 `}
               >
                 {s.value}
               </button>
             ))}
           </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Artwork"}
        </button>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-2">
        <div className="aspect-square bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group">
           {imageUrl ? (
             <>
               <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={imageUrl} download={`lumina-art-${Date.now()}.png`} className="bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md text-white transition-colors">
                     <Download className="w-6 h-6" />
                  </a>
               </div>
             </>
           ) : (
             <div className="text-center text-slate-600">
               <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
               <p>Your masterpiece will appear here</p>
             </div>
           )}
           {loading && (
             <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                   <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
                   <p className="text-purple-300 font-medium">Creating high-res texture...</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;