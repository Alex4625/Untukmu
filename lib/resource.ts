export const allowedResources = ['memories', 'letters', 'memory_cards', 'quiz_questions', 'plans', 'site_settings'] as const;
export type Resource = (typeof allowedResources)[number];

export function isAllowedResource(value: string): value is Resource {
  return (allowedResources as readonly string[]).includes(value);
}

type ValidationMode = 'create' | 'update';

type FieldType = 'string' | 'date' | 'number' | 'boolean' | 'status' | 'correct_option' | 'plan_status';

type FieldRule = {
  type: FieldType;
  required?: boolean;
  nullable?: boolean;
  maxLength?: number;
};

const fieldRules: Record<Resource, Record<string, FieldRule>> = {
  memories: {
    title: { type: 'string', required: true, maxLength: 160 },
    story: { type: 'string', nullable: true, maxLength: 5000 },
    memory_date: { type: 'date', nullable: true },
    category: { type: 'string', nullable: true, maxLength: 80 },
    image_url: { type: 'string', nullable: true, maxLength: 2000 },
    cloudinary_public_id: { type: 'string', nullable: true, maxLength: 255 },
    status: { type: 'status' },
    is_favorite: { type: 'boolean' }
  },
  letters: {
    title: { type: 'string', required: true, maxLength: 160 },
    body: { type: 'string', required: true, maxLength: 20000 },
    unlock_label: { type: 'string', nullable: true, maxLength: 120 },
    status: { type: 'status' }
  },
  memory_cards: {
    title: { type: 'string', required: true, maxLength: 160 },
    body: { type: 'string', required: true, maxLength: 8000 },
    card_type: { type: 'string', nullable: true, maxLength: 80 },
    status: { type: 'status' },
    sort_order: { type: 'number' }
  },
  quiz_questions: {
    question: { type: 'string', required: true, maxLength: 500 },
    option_a: { type: 'string', required: true, maxLength: 300 },
    option_b: { type: 'string', required: true, maxLength: 300 },
    option_c: { type: 'string', required: true, maxLength: 300 },
    option_d: { type: 'string', required: true, maxLength: 300 },
    correct_option: { type: 'correct_option' },
    feedback: { type: 'string', nullable: true, maxLength: 1000 },
    status: { type: 'status' },
    sort_order: { type: 'number' }
  },
  plans: {
    title: { type: 'string', required: true, maxLength: 160 },
    note: { type: 'string', nullable: true, maxLength: 3000 },
    plan_status: { type: 'plan_status' },
    status: { type: 'status' },
    sort_order: { type: 'number' }
  },
  site_settings: {
    birthday_message: { type: 'string', nullable: true, maxLength: 10000 },
    final_message: { type: 'string', nullable: true, maxLength: 20000 },
    music_url: { type: 'string', nullable: true, maxLength: 2000 }
  }
};

const contentStatuses = new Set(['draft', 'active', 'hidden']);
const correctOptions = new Set(['A', 'B', 'C', 'D']);
const planStatuses = new Set(['ingin_dilakukan', 'direncanakan', 'tercapai']);

export function sanitizeContentInput(resource: Resource, value: unknown, mode: ValidationMode) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Body harus berupa object JSON.');
  }

  const input = value as Record<string, unknown>;
  const rules = fieldRules[resource];
  const output: Record<string, unknown> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const hasValue = Object.prototype.hasOwnProperty.call(input, field);
    if (!hasValue) {
      if (mode === 'create' && rule.required) throw new Error(`${field} wajib diisi.`);
      continue;
    }
    output[field] = sanitizeField(field, input[field], rule);
  }

  if (!Object.keys(output).length) {
    throw new Error('Tidak ada field valid untuk disimpan.');
  }

  return output;
}

function sanitizeField(field: string, value: unknown, rule: FieldRule) {
  if (value === '' && rule.nullable) return null;
  if (value == null) {
    if (rule.nullable) return null;
    throw new Error(`${field} tidak valid.`);
  }

  if (rule.type === 'string') {
    if (typeof value !== 'string') throw new Error(`${field} harus berupa teks.`);
    if (rule.required && value.trim().length === 0) throw new Error(`${field} wajib diisi.`);
    if (rule.maxLength && value.length > rule.maxLength) throw new Error(`${field} terlalu panjang.`);
    return value;
  }

  if (rule.type === 'date') {
    if (typeof value !== 'string' || !isValidDate(value)) throw new Error(`${field} harus berupa tanggal.`);
    return value;
  }

  if (rule.type === 'number') {
    const numberValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isInteger(numberValue)) throw new Error(`${field} harus berupa angka bulat.`);
    return numberValue;
  }

  if (rule.type === 'boolean') {
    if (typeof value !== 'boolean') throw new Error(`${field} harus berupa boolean.`);
    return value;
  }

  if (rule.type === 'status') {
    if (typeof value !== 'string' || !contentStatuses.has(value)) throw new Error(`${field} tidak valid.`);
    return value;
  }

  if (rule.type === 'correct_option') {
    if (typeof value !== 'string' || !correctOptions.has(value)) throw new Error(`${field} tidak valid.`);
    return value;
  }

  if (typeof value !== 'string' || !planStatuses.has(value)) throw new Error(`${field} tidak valid.`);
  return value;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
