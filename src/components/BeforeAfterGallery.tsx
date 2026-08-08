import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { PatientCase } from '../data/beforeAfter';
import { content } from '../data/content';
import { defaultSwiperProps } from '../lib/swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const t = content.beforeAfter;

// Country flag chip for the patient location line. SVGs are inline (attrs
// camelCased for JSX); the union-jack mirrors the one in CarePackage.astro.
// Add more countries to the switch as the case list grows.
function CountryFlag({ location }: { location: string }) {
  switch (location) {
    case 'United Kingdom':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="40" fill="#012169" />
            <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
            <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3.4" />
            <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="12" />
            <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="7" />
          </svg>
        </span>
      );
    case 'Poland':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="20" fill="#fff" />
            <rect y="20" width="60" height="20" fill="#DC143C" />
          </svg>
        </span>
      );
    case 'Spain':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="40" fill="#AA151B" />
            <rect y="10" width="60" height="20" fill="#F1BF00" />
          </svg>
        </span>
      );
    case 'Bulgaria':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="13.34" fill="#fff" />
            <rect y="13.33" width="60" height="13.34" fill="#00966E" />
            <rect y="26.67" width="60" height="13.33" fill="#D62612" />
          </svg>
        </span>
      );
    case 'Sweden':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="40" fill="#006AA7" />
            <rect x="18" width="7" height="40" fill="#FECC00" />
            <rect y="16.5" width="60" height="7" fill="#FECC00" />
          </svg>
        </span>
      );
    case 'Russia':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="13.34" fill="#fff" />
            <rect y="13.33" width="60" height="13.34" fill="#0039A6" />
            <rect y="26.67" width="60" height="13.33" fill="#D52B1E" />
          </svg>
        </span>
      );
    case 'United States':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="40" fill="#B22234" />
            <g fill="#fff">
              <rect y="3.08" width="60" height="3.08" />
              <rect y="9.23" width="60" height="3.08" />
              <rect y="15.38" width="60" height="3.08" />
              <rect y="21.54" width="60" height="3.08" />
              <rect y="27.69" width="60" height="3.08" />
              <rect y="33.85" width="60" height="3.08" />
            </g>
            <rect width="24" height="21.54" fill="#3C3B6E" />
            <g fill="#fff">
              <circle cx="4" cy="4.5" r="1.1" />
              <circle cx="10" cy="4.5" r="1.1" />
              <circle cx="16" cy="4.5" r="1.1" />
              <circle cx="21" cy="4.5" r="1.1" />
              <circle cx="4" cy="11" r="1.1" />
              <circle cx="10" cy="11" r="1.1" />
              <circle cx="16" cy="11" r="1.1" />
              <circle cx="21" cy="11" r="1.1" />
              <circle cx="4" cy="17.5" r="1.1" />
              <circle cx="10" cy="17.5" r="1.1" />
              <circle cx="16" cy="17.5" r="1.1" />
              <circle cx="21" cy="17.5" r="1.1" />
            </g>
          </svg>
        </span>
      );
    case 'Australia':
      return (
        <span className="ba-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" preserveAspectRatio="none">
            <rect width="60" height="40" fill="#012169" />
            {/* Union Jack canton (top-left quadrant) */}
            <path d="M0 0 L30 20 M30 0 L0 20" stroke="#fff" strokeWidth="4" />
            <path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" strokeWidth="1.7" />
            <path d="M15 0 V20 M0 10 H30" stroke="#fff" strokeWidth="6" />
            <path d="M15 0 V20 M0 10 H30" stroke="#C8102E" strokeWidth="3.4" />
            {/* Commonwealth star + Southern Cross (approx.) */}
            <g fill="#fff">
              <circle cx="15" cy="30" r="2.4" />
              <circle cx="45" cy="11" r="1.6" />
              <circle cx="52" cy="21" r="1.6" />
              <circle cx="45" cy="31" r="1.6" />
              <circle cx="38" cy="22" r="1.3" />
              <circle cx="49" cy="27" r="1" />
            </g>
          </svg>
        </span>
      );
    default:
      return null;
  }
}

interface Props {
  cases: PatientCase[];
}

