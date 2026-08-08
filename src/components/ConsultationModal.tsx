import { useEffect, useState, useRef } from 'react';
import ConsultationForm from './ConsultationForm';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock';
import { content } from '../data/content';

export default function ConsultationModal() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-open-form-modal], a[href="#consultation"]:not([data-skip-modal])'
      );
      if (!target) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lockBodyScroll();
    closeBtnRef.current?.focus();

    const FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'Tab') {
        const root = overlayRef.current;
        if (!root) return;
        const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
          .filter(el => el.offsetParent !== null || el === document.activeElement);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockBodyScroll();
      opener?.focus?.({ preventScroll: true }); // restore focus to the trigger without nudging scroll
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="cf-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cf-modal-title"
      onClick={(e) => {
        if (e.target === overlayRef.current) setOpen(false);
      }}
    >
      <div className="cf-modal-dialog">
        <button
          ref={closeBtnRef}
          type="button"
          className="cf-modal-close"
          aria-label={content.form.modalClose}
          onClick={() => setOpen(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
        <header className="cf-modal-header">
          <h2 id="cf-modal-title">{content.form.modalTitle}</h2>
          <p className="cf-modal-subtitle">{content.form.modalSubtitle}</p>
        </header>
        <div className="cf-modal-body">
          <ConsultationForm id="consultation-modal" formOnly={true} />
        </div>
      </div>

      <style>{`
        .cf-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 10010;
          background: rgba(23, 21, 15, 0.55);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: var(--space-md);
          overflow-y: auto;
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        .cf-modal-dialog {
          position: relative;
          background: var(--white);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 760px;
          margin: var(--space-2xl) 0;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .cf-modal-body {
          padding: var(--space-lg) var(--space-xl) var(--space-xl);
        }
        .cf-modal-body .consult-form {
          box-shadow: none;
          border: none;
          padding: 0;
        }
        .cf-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          background: var(--white);
          color: var(--gray-700);
          border: 1px solid var(--gray-200);
          border-radius: 50%;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .cf-modal-close:hover {
          background: var(--gray-100);
        }
        .cf-modal-header {
          padding: var(--space-xl) var(--space-2xl) var(--space-md);
          text-align: left;
          border-bottom: 1px solid var(--gray-100);
        }
        .cf-modal-header h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          color: var(--ink);
          margin: 0 0 var(--space-xs);
          letter-spacing: -0.01em;
        }
        .cf-modal-subtitle {
          font-size: 0.9375rem;
          color: var(--gray-700);
          margin: 0;
          line-height: 1.4;
        }
        @media (max-width: 767px) {
          .cf-modal-overlay {
            padding: var(--space-sm);
            align-items: flex-start;
          }
          .cf-modal-dialog {
            margin: var(--space-md) 0;
            border-radius: var(--radius-lg);
          }
          .cf-modal-body {
            padding: var(--space-md) var(--space-md) var(--space-lg);
          }
          .cf-modal-header {
            padding: var(--space-lg) var(--space-md) var(--space-sm);
            padding-right: 56px;
          }
          .cf-modal-header h2 {
            font-size: 1.25rem;
          }
          .cf-modal-close {
            top: 8px;
            right: 8px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
}
