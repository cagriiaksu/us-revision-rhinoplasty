import { useState, useRef } from 'react';
import IntlTelInput from 'intl-tel-input/react';
import type { IntlTelInputRef } from 'intl-tel-input/react';
import 'intl-tel-input/styles';
import { content } from '../data/content';
import { getFullLeadContext } from '../utils/leadTracking';

const t = content.form;

// Lead submissions POST to the Dr Atif Make.com webhook configured in
// PUBLIC_MAKE_WEBHOOK_URL (.env). If the env var is ever unset (e.g. a local
// build without .env), the form falls back to simulating success locally so no
// data is sent to a stale endpoint.
const WEBHOOK_URL = import.meta.env.PUBLIC_MAKE_WEBHOOK_URL || '';
const WEBHOOK_TIMEOUT_MS = 10_000;

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string; // honeypot field
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '',
};

interface ConsultationFormProps {
  id?: string;
  ctaText?: string;
  minimal?: boolean;
  title?: string;
  hideSectionTitle?: boolean;
  formOnly?: boolean;
}

export default function ConsultationForm({ id = 'consultation', ctaText = t.submitButton, minimal = false, title, hideSectionTitle = false, formOnly = false }: ConsultationFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const phoneValidRef = useRef(false);
  const itiRef = useRef<IntlTelInputRef>(null);

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = t.validation.nameRequired;
    if (!form.email.trim()) {
      errs.email = t.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t.validation.emailInvalid;
    }
    if (!form.phone.trim()) {
      errs.phone = t.validation.phoneRequired;
    } else if (!phoneValidRef.current) {
      errs.phone = t.validation.phoneInvalid;
    }
    setErrors(errs);
    // Consent is required (the submit button is also disabled without it — this
    // is defence-in-depth in case the disabled state is bypassed).
    return Object.keys(errs).length === 0 && consentChecked;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot — silently abort if filled
    if (form.website) return;

    setLoading(true);
    setSubmitError('');

    try {
      const { website: _hp, ...formData } = form;
      const leadContext = getFullLeadContext();

      const payload = {
        lead_id: leadContext.lead_id,
        page_variant: 'us-revision-rhinoplasty',
        language: 'en-US',
        procedure: 'revision-rhinoplasty',
        source_page: leadContext.landing_page,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        consent: consentChecked,
        submitted_at: new Date().toISOString(),
        utm: {
          utm_source: leadContext.utm_source,
          utm_medium: leadContext.utm_medium,
          utm_campaign: leadContext.utm_campaign,
          utm_content: leadContext.utm_content,
          utm_term: leadContext.utm_term,
        },
        click_ids: {
          gclid: leadContext.gclid,
          gbraid: leadContext.gbraid,
          wbraid: leadContext.wbraid,
          fbclid: leadContext.fbclid,
          msclkid: leadContext.msclkid,
        },
        device: {
          device: leadContext.device,
          screen: leadContext.screen,
          viewport: leadContext.viewport,
          language: leadContext.language,
          referrer: leadContext.referrer,
          user_agent: leadContext.user_agent,
          timezone: leadContext.timezone,
        },
        behavioral: {
          time_on_page: leadContext.time_on_page,
          scroll_depth: leadContext.scroll_depth,
        },
      };

      if (!WEBHOOK_URL) {
        // DEMO: no webhook configured — simulate success without sending data.
        console.info('[Atif LP demo] Consultation request (no webhook configured):', payload);
        setSubmitted(true);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('[Atif LP demo] Form submission failed:', err);
      setSubmitError(t.submitError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (submitted) {
    const successContent = (
      <div className="form-success">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="rgba(182,146,95,0.12)" />
            <path d="M20 32l8 8 16-16" stroke="#b6925f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2>{t.success.title}</h2>
        <p>{t.success.message}</p>
      </div>
    );

    const successStyles = (
      <style>{`
        .form-success {
          text-align: center;
          padding: var(--space-3xl) var(--space-xl);
        }
        .success-icon { margin-bottom: var(--space-xl); }
        .form-success h2 {
          font-family: var(--font-heading);
          color: var(--ink);
          margin-bottom: var(--space-md);
          font-size: 2rem;
        }
        .form-success p {
          margin-bottom: 0;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    );

    if (formOnly) {
      return (
        <>
          {successContent}
          {successStyles}
        </>
      );
    }

    return (
      <section className="form-section" id={id}>
        <div className="container">{successContent}</div>
        {successStyles}
      </section>
    );
  }

  const formMarkup = (
    <form className="consult-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="cf-name">{t.labels.fullName}</label>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          placeholder={t.placeholders.fullName}
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cf-email">{t.labels.email}</label>
        <input
          id="cf-email"
          type="email"
          autoComplete="email"
          placeholder={t.placeholders.email}
          value={form.email}
          onChange={e => handleChange('email', e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group form-group--phone">
        <label htmlFor="cf-phone">{t.labels.phone}</label>
        <IntlTelInput
          ref={itiRef}
          loadUtils={() => import('intl-tel-input/utils')}
          onChangeNumber={(number) => handleChange('phone', number)}
          onChangeValidity={(valid) => { phoneValidRef.current = valid; }}
          inputProps={{
            id: 'cf-phone',
            className: errors.phone ? 'error' : '',
            autoComplete: 'tel',
          }}
          initialCountry="auto"
          geoIpLookup={(success) => {
            fetch('https://ipapi.co/json')
              .then(res => res.json())
              .then(data => success(data.country_code?.toLowerCase() || 'gb'))
              .catch(() => success('gb'));
          }}
          separateDialCode={true}
          formatAsYouType={true}
          strictMode={true}
          autoPlaceholder="aggressive"
          placeholderNumberType="MOBILE"
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      {!minimal && (
        <div className="form-group">
          <label htmlFor="cf-message">{t.labels.message}</label>
          <textarea
            id="cf-message"
            rows={2}
            placeholder={t.placeholders.message}
            value={form.message}
            onChange={e => handleChange('message', e.target.value)}
          />
        </div>
      )}

      {/* Honeypot — hidden from real users, bots fill it */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={form.website}
          onChange={e => handleChange('website', e.target.value)}
        />
      </div>

      {submitError && <p className="submit-error">{submitError}</p>}

      <label className="form-consent">
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          required
        />
        <span>{t.consent}</span>
      </label>

      <button type="submit" className="btn btn-primary btn-lg form-submit" disabled={loading || !consentChecked}>
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            {t.submitting}
          </>
        ) : (
          ctaText
        )}
      </button>
    </form>
  );

  const formStyles = (
    <style>{`
        .form-section {
          padding: var(--space-3xl) 0;
          background: var(--white);
        }
        @media (min-width: 768px) {
          .form-section { padding: var(--space-4xl) 0; }
        }
        .form-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-2xl);
          max-width: 900px;
          margin: 0 auto;
        }
        .form-info h3 {
          font-family: var(--font-heading);
          font-size: 1.375rem;
          color: var(--ink);
          margin-bottom: var(--space-lg);
        }
        .form-benefits {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .form-benefits li {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          font-size: 1rem;
          color: var(--gray-800);
        }
        .form-benefits svg { flex-shrink: 0; }
        .form-privacy {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-xl);
          padding: var(--space-md) var(--space-lg);
          background: rgba(182,146,95,0.06);
          border: 1px solid rgba(182,146,95,0.15);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--gray-700);
          font-weight: 500;
        }
        .form-privacy svg { flex-shrink: 0; }
        .consult-form {
          background: var(--white);
          padding: var(--space-2xl);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-100);
        }
        .form-group {
          margin-bottom: var(--space-lg);
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 6px;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: border-color var(--transition-fast);
          background: var(--white);
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--champagne);
          box-shadow: 0 0 0 3px rgba(182,146,95,0.1);
        }
        .form-group input.error,
        .form-group textarea.error {
          border-color: var(--red);
        }
        .form-group--phone .iti {
          width: 100%;
        }
        .form-group--phone .iti .iti__tel-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 1rem;
          height: auto;
          transition: border-color var(--transition-fast);
          background: var(--white);
          font-family: var(--font-body);
        }
        .form-group--phone .iti .iti__tel-input:focus {
          border-color: var(--champagne);
          box-shadow: 0 0 0 3px rgba(182,146,95,0.1);
          outline: none;
        }
        .form-group--phone .iti .iti__tel-input.error {
          border-color: var(--red);
        }
        .form-group--phone .iti__country-container .iti__selected-country {
          padding: 8px 12px;
          background: var(--gray-50);
          border-radius: var(--radius-md) 0 0 var(--radius-md);
        }
        .form-group--phone .iti__country-container .iti__selected-country:hover {
          background: var(--gray-100);
        }
        .form-group--phone .iti__selected-dial-code {
          font-size: 1rem;
          color: var(--gray-900);
          margin-left: 4px;
        }
        .iti__dropdown-content {
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
        }
        .iti__search-input {
          padding: 8px 12px;
          border: 1.5px solid var(--gray-200);
          border-radius: var(--radius-md);
        }
        .iti__search-input:focus {
          border-color: var(--champagne);
          outline: none;
        }
        .field-error {
          display: block;
          color: var(--red);
          font-size: 0.8125rem;
          margin-top: 4px;
        }
        .form-submit {
          width: 100%;
          margin-top: var(--space-sm);
        }
        .submit-error {
          color: var(--red);
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: var(--space-sm);
        }
        .form-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .hp-field {
          position: absolute;
          left: -9999px;
          height: 0;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: var(--white);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          vertical-align: middle;
          margin-right: 6px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-consent {
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
          font-size: 0.75rem;
          color: var(--gray-600);
          margin-bottom: var(--space-md);
          cursor: pointer;
          line-height: 1.4;
        }
        .form-consent input[type="checkbox"] {
          margin-top: 2px;
          flex-shrink: 0;
          accent-color: var(--champagne);
          cursor: pointer;
        }
        @media (max-width: 767px) {
          .consult-form {
            padding: var(--space-lg) var(--space-md);
          }
        }
        @media (min-width: 768px) {
          .form-wrapper {
            grid-template-columns: 1fr 1.2fr;
          }
          .consult-form {
            padding: var(--space-xl);
          }
          .form-group {
            margin-bottom: var(--space-md);
          }
        }
        .form-section--minimal {
          background: var(--white);
        }
        .form-section--minimal .form-wrapper {
          max-width: 560px;
          grid-template-columns: 1fr;
        }
      `}</style>
  );

  if (formOnly) {
    return (
      <>
        {formMarkup}
        {formStyles}
      </>
    );
  }

  return (
    <section className={`form-section${minimal ? ' form-section--minimal' : ''}`} id={id}>
      <div className="container">
        {!hideSectionTitle && !minimal ? (
          <div className="section-title">
            <h2>{t.sectionTitle}</h2>
            <p>{t.sectionSubtitle}</p>
          </div>
        ) : !hideSectionTitle && title ? (
          <div className="section-title">
            {minimal ? <h3>{title}</h3> : <h2>{title}</h2>}
          </div>
        ) : null}

        <div className="form-wrapper">
          {!minimal && (
            <div className="form-info">
              <h3>{t.infoTitle}</h3>
              <ul className="form-benefits">
                {t.benefits.map((b, i) => (
                  <li key={i}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="rgba(182,146,95,0.15)"/><path d="M6 10l3 3 5-5" stroke="#b6925f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="form-privacy">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L2 4v4c0 3.5 2.6 6.8 6 7.6 3.4-.8 6-4.1 6-7.6V4L8 1z" stroke="#b6925f" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5.5 8l2 2 3-3" stroke="#b6925f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{t.privacyNote}</span>
              </div>
            </div>
          )}

          {formMarkup}
        </div>
      </div>

      {formStyles}
    </section>
  );
}
