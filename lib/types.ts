export type ContentStatus = 'draft' | 'active' | 'hidden';

export type Memory = {
  id: string;
  title: string;
  story: string | null;
  memory_date: string | null;
  category: string | null;
  image_url: string | null;
  cloudinary_public_id: string | null;
  status: ContentStatus;
  is_favorite: boolean;
  created_at: string;
};

export type Letter = {
  id: string;
  title: string;
  body: string;
  status: ContentStatus;
  unlock_label: string | null;
  created_at: string;
};

export type MemoryCard = {
  id: string;
  title: string;
  body: string;
  card_type: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  feedback: string | null;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
};

export type Plan = {
  id: string;
  title: string;
  note: string | null;
  plan_status: 'ingin_dilakukan' | 'direncanakan' | 'tercapai';
  status: ContentStatus;
  sort_order: number;
  created_at: string;
};

export type SiteSettings = {
  id: string;
  birthday_message: string | null;
  final_message: string | null;
  music_url: string | null;
  updated_at: string;
};

export type PublicContent = {
  memories: Memory[];
  letters: Letter[];
  memory_cards: MemoryCard[];
  quiz_questions: QuizQuestion[];
  plans: Plan[];
  site_settings: SiteSettings | null;
  unlocked: boolean;
  preview: boolean;
  unlockIso: string;
};
