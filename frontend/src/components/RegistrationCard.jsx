import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function RegistrationCard({ participant, onClose }) {
  const cardRef = useRef(null);

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `registration-card-${participant.registrationId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`registration-card-${participant.registrationId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const shareCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      canvas.toBlob(async (blob) => {
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'registration-card.png', { type: 'image/png' })] })) {
          const file = new File([blob], `registration-card-${participant.registrationId}.png`, { type: 'image/png' });
          await navigator.share({
            title: `Registration Card - ${participant.name}`,
            text: `Registration ID: ${participant.registrationId}`,
            files: [file],
          });
        } else {
          // Fallback: copy to clipboard or show message
          alert('Sharing not supported on this browser. Please download and share manually.');
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        alert('Error sharing card. Please try downloading instead.');
      }
    }
  };

  return (
    <div className="registration-card-modal-overlay">
      <div className="registration-card-modal">
        <div className="registration-card-modal-header">
          <h3>Registration Card</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="registration-card-modal-body">
          <div ref={cardRef} className="registration-card">
            <div className="card-header">
              <div className="card-logo">
                <h2>KYC Registration</h2>
                <p>Official Registration Card</p>
              </div>
              <div className="card-qr">
                <QRCodeSVG 
                  value={JSON.stringify({
                    id: participant.registrationId,
                    name: participant.name,
                    phone: participant.phone
                  })}
                  size={100}
                  level="H"
                />
              </div>
            </div>
            
            <div className="card-body">
              <div className="card-field">
                <label>Registration ID:</label>
                <span>{participant.registrationId}</span>
              </div>
              <div className="card-field">
                <label>Full Name:</label>
                <span>{participant.name}</span>
              </div>
              <div className="card-field">
                <label>Gender:</label>
                <span>{participant.gender}</span>
              </div>
              <div className="card-field">
                <label>Age:</label>
                <span>{participant.age}</span>
              </div>
              <div className="card-field">
                <label>Phone:</label>
                <span>{participant.phone}</span>
              </div>
              <div className="card-field">
                <label>Telegram:</label>
                <span>{participant.telegram}</span>
              </div>
              <div className="card-field">
                <label>Church:</label>
                <span>{participant.church}</span>
              </div>
              <div className="card-field">
                <label>Payment Status:</label>
                <span className={`payment-status ${participant.payment.toLowerCase()}`}>
                  {participant.payment}
                </span>
              </div>
              <div className="card-field">
                <label>Registration Date:</label>
                <span>{participant.date}</span>
              </div>
            </div>
            
            <div className="card-footer">
              <p>This card serves as official proof of registration</p>
            </div>
          </div>
        </div>
        
        <div className="registration-card-modal-footer">
          <button className="btn-download-image" onClick={downloadAsImage}>
            Download Image
          </button>
          <button className="btn-download-pdf" onClick={downloadAsPDF}>
            Download PDF
          </button>
          <button className="btn-share" onClick={shareCard}>
            Share
          </button>
        </div>
      </div>
      
      <style>{`
        .registration-card-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .registration-card-modal {
          background: white;
          border-radius: 16px;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .registration-card-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .registration-card-modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a2e;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 2rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .btn-close:hover {
          background: #f3f4f6;
        }

        .registration-card-modal-body {
          padding: 2rem;
          display: flex;
          justify-content: center;
          background: #f9fafb;
        }

        .registration-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 2px solid #e5e7eb;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #667eea;
        }

        .card-logo h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 800;
          color: #667eea;
        }

        .card-logo p {
          margin: 0.5rem 0 0 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .card-qr {
          background: white;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .card-field:last-child {
          border-bottom: none;
        }

        .card-field label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .card-field span {
          color: #1a1a2e;
          font-weight: 500;
          font-size: 0.875rem;
          text-align: right;
        }

        .payment-status {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .payment-status.paid {
          background: #d1fae5;
          color: #065f46;
        }

        .payment-status.unpaid {
          background: #fef3c7;
          color: #92400e;
        }

        .card-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .card-footer p {
          margin: 0;
          font-size: 0.75rem;
          color: #9ca3af;
          font-style: italic;
        }

        .registration-card-modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          justify-content: center;
        }

        .btn-download-image,
        .btn-download-pdf,
        .btn-share {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-download-image {
          background: #667eea;
          color: white;
        }

        .btn-download-image:hover {
          background: #5568d3;
        }

        .btn-download-pdf {
          background: #10b981;
          color: white;
        }

        .btn-download-pdf:hover {
          background: #059669;
        }

        .btn-share {
          background: #f59e0b;
          color: white;
        }

        .btn-share:hover {
          background: #d97706;
        }

        @media (max-width: 768px) {
          .registration-card-modal {
            width: 95%;
            max-height: 95vh;
          }

          .registration-card-modal-body {
            padding: 1rem;
          }

          .registration-card {
            padding: 1.5rem;
          }

          .card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            text-align: center;
          }

          .registration-card-modal-footer {
            flex-direction: column;
          }

          .btn-download-image,
          .btn-download-pdf,
          .btn-share {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default RegistrationCard;
