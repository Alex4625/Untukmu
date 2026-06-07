export const allowedResources = ['memories', 'letters', 'memory_cards', 'quiz_questions', 'plans', 'site_settings'] as const;
export type Resource = (typeof allowedResources)[number];

export function isAllowedResource(value: string): value is Resource {
  return (allowedResources as readonly string[]).includes(value);
}
