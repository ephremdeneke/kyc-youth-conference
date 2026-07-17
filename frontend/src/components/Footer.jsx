export default function Footer() {
  return (
    <footer className="footer no-print">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>⛪ KYC Youth Conference </h3>
          <p>
            Equipping youth for spiritual growth, fellowship, and service. 
            Join us for the KYC Youth Conference 2026.
          </p>
        </div>
        
        <div className="footer-links">
          <h4>Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/register">Register Now</a></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contact & Info</h4>
          <p><span className="contact-icon">📍</span> HKC, Hossana, Ethiopia</p>
          <p><span className="contact-icon">📞</span> 095933337</p>
          <p><span className="contact-icon">📞</span> 095933338</p>
          <p><span className="contact-icon">📱</span> Telegram: https://t.me/hkcyouthministry</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} KYC Registration System. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: #090d16;
          color: #94a3b8;
          border-top: 3px solid var(--color-primary);
          padding: 4rem 0 0 0;
          margin-top: auto;
          font-size: 0.9375rem;
        }
        .footer .container {
          background: transparent;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
        }
        .footer-brand h3 {
          color: white;
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-brand p {
          line-height: 1.6;
          max-width: 320px;
          color: #a0aec0;
        }
        .footer-links h4,
        .footer-contact h4 {
          color: #eff6ff; /* White-blue */
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s;
        }
        .footer-links a:hover {
          color: var(--color-primary);
          padding-left: 4px;
        }
        .footer-contact p {
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #a0aec0;
        }
        .footer-contact p span.contact-icon {
          color: var(--color-primary);
        }
        .footer-bottom {
          border-top: 1px solid #111827;
          padding: 1.5rem 0;
          text-align: center;
          font-size: 0.875rem;
          background: #05080e;
          color: #64748b;
        }
        
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
