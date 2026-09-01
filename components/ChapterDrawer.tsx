'use client';

import ChapterIndexNav from './ChapterIndexNav';

/**
 * ChapterDrawer (Revised per DEC-014 & TASK-013):
 * Replaces the heavy full-screen drawer modal with the lightweight,
 * unobtrusive ChapterIndexNav (01–07 persistent index).
 * Preserves the `preview` prop signature for backward compatibility.
 */
export default function ChapterDrawer() {
  return <ChapterIndexNav />;
}