export default function BeforeAfterGallery({ cases }: Props) {
  return (
    <section className="ba-section" id="before-after">
      <div className="container">
        <div className="section-title">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>{t.sectionTitle}</h2>
          <p>{t.sectionSubtitle}</p>
        </div>

        <Swiper
          modules={[Pagination]}
          {...defaultSwiperProps}
        >
          {cases.map((patient, i) => (
            <SwiperSlide key={i}>
              <div className={`ba-card${patient.instagram ? ' ba-card--ig' : ''}`}>
                <div className="ba-image-wrapper">
                  <img
                    src={patient.image}
                    alt={patient.alt}
                    width="900"
                    height="1125"
                    loading="lazy"
                    decoding="async"
                  />
                  {patient.timeframe && (
                    <span className="ba-label">{patient.timeframe}</span>
                  )}
                </div>
                {patient.caption && (
                  <div className="ba-info">
                    <div className="ba-name-row">
                      <span className="ba-name">{patient.caption}</span>
                      {patient.profession && (
                        <span className="ba-profession">– {patient.profession}</span>
                      )}
                    </div>
                    {patient.location && (
                      <span className="ba-location">
                        <CountryFlag location={patient.location} />
                        {patient.location}
                      </span>
                    )}
                    {patient.instagram && (
                      <a
                        className="ba-instagram"
                        href={`https://instagram.com/${patient.instagram.replace('@', '').toLowerCase()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="ba-ig-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
                          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
                          <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
                        </svg>
                        @{patient.instagram.replace('@', '').toLowerCase()}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {t.demoNote && <p className="ba-demo-note">{t.demoNote}</p>}

        <div className="ba-cta">
          <a
            href="#consultation"
            className="btn btn-secondary btn-lg"
            data-open-form-modal
          >
            {t.ctaButton}
          </a>
        </div>
      </div>

      <style>{`
        .ba-section {
          padding: var(--space-3xl) 0;
          background: var(--white);
        }
        .ba-section .swiper {
          overflow-x: clip;
          overflow-y: visible;
        }
        @media (min-width: 768px) {
          .ba-section { padding: var(--space-4xl) 0; }
        }
        .ba-card {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: box-shadow var(--transition-base), border-color var(--transition-base);
        }
        .ba-card:hover {
          box-shadow: var(--shadow-md);
        }
        /* Cards with a verified Instagram profile sit "forward" — a resting
           elevation + champagne edge lifts them above the flat non-IG cards. */
        .ba-card--ig {
          border-color: var(--champagne-soft);
          box-shadow: var(--shadow-lg);
          z-index: 1;
        }
        .ba-card--ig:hover {
          box-shadow: var(--shadow-xl);
        }
        .ba-section .swiper-slide {
          height: auto;
        }
        .ba-image-wrapper {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          max-height: 560px;
        }
        .ba-image-wrapper img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ba-label {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 5px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          pointer-events: none;
          background: rgba(23, 21, 15, 0.55);
          color: var(--cream);
          backdrop-filter: blur(2px);
        }
        .ba-info {
          flex: 1 1 auto;
          padding: var(--space-md) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-top: 1px solid var(--line);
        }
        .ba-name-row {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          flex-wrap: wrap;
        }
        .ba-name {
          font-weight: 600;
          color: var(--ink);
          font-size: 0.9375rem;
        }
        .ba-profession {
          font-size: 0.9375rem;
          font-weight: 400;
          color: var(--ink-soft);
        }
        .ba-instagram {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
          font-size: 0.8125rem;
          color: var(--ink-soft);
          text-decoration: none;
          transition: color var(--transition-base);
          width: fit-content;
        }
        .ba-instagram:hover {
          color: var(--champagne);
        }
        .ba-ig-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .ba-location {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--ink-soft);
        }
        .ba-flag {
          display: inline-flex;
          flex-shrink: 0;
          width: 18px;
          height: 12px;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(38, 35, 31, 0.12);
        }
        .ba-flag svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .ba-demo-note {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--ink-soft);
          font-style: italic;
          margin-top: var(--space-lg);
        }
        .ba-cta {
          text-align: center;
          margin-top: var(--space-lg);
        }
      `}</style>
    </section>
  );
}
