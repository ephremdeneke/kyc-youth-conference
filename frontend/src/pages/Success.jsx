import { useLocation, Link, Navigate } from 'react-router-dom';
import { formatTelegram } from '../utils/participant';

export default function Success() {
  const location = useLocation();
  const participant = location.state?.participant;

  if (!participant) {
    return <Navigate to="/register" replace />;
  }

  const telegram = formatTelegram(participant.telegram);

  return (
    <div className="page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1 className="page-title">Registration Successful!</h1>
          <p className="page-subtitle">
            You are successfully registered. Save your Registration ID below.
          </p>

          <div className="alert alert-success" role="status" aria-live="polite">
            Your registration has been received. Our team will verify your payment and transaction
            details before issuing your QR code and registration card.
          </div>

          <div className="card pending-notice">
            <h3>What happens next?</h3>
            <ol>
              <li>We review your payment and transaction number.</li>
              <li>After verification, your QR code and registration card will be sent to your Telegram.</li>
              {telegram && (
                <li>
                  We will contact you on Telegram: <strong>{telegram}</strong>
                </li>
              )}
            </ol>
            <p className="pending-note">
              QR codes and registration cards are not available on this page. Please wait for our
              message on Telegram.
            </p>
          </div>

          <div className="card success-details">
            <div className="detail-row">
              <span className="detail-label">Registration ID</span>
              <span className="detail-value reg-id">{participant.registrationId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-value">{participant.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Church</span>
              <span className="detail-value">{participant.church}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{participant.phone}</span>
            </div>
            {telegram && (
              <div className="detail-row">
                <span className="detail-label">Telegram</span>
                <span className="detail-value">{telegram}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Payment Status</span>
              <span className={`badge ${participant.payment === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                Pending verification
              </span>
            </div>
            {participant.transactionNumber && (
              <div className="detail-row">
                <span className="detail-label">Transaction Number</span>
                <span className="detail-value">{participant.transactionNumber}</span>
              </div>
            )}
          </div>

          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        .success-content {
          max-width: 520px;
          margin: 0 auto;
          text-align: center;
        }
        .success-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        .pending-notice {
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .pending-notice h3 {
          font-size: 1.0625rem;
          margin-bottom: 0.75rem;
        }
        .pending-notice ol {
          margin-left: 1.25rem;
          color: var(--color-text-muted);
          font-size: 0.9375rem;
        }
        .pending-notice li {
          margin-bottom: 0.5rem;
        }
        .pending-note {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--color-warning);
        }
        .success-details {
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.625rem 0;
          border-bottom: 1px solid var(--color-border);
          gap: 1rem;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .detail-value {
          font-weight: 500;
          text-align: right;
        }
        .reg-id {
          font-family: monospace;
          color: var(--color-primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}