export function cloudinaryOptimized(url?: string | null, width = 1200) {
  if (!url) return '';
  if (!url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
