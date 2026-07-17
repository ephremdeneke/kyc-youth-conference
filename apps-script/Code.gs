/**
 * KYC Registration System - Google Apps Script Backend
 *
 * Setup:
 * 1. Create a new Google Sheet with headers in row 1 in this exact order:
 *    Registration ID | Full Name | Gender | Age | Phone | Telegram Username | Address | Church | Payment Status | Transaction Number | Screenshot | Timestamp
 * 2. Copy this script to Apps Script editor (Extensions > Apps Script)
 * 3. Set SPREADSHEET_ID below to your sheet ID
 * 4. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 5. Copy the deployment URL to frontend .env as VITE_API_URL
 */

const SPREADSHEET_ID = '1FPSoyy6GldFTWAROxzQeyK85AkOm4QyDtefi0R6SYAg';
const SHEET_GID = 360578111; // tab from your sheet URL (#gid=...)
const SHEET_NAME = 'Registrations'; // fallback if gid not found
const ID_PREFIX = 'KYC/T18';
const DRIVE_FOLDER_ID = ''; // Optional: set a folder ID to store screenshot uploads

// Centralized column mapping - MUST match Google Sheet column order exactly
const COLUMN_HEADERS = [
  'ID',
  'Full Name',
  'Gender',
  'Age',
  'Phone',
  'telegram user',
  'Address',
  'Church',
  'pyment status',
  'Transaction number',
  'Screenshot',
  'Timestamp'
];

// Column indices (0-based)
const COL = {
  REGISTRATION_ID: 0,
  FULL_NAME: 1,
  GENDER: 2,
  AGE: 3,
  PHONE: 4,
  TELEGRAM: 5,
  ADDRESS: 6,
  CHURCH: 7,
  PAYMENT_STATUS: 8,
  TRANSACTION_NUMBER: 9,
  SCREENSHOT: 10,
  TIMESTAMP: 11
};

// Staff credentials (change these!)
const STAFF_USERS = {
  admin: { password: 'admin123', role: 'admin' },
  desk: { password: 'desk123', role: 'desk' },
};

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = e.parameter || {};
    const payload = e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : params;

    const action = payload.action || params.action;
    let result;

    switch (action) {
      case 'register':
        result = registerParticipant(payload);
        break;
      case 'getAll':
        result = getAllParticipants();
        break;
      case 'search':
        result = searchParticipants(payload.query);
        break;
      case 'update':
        result = updateParticipant(payload.id, payload);
        break;
      case 'markPayment':
        result = markPayment(payload.id, payload.paymentStatus);
        break;
      case 'dashboard':
        result = getDashboardStats();
        break;
      case 'login':
        result = staffLogin(payload.username, payload.password);
        break;
      case 'getById':
        result = getParticipantById(payload.registrationId);
        break;
      case 'delete':
        result = deleteParticipant(payload.id);
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }

    return jsonResponse({ success: true, data: result });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message });
  }
}

function getSpreadsheet() {
  let ss = null;
  
  // 1. Try SPREADSHEET_ID if set and valid
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE' && SPREADSHEET_ID !== '1FPSoyy6GldFTWAROxzQeyK85AkOm4QyDtefi0R6SYAg') {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      console.warn("Could not open spreadsheet by ID: " + e.message);
    }
  }
  
  // 2. Fallback to active spreadsheet (if script is container-bound)
  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      console.warn("Could not open active spreadsheet: " + e.message);
    }
  }

  // 3. Fallback: Try openById with default ID if nothing else worked
  if (!ss && SPREADSHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      throw new Error("Could not open spreadsheet: " + e.message);
    }
  }

  if (!ss) {
    throw new Error("Spreadsheet not found. Please set SPREADSHEET_ID in Code.gs or bind the script to your spreadsheet.");
  }
  return ss;
}

function getSheet() {
  const ss = getSpreadsheet();
  let sheet = getSheetByGid(ss, SHEET_GID);

  if (!sheet) {
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  // Fallback: Use the first sheet if the specified one doesn't exist
  if (!sheet) {
    const sheets = ss.getSheets();
    if (sheets.length > 0) {
      sheet = sheets[0];
    }
  }

  // Fallback: Insert a sheet if completely empty
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  ensureHeaders(sheet);
  return sheet;
}

function getSheetByGid(ss, gid) {
  const sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) {
      return sheets[i];
    }
  }
  return null;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.appendRow(COLUMN_HEADERS);
  sheet.getRange(1, 1, 1, COLUMN_HEADERS.length).setFontWeight('bold');
}

