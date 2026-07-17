import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeCard({ registrationId, size = 160 }) {
  if (!registrationId) return null;

  return (
    <div className="qr-code-wrapper">
      <QRCodeSVG
        value={registrationId}
        size={size}
        level="H"
        includeMargin
        bgColor="#ffffff"
        fgColor="#1e40af"
      />
      <p className="qr-label">{registrationId}</p>

      <style>{`
        .qr-code-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .qr-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
