/**
 * Audio cue manager for scene transitions & environmental cues
 * Meets DEC-015 and DESIGN.md v2 section 17:
 * - At most ONE audio cue active at any time (singleton)
 * - Volume strictly lower than main background music (default 0.28)
 * - Minimal preloading (metadata only or on-demand)
 * - Graceful error handling for autoplay restrictions
 */

let activeAudio: HTMLAudioElement | null = null;

export function playAudioCue(url: string, volume = 0.28): void {
  if (typeof window === 'undefined' || !url) return;

  try {
    // Stop any currently playing audio cue to avoid stacking
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }

    const audio = new Audio(url);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = 'none';

    activeAudio = audio;

    audio.play().catch(() => {
      // Browser autoplay policy blocked playback, quietly ignore
      if (activeAudio === audio) {
        activeAudio = null;
      }
    });

    audio.onended = () => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
    };
  } catch {
    // Audio creation or playback error fallback
    activeAudio = null;
  }
}

export function stopAudioCue(): void {
  if (typeof window === 'undefined') return;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}