function getHeaderIndices(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return {};
  const headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });

  return {
    registrationId: headers.indexOf('registration id') >= 0 ? headers.indexOf('registration id') : headers.indexOf('id'),
    date: headers.indexOf('timestamp'),
    name: headers.indexOf('full name') >= 0 ? headers.indexOf('full name') : headers.indexOf('name'),
    gender: headers.indexOf('gender'),
    age: headers.indexOf('age'),
    phone: headers.indexOf('phone'),
    telegram: headers.indexOf('telegram username') >= 0 ? headers.indexOf('telegram username') : headers.indexOf('telegram user') >= 0 ? headers.indexOf('telegram user') : headers.indexOf('telegram'),
    address: headers.indexOf('address'),
    church: headers.indexOf('church'),
    payment: headers.indexOf('payment status') >= 0 ? headers.indexOf('payment status') : headers.indexOf('pyment status') >= 0 ? headers.indexOf('pyment status') : headers.indexOf('payment'),
    transactionNumber: headers.indexOf('transaction number'),
    screenshot: headers.indexOf('screenshot')
  };
}

function getOrAddColumn(sheet, headerName) {
  // This function is kept for backward compatibility but should not be used
  // All column access should use the centralized COL constants
  const data = sheet.getDataRange().getValues();
  const headers = data.length > 0 ? data[0].map(function(h) { return String(h).trim().toLowerCase(); }) : [];
  const query = headerName.toLowerCase();
  
  let idx = headers.indexOf(query);
  if (idx < 0) {
    if (query === 'full name') {
      idx = headers.indexOf('name');
    } else if (query === 'name') {
      idx = headers.indexOf('full name');
    }
  }

  if (idx >= 0) {
    return idx;
  }

  const nextCol = sheet.getLastColumn() + 1;
  sheet.getRange(1, nextCol).setValue(headerName).setFontWeight('bold');
  return nextCol - 1;
}

function rowToParticipant(row, indices) {
  return {
    registrationId: indices.registrationId >= 0 ? String(row[indices.registrationId]) : '',
    name: indices.name >= 0 ? String(row[indices.name]) : '',
    gender: indices.gender >= 0 ? String(row[indices.gender]) : '',
    age: indices.age >= 0 ? String(row[indices.age]) : '',
    phone: indices.phone >= 0 ? String(row[indices.phone]) : '',
    telegram: indices.telegram >= 0 ? String(row[indices.telegram]) : '',
    address: indices.address >= 0 ? String(row[indices.address]) : '',
    church: indices.church >= 0 ? String(row[indices.church]) : '',
    payment: indices.payment >= 0 ? String(row[indices.payment]) : '',
    transactionNumber: indices.transactionNumber >= 0 ? String(row[indices.transactionNumber]) : '',
    screenshot: indices.screenshot >= 0 ? String(row[indices.screenshot]) : '',
    date: indices.date >= 0 ? String(row[indices.date]) : ''
  };
}

function generateRegistrationId() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  const nextNumber = Math.max(lastRow - 1, 0) + 1; // row 1 is headers
  return ID_PREFIX + '/' + String(nextNumber).padStart(4, '0');
}

function registerParticipant(data) {
  const sheet = getSheet();
  const registrationId = generateRegistrationId();
  const now = new Date();
  const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  var screenshotValue = data.screenshot || '';
  if (typeof screenshotValue === 'string' && screenshotValue.indexOf('data:image/') === 0) {
    screenshotValue = saveScreenshotToDrive(screenshotValue, registrationId);
  }

  // Build row in exact column order matching Google Sheet
  const row = [
    registrationId,                    // 0: ID
    data.fullName || data.name || '',  // 1: Full Name
    data.gender || '',                 // 2: Gender
    data.age || '',                    // 3: Age
    data.phone || '',                  // 4: Phone
    data.telegram || '',               // 5: telegram user
    data.address || '',                // 6: Address
    data.church || '',                 // 7: Church
    data.payment || 'Unpaid',          // 8: pyment status
    data.transactionNumber || '',       // 9: Transaction number
    screenshotValue || '',             // 10: Screenshot
    dateStr                            // 11: Timestamp
  ];

  sheet.appendRow(row);

  // Return consistent field names matching frontend expectations
  return {
    registrationId: registrationId,
    name: data.fullName || data.name || '',
    phone: data.phone || '',
    telegram: data.telegram || '',
    address: data.address || '',
    gender: data.gender || '',
    age: data.age || '',
    church: data.church || '',
    payment: data.payment || 'Unpaid',
    transactionNumber: data.transactionNumber || '',
    screenshot: screenshotValue || '',
    date: dateStr,
  };
}

