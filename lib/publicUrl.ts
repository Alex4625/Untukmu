export function previewPath(path: string, preview?: boolean): string {
  if (!preview) return path;
  return path.includes('?') ? `${path}&preview=unlocked` : `${path}?preview=unlocked`;
}

