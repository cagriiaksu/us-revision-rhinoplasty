import { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { VideoTestimonial } from '../data/videoTestimonials';
import { content } from '../data/content';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const vt = content.videoTestimonials;

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
  namespace YT {
    const PlayerState: {
      PLAYING: number;
      PAUSED: number;
      ENDED: number;
    };
    class Player {
      constructor(
        el: HTMLElement | string,
        opts: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: Record<string, (e: { data: number }) => void>;
        },
      );
      playVideo(): void;
      pauseVideo(): void;
      destroy(): void;
    }
  }
}

interface Props {
  testimonials: VideoTestimonial[];
}

// Load the YouTube IFrame API script once, return a promise that resolves when ready
let ytApiPromise: Promise<void> | null = null;
function loadYTApi(): Promise<void> {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

function VideoPlayer({
  videoId,
  title,
  onPause,
}: {
  videoId: string;
  title: string;
  onPause: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let destroyed = false;

    loadYTApi().then(() => {
      if (destroyed || !containerRef.current) return;
      const player = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          playsinline: 1,
          controls: 1,
          modestbranding: 1,
        },
        events: {
          onStateChange: (e: { data: number }) => {
            if (destroyed) return;
            if (e.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (
              e.data === YT.PlayerState.PAUSED ||
              e.data === YT.PlayerState.ENDED
            ) {
              setIsPlaying(false);
              if (e.data === YT.PlayerState.ENDED) onPause();
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      destroyed = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // player may already be destroyed
      }
      playerRef.current = null;
    };
  }, [videoId, onPause]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Distinguish a tap (pause/play) from a swipe. On a swipe we let the touch
  // events bubble to Swiper so the carousel can change slides while a video is
  // open; only a stationary tap toggles playback.
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMovedRef = useRef(false);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setShowPauseIcon(true);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => setShowPauseIcon(false), 600);
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    touchMovedRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.touches[0];
    if (
      Math.abs(t.clientX - touchStartRef.current.x) > 10 ||
      Math.abs(t.clientY - touchStartRef.current.y) > 10
    ) {
      touchMovedRef.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchMovedRef.current) return; // a swipe — let Swiper handle it
      e.preventDefault(); // suppress the synthesized click so we don't toggle twice
      togglePlay();
    },
    [togglePlay],
  );

  return (
    <div className="vt-player">
      <div className="vt-iframe-wrapper">
        <div ref={containerRef} title={title} />
      </div>
      <div
        className="vt-tap-overlay"
        onClick={togglePlay}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {showPauseIcon && (
          <div className="vt-pause-icon">
            <span className="vt-pause-bar" />
            <span className="vt-pause-bar" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoShortsCarousel({ testimonials }: Props) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePause = useCallback(() => setPlayingIndex(null), []);

  // Auto-pause video when section scrolls out of view
  useEffect(() => {
    if (playingIndex === null || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setPlayingIndex(null);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [playingIndex]);

  // Attach navigation after refs are mounted
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;
    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
    }
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  const handlePlay = (index: number) => {
    setPlayingIndex(prev => prev === index ? null : index);
  };

  return (
    <section className="vt-section" id="video-testimonials" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <span className="eyebrow">{vt.eyebrow}</span>
          <h2>{vt.sectionTitle}</h2>
          <p>{vt.sectionSubtitle}</p>
        </div>

        <div className="vt-carousel">
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={1.03}
            centeredSlides={true}
            spaceBetween={12}
            grabCursor={true}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-bullet',
              bulletActiveClass: 'swiper-bullet--active',
            }}
            navigation={true}
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              768: { slidesPerView: 2, centeredSlides: false, spaceBetween: 24 },
              1024: { slidesPerView: 3, centeredSlides: false, spaceBetween: 32 },
            }}
            onSlideChange={() => setPlayingIndex(null)}
          >
            {testimonials.map((item, i) => {
              // DEMO ids ('DEMO-…') are placeholders until real YouTube Shorts
              // links are supplied — they render a non-playable demo tile.
              const isDemo = item.youtubeId.startsWith('DEMO');
              return (
                <SwiperSlide key={i}>
                  <div className="vt-card">
                    {!isDemo && playingIndex === i ? (
                      <VideoPlayer
                        videoId={item.youtubeId}
                        title={`${item.patientName} testimonial video`}
                        onPause={handlePause}
                      />
                    ) : (
                      <div
                        className="vt-facade"
                        onClick={isDemo ? undefined : () => handlePlay(i)}
                        role={isDemo ? undefined : 'button'}
                        tabIndex={isDemo ? undefined : 0}
                        aria-label={isDemo ? undefined : `Play ${item.procedure} patient story`}
                        onKeyDown={isDemo ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlay(i); } }}
                      >
                        <img
                          src={item.thumbnail}
                          alt={`${item.procedure} — patient story (${item.location})`}
                          width="600"
                          height="1066"
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                        {!isDemo && (
                          <span className="vt-play" aria-hidden="true">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </span>
                        )}
                        {!vt.brandedThumbnails && (
                          <div className="vt-meta">
                            <span className="vt-proc">{item.procedure}</span>
                            <span className="vt-loc">{item.location}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <button ref={prevRef} className="vt-arrow vt-arrow-prev" aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button ref={nextRef} className="vt-arrow vt-arrow-next" aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        .vt-section {
          padding: var(--space-3xl) 0 var(--space-4xl);
          background: var(--gray-50);
          overflow-x: clip;
        }
        .vt-section .section-title {
          position: relative;
          z-index: 1;
        }
        .vt-carousel {
          max-width: 89%;
          margin: 0 auto;
          position: relative;
          overflow: visible;
        }
        .vt-carousel .swiper {
          overflow-x: visible;
          overflow-y: visible;
        }
        .vt-carousel .swiper-slide {
          opacity: 0.4 !important;
          transition: opacity 0.3s ease;
        }
        .vt-carousel .swiper-slide.swiper-slide-active {
          opacity: 1 !important;
        }
        .vt-card {
          border-radius: 1.25rem;
          overflow: hidden;
          background: var(--ink);
          box-shadow: var(--shadow-md);
          max-width: 300px;
          margin: 0 auto;
        }
        .vt-facade {
          position: relative;
          width: 100%;
          /* 9:16 matches the pre-branded thumbnails (600x1066) so the baked-in
             name + logo at the bottom are never cropped. NB: .vt-player is 9/14
             — revisit to match when real (non-branded) videos are wired up. */
          aspect-ratio: 9 / 16;
          overflow: hidden;
          cursor: pointer;
        }
        .vt-facade img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
        /* Gradient overlay */
        .vt-facade::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(23,21,15,0.7) 0%, rgba(23,21,15,0.15) 45%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }
        .vt-meta {
          position: absolute;
          left: 16px;
          bottom: 16px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          pointer-events: none;
        }
        .vt-proc {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 500;
          color: var(--cream);
        }
        .vt-loc {
          font-size: 0.75rem;
          color: rgba(250, 247, 242, 0.8);
        }
        .vt-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(250, 247, 242, 0.92);
          color: var(--ink);
          padding-left: 3px;
          pointer-events: none;
        }
        /* Inline player — 9/16 matches the thumbnail (.vt-facade) so the card
           keeps the exact same size when a video starts playing. */
        .vt-player {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          background: #000;
          overflow: hidden;
          border-radius: 1.5rem;
        }
        /* Oversized wrapper to crop YouTube black bars */
        .vt-iframe-wrapper {
          position: absolute;
          width: 112%;
          height: 112%;
          top: -6%;
          left: -6%;
        }
        .vt-iframe-wrapper iframe,
        .vt-iframe-wrapper div {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          object-fit: cover;
          transform: scale(1.05);
        }
        /* Transparent overlay for tap-to-pause */
        .vt-tap-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Pause indicator */
        @keyframes vtPauseFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .vt-pause-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          animation: vtPauseFade 600ms ease forwards;
          pointer-events: none;
        }
        .vt-pause-bar {
          display: block;
          width: 5px;
          height: 20px;
          border-radius: 2px;
          background: #fff;
        }

        /* Hide default Swiper navigation arrows (blue) */
        .vt-carousel .swiper-button-next,
        .vt-carousel .swiper-button-prev {
          display: none !important;
        }

        /* Navigation arrows - hidden on mobile */
        .vt-arrow {
          display: none;
        }

        /* Tablet */
        @media (min-width: 768px) {
          .vt-section { padding: var(--space-4xl) 0 calc(var(--space-4xl) + var(--space-lg)); }
          .vt-carousel {
            max-width: 860px;
            padding: 0 var(--space-3xl);
          }
          .vt-carousel .swiper {
            overflow-x: clip;
            overflow-y: visible;
          }
          .vt-carousel .swiper-slide {
            opacity: 1 !important;
          }
          .vt-card {
            max-width: none;
            border-radius: 1.9rem;
          }
          .vt-player {
            border-radius: 1.9rem;
          }
          .vt-iframe-wrapper {
            width: 105%;
            height: 105%;
            top: -2.5%;
            left: -2.5%;
          }
          .vt-iframe-wrapper iframe,
          .vt-iframe-wrapper div {
            object-fit: initial;
            transform: none;
          }
          .vt-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid var(--ink);
            background: rgba(250, 247, 242, 0.95);
            color: var(--ink);
            cursor: pointer;
            transition: background var(--transition-fast), color var(--transition-fast);
            box-shadow: var(--shadow-sm);
          }
          .vt-arrow:hover {
            background: var(--ink);
            color: var(--cream);
          }
          .vt-arrow.swiper-button-disabled {
            opacity: 0.35;
            cursor: default;
            pointer-events: none;
          }
          .vt-arrow-prev { left: 0; }
          .vt-arrow-next { right: 0; }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .vt-carousel { padding: 0; }
          .vt-card { max-width: 260px; }
          .vt-facade, .vt-player { width: 260px; height: 460px; aspect-ratio: auto; }
          .vt-arrow-prev { left: -54px; }
          .vt-arrow-next { right: -54px; }
        }
      `}</style>
    </section>
  );
}
