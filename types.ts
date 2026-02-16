import { Type } from "@google/genai";

export enum View {
  THEORY = 'THEORY',
  CHAT = 'CHAT',
  IMAGE = 'IMAGE'
}

export enum NoteColor {
  ROOT = 'bg-red-500',
  CHORD = 'bg-blue-500',
  SCALE = 'bg-emerald-500',
  DEFAULT = 'bg-slate-100' // For white keys default
}

export interface TheoryResponse {
  name: string;
  type: 'scale' | 'chord';
  notes: string[];
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ImageSize {
  label: string;
  value: '1K' | '2K' | '4K';
}

// Augment window for AI Studio helpers
declare global {
  // The environment already declares window.aistudio with type AIStudio.
  // We augment the AIStudio interface to ensure these methods are available.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
