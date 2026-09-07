/**
 * Synthesizes a gentle, organic book page-turning sound effect using the Web Audio API.
 * Requires 0 external audio files, zero network latency, and works offline.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a soft, realistic paper rustle sound when turning a book page.
 * @param direction 'forward' | 'backward' | 'shuffle'
 */
export function playPageFlipSound(direction: 'forward' | 'backward' | 'shuffle' = 'forward'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = direction === 'shuffle' ? 0.45 : 0.32;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate textured white-pink noise simulating paper fibers sliding against each other
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 1-pole filter for pinkish warm tone
      lastOut = (lastOut * 0.7) + (white * 0.3);
      // Envelope: quick attack, textured middle, exponential decay
      const progress = i / bufferSize;
      const envelope = Math.sin(progress * Math.PI) * Math.pow(1 - progress, 0.6);
      data[i] = lastOut * envelope;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bandpass filter centered around 1800Hz with moderate Q for paper texture
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(direction === 'shuffle' ? 2200 : 1800, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Subtle frequency sweep as the page arches through the air
    if (direction === 'forward') {
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + duration);
    } else if (direction === 'backward') {
      filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + duration);
    }

    // Highpass to eliminate low thumps
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(400, ctx.currentTime);

    // Master gain: soft, polite, doesn't clash with the background music
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.22, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noiseSource.connect(filter);
    filter.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch {
    // Graceful fallback if Web Audio is unsupported or blocked by browser policy
  }
}

/**
 * Play a rich, satisfying sound when opening the heavy antique book cover.
 */
export function playBookOpenSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Part 1: Soft paper shuffle
    playPageFlipSound('shuffle');

    // Part 2: Low-frequency gentle leather resonance
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

/**
 * Play a gentle, muted thud when the heavy antique book cover closes.
 */
export function playBookCloseSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);

    // Complementary soft air rustle
    setTimeout(() => playPageFlipSound('backward'), 40);
  } catch {}
}

