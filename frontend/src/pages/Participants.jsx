import { useLocation, Link, Navigate } from 'react-router-dom';
import { formatTelegram } from '../utils/participant';
import ParticipantCard from '../components/ParticipantCard';
import QRCodeCard from '../components/QRCodeCard';

export default function Success() {
  const location = useLocation();
  const participant = location.state?.participant;

  if (!participant) {
    return <Navigate to="/register" replace />;
  }

  const telegram = formatTelegram(participant.telegram);
  const isPaid = participant.payment === 'Paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1 className="page-title">Registration Successful!</h1>
          <p className="page-subtitle">
            You're officially registered. Save or print your registration card and QR code below —
            you'll need them at check-in.
          </p>

          <div className="alert alert-success no-print" role="status" aria-live="polite">
            Your registration has been received{!isPaid && ', and your payment is pending verification'}.
          </div>

          {/* Registration card + QR code — this is the part that gets printed/downloaded */}
          <div className="card credentials-card" id="printable-area">
            <div className="credentials-grid">
              <div className="credentials-cell">
                <h3 className="credentials-heading">Registration Card</h3>
                <ParticipantCard participant={participant} showDownload={true} />
              </div>
              <div className="credentials-cell">
                <h3 className="credentials-heading">QR Code</h3>
                <QRCodeCard registrationId={participant.registrationId} size={160} />
              </div>
            </div>
            <div className="credentials-actions no-print">
              <button type="button" className="btn btn-secondary" onClick={handlePrint}>
                🖨️ Print
              </button>
            </div>
          </div>

          {!isPaid && (
            <div className="card pending-notice no-print">
              <h3>What happens next?</h3>
              <ol>
                <li>We review your payment and transaction number.</li>
                <li>Your payment status below will update to "Paid" once verified.</li>
                {telegram && (
                  <li>
                    We may contact you on Telegram: <strong>{telegram}</strong>
                  </li>
                )}
              </ol>
            </div>
          )}

          <div className="card success-details no-print">
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
              <span className={`badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
                {isPaid ? 'Paid' : 'Pending verification'}
              </span>
            </div>
            {participant.transactionNumber && (
              <div className="detail-row">
                <span className="detail-label">Transaction Number</span>
                <span className="detail-value">{participant.transactionNumber}</span>
              </div>
            )}
          </div>

          <Link to="/" className="btn btn-secondary no-print">
            Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        .success-content {
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        .success-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        .credentials-card {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .credentials-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-start;
          gap: 2rem;
          padding: 0.5rem 0 1rem;
        }
        .credentials-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          min-width: 160px;
        }
        .credentials-heading {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .credentials-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          padding-top: 1rem;
          margin-top: 0.5rem;
          border-top: 1px solid var(--color-border);
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

        @media print {
          .no-print {
            display: none !important;
          }
          #printable-area {
            box-shadow: none;
            border: 1px solid #ddd;
          }
        }
      `}</style>
    </div>
  );
}