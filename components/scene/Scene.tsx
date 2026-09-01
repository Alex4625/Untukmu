'use client';

import Image from 'next/image';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import type {
  SceneBackgroundProps,
  SceneContextType,
  SceneMediaProps,
  SceneMidgroundProps,
  SceneProps,
  SceneTextProps,
  SceneTone
} from './types';
import { playAudioCue } from './audioCue';

export const SceneContext = createContext<SceneContextType | null>(null);

export function useSceneContext(): SceneContextType {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useSceneContext must be used within a <Scene>');
  }
  return context;
}

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function getToneClasses(tone: SceneTone): { section: string; heading: string; body: string; eyebrow: string } {
  switch (tone) {
    case 'burgundy':
      return {
        section: 'bg-[#154794] text-[#FFFDF4]',
        heading: 'text-[#F9EC88]',
        body: 'text-[#FFF3CC]',
        eyebrow: 'text-[#F9EC88]'
      };
    case 'paper':
    case 'sage':
    case 'ivory':
    case 'base':
    default:
      return {
        section: 'bg-transparent text-[#252525]',
        heading: 'text-[#663300]',
        body: 'text-[#3E2723]',
        eyebrow: 'text-[#B53000]'
      };
  }
}

/**
 * Layer 1 of 3: Background Layer (DEC-015: max 3 active moving layers)
 * Ambient background with slow translateY parallax and World Frame motifs
 */
export function SceneBackground({ tone, worldFrame = true, className = '' }: SceneBackgroundProps) {
  const context = useContext(SceneContext);
  const resolvedTone = tone || context?.tone || 'base';
  const motion = context?.motion ?? 0;
  const reducedMotion = context?.reducedMotion ?? true;

  // Background parallax: slow, small magnitude (section 12)
  const bgShift = reducedMotion ? 0 : (motion - 0.5) * 16;
  const tones = getToneClasses(resolvedTone);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${tones.section} ${className}`}
    >
      {/* Parallax ambient gradient overlay */}
      <div
        className={`absolute inset-x-0 top-0 h-32 ${
          resolvedTone === 'burgundy'
            ? 'bg-[linear-gradient(180deg,rgba(0,0,0,0.30),transparent)]'
            : 'bg-[linear-gradient(180deg,rgba(247,242,234,0.65),transparent)]'
        } transition-transform duration-100 ease-out`}
        style={{ transform: reducedMotion ? undefined : `translateY(${bgShift}px)` }}
      />

      {/* World Frame: Handcrafted paper grain & subtle stippling (DEC-012, section 10.2) */}
      <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]" />

      {/* World Frame: Subtle corner lines for handcrafted feel */}
      {worldFrame && (
        <>
          <div
            className={`absolute left-4 top-4 h-6 w-6 border-l border-t ${
              resolvedTone === 'burgundy' ? 'border-gold/30' : 'border-burgundy/15'
            } sm:left-8 sm:top-8`}
          />
          <div
            className={`absolute right-4 top-4 h-6 w-6 border-r border-t ${
              resolvedTone === 'burgundy' ? 'border-gold/30' : 'border-burgundy/15'
            } sm:right-8 sm:top-8`}
          />
          <div
            className={`absolute bottom-4 left-4 h-6 w-6 border-b border-l ${
              resolvedTone === 'burgundy' ? 'border-gold/30' : 'border-burgundy/15'
            } sm:bottom-8 sm:left-8`}
          />
          <div
            className={`absolute bottom-4 right-4 h-6 w-6 border-b border-r ${
              resolvedTone === 'burgundy' ? 'border-gold/30' : 'border-burgundy/15'
            } sm:bottom-8 sm:right-8`}
          />
        </>
      )}
    </div>
  );
}

/**
 * Layer 2 of 3: Midground Layer (DEC-015: max 3 active moving layers)
 * Atmospheric / illustrative element. Per DESIGN.md section 18:
 * simplified/hidden on mobile by default to preserve performance.
 */
export function SceneMidground({ children, className = '', speed = 36 }: SceneMidgroundProps) {
  const context = useContext(SceneContext);
  const motion = context?.motion ?? 0;
  const reducedMotion = context?.reducedMotion ?? true;

  // Medium translateY parallax (section 12)
  const midShift = reducedMotion ? 0 : (motion - 0.5) * speed;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden md:block ${className}`}
      style={{
        transform: reducedMotion ? undefined : `translateY(${midShift}px)`
      }}
    >
      {children}
    </div>
  );
}

/**
 * Layer 3 of 3: Foreground Media Layer (DEC-015: max 3 active moving layers)
 * Primary visual focal point with subtle focal scale (1.0 -> 1.025)
 */
export function SceneMedia({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 1024px) 92vw, 48vw',
  aspectRatio = '4/5',
  className = ''
}: SceneMediaProps) {
  const context = useContext(SceneContext);
  const motion = context?.motion ?? 0;
  const reducedMotion = context?.reducedMotion ?? true;

  // Subtle focal scale (section 12: 1.0 -> 1.025)
  const mediaScale = reducedMotion ? 1 : 1 + motion * 0.025;

  const aspectClass =
    aspectRatio === '16/11'
      ? 'aspect-[16/11]'
      : aspectRatio === '4/3'
        ? 'aspect-[4/3]'
        : aspectRatio === 'square'
          ? 'aspect-square'
          : aspectRatio === 'auto'
            ? ''
            : 'aspect-[4/5] sm:aspect-[16/11]';

  return (
    <figure
      className={`relative mx-auto w-full max-w-2xl transition-transform duration-100 ease-out ${className}`}
      style={{ transform: reducedMotion ? undefined : `scale(${mediaScale})` }}
    >
      <div className={`relative overflow-hidden rounded-2xl border-4 border-[#8C4E28] bg-[#FFF3CC] shadow-[0_10px_28px_rgba(0,0,0,0.45)] ${aspectClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${reducedMotion ? '' : 'transition-transform duration-700 hover:scale-[1.02]'}`}
          sizes={sizes}
        />
      </div>
    </figure>
  );
}