function saveScreenshotToDrive(dataUrl, registrationId) {
  var match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return dataUrl;
  }

  var contentType = match[1];
  var base64Data = match[2];
  var extension = contentType.split('/')[1] || 'png';
  var fileName = 'payment-screenshot-' + registrationId + '.' + extension;
  var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), contentType, fileName);

  var folder = DriveApp.getRootFolder();
  if (DRIVE_FOLDER_ID) {
    try {
      folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    } catch (err) {
      folder = DriveApp.getRootFolder();
    }
  }

  var file = folder.createFile(blob);
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    // Ignore sharing errors
  }

  return file.getUrl();
}

function getAllParticipants() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const indices = getHeaderIndices(sheet);

  return data.slice(1).map(function (row) {
    return rowToParticipant(row, indices);
  }).filter(function (p) {
    return p.registrationId && String(p.registrationId).trim() !== '';
  });
}

function searchParticipants(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return getAllParticipants();

  return getAllParticipants().filter(function (p) {
    return (
      (p.registrationId && p.registrationId.toLowerCase().indexOf(q) !== -1) ||
      (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
      (p.phone && p.phone.indexOf(q) !== -1) ||
      (p.telegram && String(p.telegram).toLowerCase().indexOf(q) !== -1) ||
      (p.church && p.church.toLowerCase().indexOf(q) !== -1)
    );
  });
}

function getParticipantById(registrationId) {
  const participants = getAllParticipants();
  const found = participants.find(function (p) {
    return p.registrationId === registrationId;
  });

  if (!found) {
    throw new Error('Participant not found');
  }

  return found;
}

function findRowById(registrationId) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) throw new Error('No data found in sheet');

  const indices = getHeaderIndices(sheet);
  const regIdIdx = indices.registrationId;

  if (regIdIdx < 0) {
    throw new Error('Registration ID column not found in sheet');
  }

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][regIdIdx]).trim() === String(registrationId).trim()) {
      return i + 1;
    }
  }

  throw new Error('Participant not found');
}

function updateParticipant(registrationId, updates) {
  const sheet = getSheet();
  const rowNum = findRowById(registrationId);

  const fields = [
    { key: 'name', updateKeys: ['fullName', 'name'], label: 'Full Name', col: COL.FULL_NAME },
    { key: 'gender', updateKeys: ['gender'], label: 'Gender', col: COL.GENDER },
    { key: 'age', updateKeys: ['age'], label: 'Age', col: COL.AGE },
    { key: 'phone', updateKeys: ['phone'], label: 'Phone', col: COL.PHONE },
    { key: 'telegram', updateKeys: ['telegram'], label: 'telegram user', col: COL.TELEGRAM },
    { key: 'address', updateKeys: ['address'], label: 'Address', col: COL.ADDRESS },
    { key: 'church', updateKeys: ['church'], label: 'Church', col: COL.CHURCH },
    { key: 'payment', updateKeys: ['payment'], label: 'pyment status', col: COL.PAYMENT_STATUS },
    { key: 'transactionNumber', updateKeys: ['transactionNumber'], label: 'Transaction number', col: COL.TRANSACTION_NUMBER },
    { key: 'screenshot', updateKeys: ['screenshot'], label: 'Screenshot', col: COL.SCREENSHOT }
  ];

  fields.forEach(function(field) {
    var val = undefined;
    for (var i = 0; i < field.updateKeys.length; i++) {
      if (updates[field.updateKeys[i]] !== undefined) {
        val = updates[field.updateKeys[i]];
        break;
      }
    }
    if (val !== undefined) {
      sheet.getRange(rowNum, field.col + 1).setValue(val);
    }
  });

  return getParticipantById(registrationId);
}

function markPayment(registrationId, paymentStatus) {
  const sheet = getSheet();
  const rowNum = findRowById(registrationId);
  sheet.getRange(rowNum, COL.PAYMENT_STATUS + 1).setValue(paymentStatus || 'Paid');
  return getParticipantById(registrationId);
}

function deleteParticipant(registrationId) {
  const sheet = getSheet();
  const rowNum = findRowById(registrationId);
  sheet.deleteRow(rowNum);
  return { registrationId: registrationId, deleted: true };
}

function getDashboardStats() {
  const participants = getAllParticipants();

  var stats = {
    total: participants.length,
    paid: 0,
    unpaid: 0,
    male: 0,
    female: 0,
    byChurch: {},
    participants: participants,
  };

  participants.forEach(function (p) {
    if (p.payment === 'Paid') {
      stats.paid++;
    } else {
      stats.unpaid++;
    }

    if (p.gender === 'Male') stats.male++;
    if (p.gender === 'Female') stats.female++;

    var church = p.church || 'Unknown';
    stats.byChurch[church] = (stats.byChurch[church] || 0) + 1;
  });

  return stats;
}

function staffLogin(username, password) {
  var user = STAFF_USERS[username];

  if (!user || user.password !== password) {
    throw new Error('Invalid username or password');
  }

  return {
    username: username,
    role: user.role,
  };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
