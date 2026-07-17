export function canIssueQrAndCard(participant) {
  return (
    participant?.payment === 'Paid' &&
    String(participant?.transactionNumber || '').trim() !== ''
  );
}

export function formatTelegram(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

export function telegramLink(value) {
  const handle = String(value || '').trim().replace(/^@/, '');
  return handle ? `https://t.me/${handle}` : '';
}