import { useState, useRef } from 'react';
import { registerParticipant } from '../services/api';

const CHURCHES = [
  'Kale Heywet Church (EKHC)',
  'Evangelical Church Mekane Yesus (EECMY)',
  'Meserete Kristos Church',
  'Mulu Wongel (Full Gospel Believers Church)',
  'Zetseat Apostolic Reformation Church',
  'Independent Evangelical Churches',
];

const OTHER_CHURCH = 'Other';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  telegram: '',
  church: '',
  otherChurch: '',
  address: '',
  gender: '',
  age: '',
  payment: 'Unpaid',
  transactionNumber: '',
  screenshot: '',
  screenshotFile: null,
};

const SECTIONS = [
  { id: 1, title: 'Personal Info', icon: '👤', subtitle: 'Tell us about yourself' },
  { id: 2, title: 'Church & Location', icon: '⛪', subtitle: 'Where you worship and live' },
  { id: 3, title: 'Payment Verification', icon: '💳', subtitle: 'Provide transaction ID or screenshot' },
];

export default function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: files ? files[0] : value ?? '' };
      if (name === 'church' && value !== OTHER_CHURCH) {
        next.otherChurch = '';
      }
      return next;
    });
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const setGender = (gender) => {
    setForm((prev) => ({ ...prev, gender }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const churchValue =
      form.church === OTHER_CHURCH ? form.otherChurch.trim() : form.church;

    if (!churchValue) {
      setError(
        form.church === OTHER_CHURCH ? 'Please enter your church name.' : 'Please select a church.'
      );
      return;
    }

    if (!form.gender) {
      setError('Please select your gender.');
      return;
    }

    if (!form.transactionNumber.trim() && !form.screenshotFile) {
      setError('Please provide either a Transaction Number or upload a Payment Screenshot.');
      return;
    }

    setLoading(true);

    try {
      const payload = { ...form, church: churchValue, payment: 'Unpaid' };

      if (payload.screenshotFile) {
        payload.screenshot = await readFileAsDataUrl(payload.screenshotFile);
      }

      delete payload.screenshotFile;

      const result = await registerParticipant(payload);
      onSuccess(result.data);
      setForm(INITIAL_FORM);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-shell">
      <form onSubmit={handleSubmit} className="registration-form">
        <header className="form-hero">
          <span className="form-badge">KYC 2026 Registration</span>
          <h2>Join the Event</h2>
          <p>
            Complete all sections below. After payment verification, your QR code and registration
            card will be sent to your Telegram.
          </p>
        </header>

        {error && <div className="alert alert-error">{error}</div>}

        {SECTIONS.map((section) => (
          <section key={section.id} className="form-section">
            <div className="section-head">
              <span className="section-icon">{section.icon}</span>
              <div>
                <span className="section-step">Step {section.id}</span>
                <h3>{section.title}</h3>
                <p>{section.subtitle}</p>
              </div>
            </div>

            {section.id === 1 && (
              <div className="section-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="styled-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="0911XXXXXX"
                      className="styled-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="telegram">Telegram Username *</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">@</span>
                    <input
                      id="telegram"
                      name="telegram"
                      value={form.telegram}
                      onChange={handleChange}
                      required
                      placeholder="yourusername"
                      className="styled-input prefixed"
                    />
                  </div>
                  <p className="field-hint">QR code and registration card will be sent here.</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <div className="gender-pills">
                      {['Male', 'Female'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          className={`gender-pill ${form.gender === g ? 'active' : ''}`}
                          onClick={() => setGender(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="gender" value={form.gender} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="25"
                      className="styled-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {section.id === 2 && (
              <div className="section-body">
                <div className="form-group">
                  <label htmlFor="church">Church *</label>
                  <select
                    id="church"
                    name="church"
                    value={form.church}
                    onChange={handleChange}
                    required
                    className="styled-input"
                  >
                    <option value="">Select your church</option>
                    {CHURCHES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value={OTHER_CHURCH}>{OTHER_CHURCH}</option>
                  </select>
                </div>

                {form.church === OTHER_CHURCH && (
                  <div className="form-group highlight-box">
                    <label htmlFor="otherChurch">Other church name *</label>
                    <input
                      id="otherChurch"
                      name="otherChurch"
                      value={form.otherChurch}
                      onChange={handleChange}
                      required
                      placeholder="Enter your church name"
                      className="styled-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="City, sub-city, area..."
                    className="styled-input"
                  />
                </div>
              </div>
            )}

            {section.id === 3 && (
              <div className="section-body">
                <div className="payment-info-card">
                  <div className="payment-header">
                    <span className="payment-icon">💳</span>
                    <div>
                      <h4>Registration Fee: 800 Birr</h4>
                      <p>Pay via CBE or Bank of Abyssinia</p>
                    </div>
                  </div>
                  
                  <div className="bank-details">
                    <div className="bank-item">
                      <div className="bank-name">CBE (Commercial Bank of Ethiopia)</div>
                      <div className="bank-number">1000217185819</div>
                      <div className="bank-account">Hossana Enat Kalehiwot Church</div>
                    </div>
                    
                    <div className="bank-item">
                      <div className="bank-name">BOA (Bank of Abyssinia)</div>
                      <div className="bank-number">3102874</div>
                      <div className="bank-account">Hossana Enat Kalehiwot Church</div>
                    </div>
                  </div>

                  <div className="payment-instructions">
                    <p className="instruction-title">የክፍያ ማረጋገጫ - የባንክ ቁጥር</p>
                    <p className="instruction-text">
                      የምዝገባ ክፍያ: 800 ብር። በCBE ወይም አቢሲኒያ ባንክ ይክፈሉ፣ የክፍያ ስክሪንሾትዎን ማስፈንጠሪያ ከታች ይለጥፉ።
                    </p>
                  </div>
                </div>

                <div className="verification-notice">
                  <p className="verification-required-title">Required Payment Proof *</p>
                  <p className="verification-required-desc">
                    To verify your registration, please provide <strong>either</strong> your Transaction Number / Reference ID 
                    <strong> or</strong> upload a Screenshot of your payment transfer. You may also provide both.
                  </p>
                </div>

                <div className="verification-fields">
                  <div className="form-group">
                    <label htmlFor="transactionNumber">
                      Transaction Number / Reference ID
                    </label>
                    <input
                      id="transactionNumber"
                      name="transactionNumber"
                      value={form.transactionNumber}
                      onChange={handleChange}
                      placeholder="e.g. FT1234567890"
                      className="styled-input"
                    />
                  </div>

                  <div className="form-separator">
                    <span>— OR —</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="screenshotFile">
                      Payment Screenshot
                    </label>
                    <input
                      id="screenshotFile"
                      name="screenshotFile"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      ref={fileInputRef}
                      className="styled-input"
                    />
                    <p className="field-hint">
                      Choose a local image file. We will upload it for payment verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        ))}

        <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              Submitting...
            </>
          ) : (
            'Complete Registration →'
          )}
        </button>
      </form>

      <style>{`
        .register-shell {
          max-width: 720px;
          margin: 0 auto;
        }
        .registration-form {
          background: var(--color-surface);
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        .form-hero {
          background: linear-gradient(135deg,  #1c6d07, #0f350c 100%);
          color: white;
          padding: 2rem 2rem 1.75rem;
          text-align: center;
        }
        .form-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.35rem 0.875rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .form-hero h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .form-hero p {
          font-size: 0.9375rem;
          opacity: 0.9;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .registration-form > .alert-error {
          margin: 1.25rem 1.5rem 0;
        }
        .form-section {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid var(--color-border);
        }
        .form-section:last-of-type {
          border-bottom: none;
        }
        .section-head {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .section-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary-light);
          border-radius: 12px;
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .section-step {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .section-head h3 {
          font-size: 1.125rem;
          margin: 0.125rem 0;
        }
        .section-head p {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .styled-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          border: 2px solid var(--color-border);
          border-radius: 10px;
          font-family: inherit;
          background: #fafbfc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .styled-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 4px var(--color-primary-light);
        }
        .input-with-prefix {
          display: flex;
          align-items: stretch;
        }
        .input-prefix {
          display: flex;
          align-items: center;
          padding: 0 0.875rem;
          background: var(--color-bg);
          border: 2px solid var(--color-border);
          border-right: none;
          border-radius: 10px 0 0 10px;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .styled-input.prefixed {
          border-radius: 0 10px 10px 0;
        }
        .field-hint {
          margin-top: 0.375rem;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .gender-pills {
          display: flex;
          gap: 0.75rem;
        }
        .gender-pill {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid var(--color-border);
          border-radius: 10px;
          background: #fafbfc;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-size: 0.9375rem;
        }
        .gender-pill:hover {
          border-color: var(--color-primary);
        }
        .gender-pill.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }
        .highlight-box {
          background: #f0f9ff;
          border: 1px dashed #93c5fd;
          border-radius: 10px;
          padding: 1rem;
        }
        .payment-info-card {
          background: linear-gradient(135deg,  #1c6d07, #0f350c 100%);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          color: white;
          box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
        }
        .payment-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .payment-icon {
          font-size: 2rem;
        }
        .payment-header h4 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .payment-header p {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          opacity: 0.9;
        }
        .bank-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .bank-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .bank-name {
          font-weight: 600;
          font-size: 0.9375rem;
          margin-bottom: 0.5rem;
        }
        .bank-number {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
          font-family: 'Courier New', monospace;
        }
        .bank-account {
          font-size: 0.8125rem;
          opacity: 0.85;
        }
        .payment-instructions {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .instruction-title {
          font-weight: 700;
          font-size: 0.9375rem;
          margin: 0 0 0.5rem 0;
        }
        .instruction-text {
          font-size: 0.8125rem;
          margin: 0;
          opacity: 0.9;
          line-height: 1.6;
        }
        .verification-notice {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .verification-required-title {
          font-weight: 700;
          color: #b45309;
          font-size: 0.9375rem;
          margin-bottom: 0.375rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .verification-required-desc {
          font-size: 0.875rem;
          color: #78350f;
          line-height: 1.5;
        }
        .verification-fields {
          padding: 1.5rem;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-separator {
          text-align: center;
          position: relative;
          margin: 0.5rem 0;
        }
        .form-separator::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          border-top: 1px dashed var(--color-border);
          z-index: 1;
        }
        .form-separator span {
          background: #fdfefe;
          padding: 0 0.75rem;
          color: var(--color-text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          position: relative;
          z-index: 2;
        }
        .btn-submit {
          width: calc(100% - 3.5rem);
          margin: 0 1.75rem 1.75rem;
          padding: 1rem;
          font-size: 1.0625rem;
          font-weight: 600;
          border-radius: 12px;
          background: linear-gradient(135deg, #1c6d07, #0f350c);
        }
        .btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #1c6d07, #0f350c);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(9, 49, 11, 0.35);
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .form-hero { padding: 1.5rem 1.25rem; }
          .form-section { padding: 1.25rem; }
          .btn-submit { width: calc(100% - 2.5rem); margin: 0 1.25rem 1.25rem; }
        }
      `}</style>
    </div>
  );
}