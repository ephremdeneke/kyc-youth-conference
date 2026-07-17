import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCodeCard from './QRCodeCard';

export default function ParticipantCard({ participant, showDownload = true }) {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85, 54] });
    pdf.addImage(imgData, 'PNG', 0, 0, 85, 54);
    pdf.save(`${participant.registrationId}-card.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="participant-card-container">
      <div ref={cardRef} className="participant-card">
        <div className="card-header">
          <div className="card-logo">⛪ KYC</div>
          <div className="card-event">Registration Card</div>
        </div>

        <div className="card-body">
          <div className="card-info">
            <h3>{participant.name}</h3>
            <p className="reg-id">{participant.registrationId}</p>
            <div className="card-details">
              <span>{participant.church}</span>
              <span>{participant.phone}</span>
              <span className={`badge ${participant.payment === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                {participant.payment || 'Unpaid'}
              </span>
            </div>
          </div>
          <QRCodeCard registrationId={participant.registrationId} size={80} />
        </div>

        <div className="card-footer">
          <span>{participant.address}</span>
        </div>
      </div>

      {showDownload && (
        <div className="card-actions no-print">
          <button onClick={handleDownload} className="btn btn-primary btn-sm">
            Download PDF
          </button>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm">
            Print Card
          </button>
        </div>
      )}

      <style>{`
        .participant-card-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .participant-card {
          width: 340px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          border-radius: 16px;
          padding: 1.25rem;
          color: white;
          box-shadow: var(--shadow-lg);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .card-logo {
          font-weight: 700;
          font-size: 1.125rem;
        }
        .card-event {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        .card-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .card-info h3 {
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
        }
        .reg-id {
          font-family: monospace;
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }
        .card-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.85;
        }
        .card-footer {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.2);
          font-size: 0.6875rem;
          opacity: 0.7;
        }
        .card-actions {
          display: flex;
          gap: 0.75rem;
        }
        @media print {
          .participant-card {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
