import React, { useMemo } from 'react';
import { NOTES, OCTAVES, START_OCTAVE } from '../constants';

interface PianoProps {
  activeNotes: string[]; // ['C', 'E', 'G']
  rootNote?: string;
}

const Piano: React.FC<PianoProps> = ({ activeNotes, rootNote }) => {
  // Normalize notes for comparison (basic normalization)
  const normalizedActive = useMemo(() => activeNotes.map(n => {
    // Handle simple flat to sharp conversion for visualization matching
    if (n.includes('b')) {
        // Very basic map for visualization - in a real app would be more robust
        const map: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
        return map[n] || n;
    }
    return n;
  }), [activeNotes]);

  const keys = useMemo(() => {
    const keysArray = [];
    for (let o = 0; o < OCTAVES; o++) {
      const currentOctave = START_OCTAVE + o;
      NOTES.forEach((note) => {
        const isSharp = note.includes('#');
        const isActive = normalizedActive.includes(note);
        const isRoot = rootNote === note;
        
        keysArray.push({
          note,
          octave: currentOctave,
          isSharp,
          isActive,
          isRoot,
          id: `${note}-${currentOctave}`
        });
      });
    }
    return keysArray;
  }, [normalizedActive, rootNote]);

  // Separate white and black keys for rendering order (z-index simulation via order)
  // Actually in HTML/CSS, if we use flex/grid, simpler.
  // We will use absolute positioning for black keys to sit on top of white keys standardly.
  
  const whiteKeys = keys.filter(k => !k.isSharp);
  const blackKeys = keys.filter(k => k.isSharp);

  // Helper to find position of black key
  // C=0, D=1, E=2, F=3, G=4, A=5, B=6 (Indices of white keys)
  const getBlackKeyLeftOffset = (note: string, octaveIndex: number) => {
    // Relative to the white key it follows.
    // C# is after C (index 0). D# is after D (index 1).
    // F# is after F (index 3). G# is after G (index 4). A# is after A (index 5).
    const whiteKeyWidthPercent = 100 / (whiteKeys.length);
    const octaveOffset = (octaveIndex - START_OCTAVE) * 7 * whiteKeyWidthPercent;
    
    let noteOffset = 0;
    if (note === 'C#') noteOffset = 1;
    if (note === 'D#') noteOffset = 2;
    if (note === 'F#') noteOffset = 4;
    if (note === 'G#') noteOffset = 5;
    if (note === 'A#') noteOffset = 6;
    
    // We want it centered on the line between the two white keys.
    // The previous white key ends at (noteOffset * width).
    // So center is at (noteOffset * width).
    return (noteOffset * whiteKeyWidthPercent) + octaveOffset - (whiteKeyWidthPercent * 0.3); // 0.3 is half of black key width roughly
  };

  return (
    <div className="relative w-full h-48 md:h-64 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-t-4 border-slate-700 select-none">
      {/* White Keys Container */}
      <div className="flex h-full w-full">
        {whiteKeys.map((k) => (
          <div
            key={k.id}
            className={`
              flex-1 h-full border-r border-slate-300 last:border-r-0 rounded-b-md relative
              transition-colors duration-200
              ${k.isActive 
                ? (k.isRoot ? 'bg-rose-400' : 'bg-sky-300') 
                : 'bg-white hover:bg-slate-100'}
            `}
          >
             {k.isActive && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-900 opacity-20" />
             )}
             <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium">
               {k.note}{k.octave}
             </span>
          </div>
        ))}
      </div>

      {/* Black Keys Container (Absolute Overlay) */}
      <div className="absolute top-0 left-0 w-full h-[60%] pointer-events-none">
        {blackKeys.map((k) => {
           // Calculate Left Position
           // 14 white keys total.
           const totalWhiteKeys = whiteKeys.length;
           const pctPerWhite = 100 / totalWhiteKeys;
           
           // Index of the white key BEFORE this black key in the whole set
           // C=0, C# is btwn 0 and 1.
           // Map note to 'slot'
           const baseMap: Record<string, number> = {'C#': 1, 'D#': 2, 'F#': 4, 'G#': 5, 'A#': 6};
           const octaveOffset = (k.octave - START_OCTAVE) * 7;
           const slot = baseMap[k.note] + octaveOffset;
           
           const leftPct = (slot * pctPerWhite) - (pctPerWhite * 0.35); // slightly adjusted for visual centering
           const widthPct = pctPerWhite * 0.7;

           return (
             <div
               key={k.id}
               style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
               className={`
                 absolute top-0 h-full rounded-b-md z-10 border border-slate-900 pointer-events-auto
                 shadow-lg transition-transform duration-100 active:scale-95
                 ${k.isActive 
                    ? (k.isRoot ? 'bg-rose-600' : 'bg-sky-600') 
                    : 'bg-slate-900 hover:bg-slate-800'}
               `}
             >
                {k.isActive && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                )}
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default Piano;