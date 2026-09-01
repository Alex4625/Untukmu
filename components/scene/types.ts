import type { ReactNode } from 'react';

export type SceneTone = 'base' | 'paper' | 'burgundy' | 'ivory' | 'sage';
export type SceneAlign = 'left' | 'right' | 'center';

export type SceneContextType = {
  id: string;
  isActive: boolean;
  progress: number;
  motion: number;
  reducedMotion: boolean;
  tone: SceneTone;
  align: SceneAlign;
};

export type SceneProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  body?: string | null;
  meta?: ReactNode;
  media?: ReactNode;
  midground?: ReactNode;
  tone?: SceneTone;
  align?: SceneAlign;
  audioCue?: string;
  worldFrame?: boolean;
  children?: ReactNode;
};

export type SceneMediaProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: '4/5' | '16/11' | '4/3' | 'square' | 'auto';
  className?: string;
};

export type SceneMidgroundProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export type SceneBackgroundProps = {
  tone?: SceneTone;
  worldFrame?: boolean;
  className?: string;
};

export type SceneTextProps = {
  eyebrow?: string;
  title?: string;
  body?: string | null;
  meta?: ReactNode;
  align?: SceneAlign;
  tone?: SceneTone;
  children?: ReactNode;
  className?: string;
};