/**
 * Staggered Narrative Text Layer (section 12)
 * Progress-based reveal (threshold 0.08 to 0.38)
 */
export function SceneText({
  eyebrow,
  title,
  body,
  meta,
  align,
  tone,
  children,
  className = ''
}: SceneTextProps) {
  const context = useContext(SceneContext);
  const resolvedAlign = align || context?.align || 'left';
  const resolvedTone = tone || context?.tone || 'base';
  const motion = context?.motion ?? 0;
  const reducedMotion = context?.reducedMotion ?? true;

  const tones = getToneClasses(resolvedTone);
  // Always 100% visible text with solid contrast
  const textOpacity = 1;
  const textShift = reducedMotion ? 0 : (1 - motion) * 8;

  return (
    <div
      className={`transition-all duration-100 ease-out ${
        resolvedAlign === 'center' ? 'mx-auto max-w-2xl text-center' : ''
      } ${className}`}
      style={{
        opacity: textOpacity,
        transform: reducedMotion ? undefined : `translateY(${textShift}px)`
      }}
    >
      {eyebrow && <p className={`eyebrow mb-1 ${tones.eyebrow}`}>{eyebrow}</p>}
      {title && (
        <h2 className={`font-nunito text-2xl sm:text-3xl font-black leading-tight ${tones.heading}`}>
          {title}
        </h2>
      )}
      <div className="stardew-divider my-3" />
      {meta && <div className="mb-2 font-nunito text-xs font-bold uppercase tracking-wider text-[#B53000]">{meta}</div>}
      {body && (
        <p
          className={`whitespace-pre-line font-nunito text-base font-bold leading-relaxed ${
            resolvedAlign === 'center' ? 'mx-auto' : ''
          } ${tones.body}`}
        >
          {body}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * Master <Scene> Component (DEC-013, DEC-015, DESIGN.md v2 section 11 & 20)
 * Reusable scrollytelling foundation with lazy activation and 3-layer architecture
 */
export function Scene({
  id,
  eyebrow,
  title,
  body,
  meta,
  media,
  midground,
  tone = 'base',
  align = 'left',
  audioCue,
  worldFrame = true,
  children
}: SceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasTriggeredAudioRef = useRef(false);
  const reducedMotion = useReducedMotion();

  // 1. Lazy activation via IntersectionObserver (DEC-015 / section 19)
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        rootMargin: '18% 0px 18% 0px',
        threshold: [0, 0.08, 0.5, 1]
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // 2. Scroll Progress calculation tied strictly to active viewport (only when active)
  useEffect(() => {
    if (!isActive || reducedMotion) return;

    let frame = 0;
    const updateProgress = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const currentProgress = clamp((window.innerHeight - rect.top) / travel);
      setProgress(currentProgress);

      // 3. Audio cue trigger: triggered ONCE when progress passes 0.20 (section 12 & 17)
      if (audioCue) {
        if (currentProgress >= 0.20 && currentProgress <= 0.85 && !hasTriggeredAudioRef.current) {
          hasTriggeredAudioRef.current = true;
          playAudioCue(audioCue);
        } else if (currentProgress < 0.05 || currentProgress > 0.95) {
          hasTriggeredAudioRef.current = false;
        }
      }
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isActive, reducedMotion, audioCue]);

  const motion = reducedMotion ? 0 : progress;

  const contextValue: SceneContextType = {
    id,
    isActive,
    progress,
    motion,
    reducedMotion,
    tone,
    align
  };

  const tones = getToneClasses(tone);

  // Layout grid configuration
  const gridClass =
    align === 'center'
      ? 'mx-auto max-w-3xl text-center'
      : align === 'right'
        ? 'lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,440px)]'
        : 'lg:grid-cols-[minmax(300px,440px)_minmax(0,1.2fr)]';

  const hasExplicitSubcomponents = !title && !body && !media && children;

  return (
    <SceneContext.Provider value={contextValue}>
      <section
        ref={ref}
        id={id}
        data-active={isActive ? 'true' : 'false'}
        className={`relative isolate py-8 sm:py-12 border-b border-[#8C4E28]/15 last:border-b-0 ${tones.section}`}
      >
        {/* Layer 1: Background */}
        <SceneBackground tone={tone} worldFrame={worldFrame} />

        {/* Layer 2: Midground (optional) */}
        {midground && <SceneMidground>{midground}</SceneMidground>}

        {/* Content container */}
        <div className="relative z-10 w-full">
          {hasExplicitSubcomponents ? (
            children
          ) : (
            <div className={`grid items-center gap-6 lg:gap-10 ${gridClass}`}>
              {/* Media for Left align */}
              {media && align !== 'right' && (
                <div className="order-2 lg:order-1">{media}</div>
              )}

              {/* Text narration block */}
              <div className={align === 'center' ? '' : align === 'right' ? 'order-1' : 'order-1 lg:order-2'}>
                <SceneText
                  eyebrow={eyebrow}
                  title={title}
                  body={body}
                  meta={meta}
                  align={align}
                  tone={tone}
                >
                  {children}
                </SceneText>
              </div>

              {/* Media for Right align */}
              {media && align === 'right' && (
                <div className="order-2 lg:order-2">{media}</div>
              )}
            </div>
          )}
        </div>
      </section>
    </SceneContext.Provider>
  );
}
