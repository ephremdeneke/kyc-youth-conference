import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page">
      {/* Header Section */}
      <section className="contact-header-section">
        <div className="container">
          <div className="header-content">
            <span className="section-tag">Get In Touch</span>
            <h1>Contact Our Team</h1>
            <p className="header-subtitle">
              Have questions about registrations, payments, or the youth conference program? 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <div className="info-header">
                <h2>Reach Out Directly</h2>
                <p>Choose the most convenient way to connect with our team</p>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <span className="info-icon">📍</span>
                  </div>
                  <div className="info-content">
                    <h3>Visit Us</h3>
                    <p>Main Church, Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <span className="info-icon">📧</span>
                  </div>
                  <div className="info-content">
                    <h3>Email Us</h3>
                    <p>support@kycregistration.org</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <span className="info-icon">📱</span>
                  </div>
                  <div className="info-content">
                    <h3>Telegram</h3>
                    <p>@KYC_Youth_2026</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon-wrapper">
                    <span className="info-icon">📞</span>
                  </div>
                  <div className="info-content">
                    <h3>Call Us</h3>
                    <p>+251 911 XX XX XX</p>
                  </div>
                </div>
              </div>

              <div className="response-time-card">
                <div className="response-icon">⏰</div>
                <div className="response-content">
                  <h4>Average Response Time</h4>
                  <p>Within 24 hours on business days</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="success-state">
                  <div className="success-icon">✓</div>
                  <h2>Message Sent!</h2>
                  <p>
                    Thank you for reaching out. Our team will review your message 
                    and get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                    <h2>Send Us a Message</h2>
                    <p className="form-subtitle">Fill out the form below and we'll get back to you shortly</p>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-large">
                      Send Message
                      <span className="btn-arrow">→</span>
                    </button>
                  </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page {
          background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        /* Header Section */
        .contact-header-section {
          background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
          color: white;
          padding: 5rem 2rem;
          text-align: center;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .contact-header-section h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .header-subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Section Styles */
        .section {
          padding: 5rem 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Contact Grid */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: start;
        }

        /* Contact Info */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-header h2 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .info-header p {
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          transition: all 0.3s;
        }

        .info-card:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--color-primary);
        }

        .info-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-icon {
          font-size: 1.5rem;
        }

        .info-content h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 0.25rem;
        }

        .info-content p {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin: 0;
        }

        .response-time-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          padding: 1.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .response-icon {
          font-size: 1.75rem;
        }

        .response-content h4 {
          font-size: 0.9375rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .response-content p {
          font-size: 0.8125rem;
          opacity: 0.9;
          margin: 0;
        }

        /* Contact Form */
        .contact-form-wrapper {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .contact-form h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--color-text);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          font-size: 1rem;
          border: 2px solid var(--color-border);
          border-radius: 10px;
          font-family: inherit;
          transition: all 0.2s;
          background: var(--color-bg);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 4px var(--color-primary-light);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .btn-large {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-arrow {
          font-size: 1.25rem;
          transition: transform 0.2s;
        }

        .btn-large:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Success State */
        .success-state {
          text-align: center;
          padding: 3rem 2rem;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .success-state h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: 0.75rem;
        }

        .success-state p {
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .contact-header-section h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .contact-header-section {
            padding: 3.5rem 1.5rem;
          }

          .contact-header-section h1 {
            font-size: 2rem;
          }

          .header-subtitle {
            font-size: 1rem;
          }

          .section {
            padding: 3rem 1.5rem;
          }

          .contact-form-wrapper {
            padding: 2rem 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .info-header h2 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .contact-header-section h1 {
            font-size: 1.75rem;
          }

          .contact-form-wrapper {
            padding: 1.5rem;
          }

          .info-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
