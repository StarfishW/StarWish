export interface Wish {
  id: string;
  content: string;
  timestamp: number;
  blessing: string;
  likes: number;
  // Visual properties
  x: number; // Horizontal position %
  duration: number; // Animation duration in seconds
  delay: number; // Animation delay in seconds
  scale: number; // Size variation
  colorTone: 'gold' | 'red' | 'orange';
}

export interface AiResponseSchema {
  blessing: string;
  mood: string;
}

export enum AppState {
  IDLE = 'IDLE',
  WRITING = 'WRITING',
  SUBMITTING = 'SUBMITTING',
  VIEWING = 'VIEWING',
}

export type Language = 'en' | 'zh';