export function previewPath(path: string, preview?: boolean): string {
  return preview ? `${path}?preview=unlocked` : path;
}
