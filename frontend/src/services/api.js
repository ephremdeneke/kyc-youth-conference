const API_URL = String(import.meta.env.VITE_API_URL || '').trim();

function assertApiUrl() {
  if (!API_URL) {
    throw new Error('API URL not configured. Set VITE_API_URL in frontend/.env');
  }
  if (API_URL.includes('docs.google.com/spreadsheets')) {
    throw new Error(
      'Use your Apps Script Web App URL, not the Google Sheet link. Deploy apps-script/Code.gs and paste the /exec URL here.'
    );
  }
}

async function request(action, data = {}) {
  assertApiUrl();

  const payload = { action, ...data };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error('Invalid response from server. Redeploy Apps Script as Web App (Anyone).');
    }

    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }
    return result;
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error(
        'Cannot reach Google Apps Script. Redeploy with Access: Anyone, then restart the dev server.'
      );
    }
    throw err;
  }
}

export async function registerParticipant(formData) {
  return request('register', formData);
}

export async function getParticipants() {
  return request('getAll');
}

export async function searchParticipants(query) {
  return request('search', { query });
}

export async function updateParticipant(id, updates) {
  return request('update', { id, ...updates });
}

export async function markPayment(id, paymentStatus) {
  return request('markPayment', { id, paymentStatus });
}

export async function getDashboardStats() {
  return request('dashboard');
}

export async function login(username, password) {
  return request('login', { username, password });
}

export async function getParticipantById(registrationId) {
  return request('getById', { registrationId });
}

export async function deleteParticipant(registrationId) {
  return request('delete', { id: registrationId });
}
