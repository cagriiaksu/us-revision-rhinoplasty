import { useState } from 'react';
import type { FAQItem } from '../data/faq';
import { content } from '../data/content';

const t = content.faq;

interface Props {
  items: FAQItem[];
}

export default function FAQ({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpen(prev => (prev === index ? null : index));
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-title">
          <span className="eyebrow">{t.eyebrow}</span>
          <h2>{t.sectionTitle}</h2>
          <p>{t.sectionSubtitle}</p>
        </div>

        <div className="faq-list">
          {items.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button
                className="faq-trigger"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="faq-question">{item.question}</span>
                <span className="faq-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                className="faq-answer"
                role="region"
                inert={open !== i}
              >
                <div className="faq-answer-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .faq-section {
          padding: var(--space-3xl) 0;
          background: var(--white);
        }
        @media (min-width: 768px) {
          .faq-section { padding: var(--space-4xl) 0; }
        }
        .faq-list {
          max-width: 750px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .faq-item {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--transition-base), box-shadow var(--transition-base);
        }
        .faq-item.open {
          border-color: var(--champagne);
          box-shadow: var(--shadow-sm);
        }
        .faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          padding: var(--space-lg) var(--space-xl);
          text-align: left;
          cursor: pointer;
          background: none;
          border: none;
        }
        .faq-question {
          font-family: var(--font-heading);
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--gray-900);
          line-height: 1.4;
        }
        .faq-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--gray-50);
          color: var(--gray-600);
          transition: all var(--transition-base);
        }
        .faq-item.open .faq-icon {
          background: var(--sand);
          color: var(--champagne-dark);
          transform: rotate(180deg);
        }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .faq-item.open .faq-answer {
          max-height: 1000px;
        }
        .faq-answer-inner {
          padding: 0 var(--space-xl) var(--space-xl);
        }
        @media (max-width: 767px) {
          .faq-trigger {
            padding: var(--space-md) var(--space-lg);
          }
          .faq-answer-inner {
            padding: 0 var(--space-lg) var(--space-lg);
          }
        }
        .faq-answer-inner p {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--gray-600);
        }
      `}</style>
    </section>
  );
}
