export function getMediaUrl(mediaKeyOrUrl?: string | null, width = 1200): string {
  if (!mediaKeyOrUrl) return '';

  // If already a full URL (e.g. Cloudinary legacy URL or external audio/image URL)
  if (
    mediaKeyOrUrl.startsWith('http://') ||
    mediaKeyOrUrl.startsWith('https://') ||
    mediaKeyOrUrl.startsWith('data:') ||
    mediaKeyOrUrl.startsWith('/')
  ) {
    // Cloudinary legacy transform support if still pointing to Cloudinary
    if (mediaKeyOrUrl.includes('/upload/') && mediaKeyOrUrl.includes('cloudinary.com')) {
      return mediaKeyOrUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    }
    return mediaKeyOrUrl;
  }

  // Cloudflare Image Transformations URL pattern: /cdn-cgi/image/<params>/<r2-path>
  const cleanKey = mediaKeyOrUrl.replace(/^\/+/, '');
  return `/cdn-cgi/image/format=auto,quality=85,width=${width}/${cleanKey}`;
}
