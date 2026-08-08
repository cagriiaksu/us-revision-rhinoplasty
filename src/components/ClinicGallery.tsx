import { useState, useEffect, useRef } from 'react';
import { content } from '../data/content';

const cg = content.clinicGallery;
const images = cg.images;

export default function ClinicGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (lightbox !== null) {
      closeRef.current?.focus({ preventScroll: true });
    } else {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [lightbox !== null]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <section className="clinic-section">
      <div className="container">
        <div className="section-title">
          <span className="eyebrow">{cg.eyebrow}</span>
          <h2>{cg.sectionTitle}</h2>
          <p>{cg.sectionSubtitle}</p>
        </div>

        <div className="clinic-grid">
          {images.map((img, i) => (
            <button
              key={i}
              className="clinic-item"
              onClick={(e) => { triggerRef.current = e.currentTarget; setLightbox(i); }}
              aria-label={`View ${img.alt}`}
            >
              <img src={img.src} alt={img.alt} className="clinic-img" width="540" height="405" loading="lazy" decoding="async" />
              <span className="clinic-tag">{img.label}</span>
              <div className="clinic-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {lightbox !== null && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <button ref={closeRef} className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close lightbox">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <img src={images[lightbox].src} alt={images[lightbox].alt} className="lightbox-img" width="1000" height="760" decoding="async" />
              <div className="lightbox-nav">
                <button
                  onClick={() => setLightbox(l => l !== null && l > 0 ? l - 1 : l)}
                  disabled={lightbox === 0}
                  aria-label="Previous image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span>{lightbox + 1} / {images.length}</span>
                <button
                  onClick={() => setLightbox(l => l !== null && l < images.length - 1 ? l + 1 : l)}
                  disabled={lightbox === images.length - 1}
                  aria-label="Next image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .clinic-section {
          padding: var(--space-3xl) 0;
          background: var(--white);
        }
        @media (min-width: 768px) {
          .clinic-section { padding: var(--space-4xl) 0; }
        }
        .clinic-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }
        .clinic-item {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          border: 1px solid var(--line);
          transition: transform var(--transition-base), box-shadow var(--transition-base);
        }
        .clinic-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .clinic-img {
          display: block;
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
        }
        .clinic-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          background: rgba(250, 247, 242, 0.92);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          pointer-events: none;
        }
        .clinic-overlay {
          position: absolute;
          inset: 0;
          background: rgba(23, 21, 15, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-base);
        }
        .clinic-item:hover .clinic-overlay {
          opacity: 1;
        }
        @media (min-width: 768px) {
          .clinic-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(23, 21, 15, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
        }
        .lightbox-close {
          position: absolute;
          top: var(--space-lg);
          right: var(--space-lg);
          z-index: 2001;
          background: none;
          cursor: pointer;
        }
        .lightbox-content {
          max-width: 800px;
          width: 100%;
        }
        .lightbox-img {
          width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: var(--radius-md);
        }
        .lightbox-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xl);
          margin-top: var(--space-lg);
          color: var(--cream);
          font-size: 0.875rem;
        }
        .lightbox-nav button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(250, 247, 242, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cream);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .lightbox-nav button:hover:not(:disabled) {
          background: var(--cream);
          border-color: var(--cream);
          color: var(--ink);
        }
        .lightbox-nav button:disabled {
          opacity: 0.3;
          cursor: default;
        }
      `}</style>
    </section>
  );
}
