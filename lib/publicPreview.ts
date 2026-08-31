import { isAdminRequest } from './adminAuth';
export { previewPath } from './publicUrl';

export type PageSearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

export async function isPreviewRequest(searchParams?: PageSearchParams) {
  const params = searchParams ? await searchParams : undefined;
  const preview = readParam(params, 'preview') === 'unlocked';
  return preview && (await isAdminRequest());
}

function readParam(params: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}
