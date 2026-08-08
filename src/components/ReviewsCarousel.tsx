import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { Review } from '../data/reviews';
import { content } from '../data/content';
import { defaultSwiperProps } from '../lib/swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const t = content.reviews;

interface Props {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: Props) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasReviews = reviews.length > 0;

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Visibility-based autoplay control (no-op when there are no reviews / no swiper)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !hasReviews) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          swiperRef.current?.autoplay.start();
        } else {
          swiperRef.current?.autoplay.stop();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasReviews]);

  const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1l2.39 4.84L18 6.74l-4 3.9.94 5.5L10 13.67 5.06 16.14l.94-5.5-4-3.9 5.61-.9L10 1z"/>
    </svg>
  );

  return (
    <section ref={sectionRef} className="reviews-section" id="reviews">
      <div className="container">
        <div className="section-title">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>{t.sectionTitle}</h2>
          <p>{t.sectionSubtitle}</p>
          {t.badge && <span className="reviews-badge">{t.badge}</span>}
        </div>

        {hasReviews ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            {...defaultSwiperProps}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
          >
            {reviews.map((review, i) => (
              <SwiperSlide key={i}>
                <article className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{review.name.replace(/^Demo —\s*/, '').charAt(0)}</div>
                    <div>
                      <span className="review-name">{review.name}</span>
                      {review.location && <span className="review-loc">{review.location}</span>}
                    </div>
                  </div>
                  <div className="review-stars">
                    {[...Array(review.rating)].map((_, j) => <StarIcon key={j} />)}
                  </div>
                  <p className="review-text">
                    {!expandedCards.has(i) && review.text.length > 200
                      ? review.text.slice(0, 200) + '…'
                      : review.text}
                  </p>
                  {review.text.length > 200 && (
                    <button
                      className="review-read-more"
                      onClick={() => toggleExpand(i)}
                    >
                      {expandedCards.has(i) ? t.showLess : t.readMore}
                    </button>
                  )}
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="reviews-empty">
            <p>{t.emptyText}</p>
          </div>
        )}

        <div className="reviews-cta">
          <a href="#consultation" className="btn btn-primary btn-lg" data-open-form-modal>{t.ctaButton}</a>
        </div>
      </div>

      <style>{`
        .reviews-section {
          padding: var(--space-3xl) 0 var(--space-4xl);
          background: var(--cream-2);
        }
        .reviews-section .swiper {
          overflow-x: clip;
          overflow-y: visible;
        }
        @media (min-width: 768px) {
          .reviews-section { padding: var(--space-4xl) 0 calc(var(--space-4xl) + var(--space-lg)); }
        }
        .reviews-badge {
          display: inline-block;
          margin-top: var(--space-sm);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--champagne-dark);
          background: var(--sand);
          padding: 4px 12px;
          border-radius: var(--radius-sm);
        }
        .review-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          transition: box-shadow var(--transition-base);
        }
        .review-card:hover {
          box-shadow: var(--shadow-md);
        }
        .review-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .review-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--ink);
          color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.125rem;
          font-family: var(--font-heading);
          flex-shrink: 0;
        }
        .review-name {
          display: block;
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--ink);
        }
        .review-loc {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--ink-soft);
        }
        .review-stars {
          display: flex;
          gap: 2px;
          color: var(--champagne);
        }
        .review-text {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--ink-soft);
          flex: 1;
        }
        .review-read-more {
          color: var(--champagne-dark);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          background: none;
          border: none;
          align-self: flex-start;
          transition: color var(--transition-fast);
        }
        .review-read-more:hover {
          color: var(--ink);
        }
        .reviews-empty {
          max-width: 520px;
          margin: 0 auto;
          text-align: center;
          padding: var(--space-2xl);
          background: var(--white);
          border: 1px dashed var(--line);
          border-radius: var(--radius-lg);
        }
        .reviews-empty p {
          margin: 0;
          font-style: italic;
        }
        .reviews-cta {
          text-align: center;
          margin-top: var(--space-2xl);
        }
      `}</style>
    </section>
  );
}
