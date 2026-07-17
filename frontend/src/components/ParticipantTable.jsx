import { useState } from 'react';
import QRCodeCard from './QRCodeCard';
import ParticipantCard from './ParticipantCard';
import { canIssueQrAndCard, formatTelegram, telegramLink } from '../utils/participant';

export default function ParticipantTable({
  participants,
  showActions = true,
  isAdmin = false,
  onDelete,
}) {
  const [qrModal, setQrModal] = useState(null);
  const [cardModal, setCardModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !onDelete) return;

    setDeleting(true);
    try {
      await onDelete(deleteTarget);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const canShowQrCard = (participant) => isAdmin && canIssueQrAndCard(participant);

  if (!participants.length) {
    return <div className="empty-state">No registrations found in the sheet yet.</div>;
  }

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Registration ID</th>
              <th>Name</th>
              <th>Phone</th>
              {showActions && <th>Telegram</th>}
              <th>Church</th>
              <th>Gender</th>
              <th>Payment</th>
              {showActions && <th>Transaction</th>}
              <th>Date</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => {
              const verified = canIssueQrAndCard(p);
              const telegram = formatTelegram(p.telegram);
              const tgLink = telegramLink(p.telegram);

              return (
                <tr key={p.registrationId}>
                  <td>
                    <code>{p.registrationId}</code>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  {showActions && (
                    <td>
                      {telegram ? (
                        tgLink ? (
                          <a href={tgLink} target="_blank" rel="noopener noreferrer">
                            {telegram}
                          </a>
                        ) : (
                          telegram
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                  )}
                  <td>{p.church}</td>
                  <td>{p.gender}</td>
                  <td>
                    <span className={`badge ${p.payment === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                      {p.payment || 'Unpaid'}
                    </span>
                  </td>
                  {showActions && (
                    <td>{p.transactionNumber || '—'}</td>
                  )}
                  <td>{p.date}</td>
                  {showActions && (
                    <td>
                      <div className="action-buttons">
                        {isAdmin ? (
                          <>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setQrModal(p)}
                              disabled={!verified}
                              title={
                                verified
                                  ? 'View QR code'
                                  : 'Verify payment and transaction number first'
                              }
                            >
                              QR
                            </button>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setCardModal(p)}
                              disabled={!verified}
                              title={
                                verified
                                  ? 'View registration card'
                                  : 'Verify payment and transaction number first'
                              }
                            >
                              Card
                            </button>
                          </>
                        ) : (
                          <span className="admin-only-hint">Admin only</span>
                        )}
                        {onDelete && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setDeleteTarget(p)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {qrModal && (
        <div className="modal-overlay" onClick={() => setQrModal(null)}>
          <div className="modal qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>QR Code</h2>
              <button className="modal-close" onClick={() => setQrModal(null)}>
                ×
              </button>
            </div>
            <p className="modal-subtitle">{qrModal.name}</p>
            {qrModal.telegram && (
              <p className="modal-subtitle">
                Send to Telegram: {formatTelegram(qrModal.telegram)}
              </p>
            )}
            <QRCodeCard registrationId={qrModal.registrationId} size={220} />
          </div>
        </div>
      )}

      {cardModal && (
        <div className="modal-overlay" onClick={() => setCardModal(null)}>
          <div className="modal card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Registration Card</h2>
              <button className="modal-close" onClick={() => setCardModal(null)}>
                ×
              </button>
            </div>
            {cardModal.telegram && (
              <p className="modal-subtitle">
                Send to Telegram: {formatTelegram(cardModal.telegram)}
              </p>
            )}
            <ParticipantCard participant={cardModal} />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Registration</h2>
              <button
                className="modal-close"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                ×
              </button>
            </div>
            <p>
              Delete <strong>{deleteTarget.name}</strong> ({deleteTarget.registrationId}) from the
              sheet? This cannot be undone.
            </p>
            <div className="delete-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Row'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .action-buttons {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .admin-only-hint {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        code {
          font-size: 0.8125rem;
          background: var(--color-bg);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }
        .qr-modal,
        .card-modal,
        .delete-modal {
          max-width: 420px;
          text-align: center;
        }
        .delete-modal {
          text-align: left;
        }
        .delete-modal p {
          margin-bottom: 1.25rem;
          color: var(--color-text-muted);
        }
        .delete-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        .modal-subtitle {
          color: var(--color-text-muted);
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
}
