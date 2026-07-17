# Data Migration Guide

## Overview

The Apps Script backend has been updated to use a consistent, centralized column mapping that matches the exact Google Sheet column order. If you have existing data in your Google Sheet, you need to migrate it to the new column structure.

## New Column Order

The Google Sheet columns must be in this exact order:

1. **Registration ID** - Unique participant ID (e.g., KYC/T18/0001)
2. **Full Name** - Participant's full name
3. **Gender** - Male or Female
4. **Age** - Participant's age
5. **Phone** - Phone number
6. **Telegram Username** - Telegram handle (without @)
7. **Address** - Full address
8. **Church** - Church name
9. **Payment Status** - Paid or Unpaid
10. **Transaction Number** - Transaction/reference number
11. **Screenshot** - Screenshot URL (if uploaded)
12. **Timestamp** - Registration date/time

## Migration Steps

### Option 1: Manual Migration (Recommended for Small Datasets)

1. **Backup your existing data**
   - Make a copy of your Google Sheet
   - Download as CSV/Excel as additional backup

2. **Update column headers**
   - Replace the header row with the new column names in the exact order shown above
   - Ensure headers match exactly (case-sensitive): "Registration ID", "Full Name", "Gender", "Age", "Phone", "Telegram Username", "Address", "Church", "Payment Status", "Transaction Number", "Screenshot", "Timestamp"

3. **Reorganize existing data**
   - Move data from old columns to new columns based on the mapping below
   - If you have data in the old "Date" or "Timestamp" column, move it to the new "Timestamp" column (column 12)
   - Ensure Registration ID is in column 1, Full Name in column 2, etc.

### Option 2: Automated Migration Script

For larger datasets, you can use this Google Apps Script function to migrate data:

```javascript
function migrateSheetData() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    throw new Error('No data to migrate');
  }
  
  // Old header mapping (adjust based on your current headers)
  const oldHeaders = data[0];
  const oldToNew = {
    'ID': 'Registration ID',
    'Date': 'Timestamp',
    'Timestamp': 'Timestamp',
    'Full Name': 'Full Name',
    'Name': 'Full Name',
    'Gender': 'Gender',
    'Age': 'Age',
    'Phone': 'Phone',
    'Telegram': 'Telegram Username',
    'telegram user': 'Telegram Username',
    'Address': 'Address',
    'Church': 'Church',
    'Payment': 'Payment Status',
    'payment status': 'Payment Status',
    'Transaction Number': 'Transaction Number',
    'transaction number': 'Transaction Number',
    'Screenshot': 'Screenshot'
  };
  
  // Create new header row
  const newHeaders = [
    'Registration ID',
    'Full Name',
    'Gender',
    'Age',
    'Phone',
    'Telegram Username',
    'Address',
    'Church',
    'Payment Status',
    'Transaction Number',
    'Screenshot',
    'Timestamp'
  ];
  
  // Clear existing data
  sheet.clear();
  
  // Write new headers
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  sheet.getRange(1, 1, 1, newHeaders.length).setFontWeight('bold');
  
  // Migrate data rows
  const newData = [];
  for (let i = 1; i < data.length; i++) {
    const oldRow = data[i];
    const newRow = new Array(newHeaders.length).fill('');
    
    oldHeaders.forEach((oldHeader, oldIdx) => {
      const newHeader = oldToNew[oldHeader.toLowerCase()] || oldToNew[oldHeader];
      if (newHeader) {
        const newIdx = newHeaders.indexOf(newHeader);
        if (newIdx >= 0) {
          newRow[newIdx] = oldRow[oldIdx];
        }
      }
    });
    
    newData.push(newRow);
  }
  
  // Write migrated data
  if (newData.length > 0) {
    sheet.getRange(2, 1, newData.length, newHeaders.length).setValues(newData);
  }
  
  return { success: true, migratedRows: newData.length };
}
```

To run this migration script:
1. Open your Apps Script editor
2. Add the `migrateSheetData` function to your Code.gs
3. Run the function from the editor
4. Verify the data in your Google Sheet

## Column Mapping Reference

| Old Column Name | New Column Name | New Position |
|----------------|-----------------|--------------|
| ID | Registration ID | 1 |
| Date | Timestamp | 12 |
| Timestamp | Timestamp | 12 |
| Full Name | Full Name | 2 |
| Name | Full Name | 2 |
| Gender | Gender | 3 |
| Age | Age | 4 |
| Phone | Phone | 5 |
| Telegram | Telegram Username | 6 |
| telegram user | Telegram Username | 6 |
| Address | Address | 7 |
| Church | Church | 8 |
| Payment | Payment Status | 9 |
| payment status | Payment Status | 9 |
| Transaction Number | Transaction Number | 10 |
| transaction number | Transaction Number | 10 |
| Screenshot | Screenshot | 11 |

## Post-Migration Verification

After migration, verify:

1. **Column headers** are in the correct order and match exactly
2. **Registration IDs** are in column 1
3. **Full Names** are in column 2
4. **Timestamps** are in column 12 (last column)
5. **Payment Status** is in column 9
6. **Transaction Numbers** are in column 10
7. **Screenshot URLs** are in column 11

Test the registration flow:
1. Register a new participant via the frontend
2. Check that data appears in the correct columns
3. Verify the dashboard shows correct statistics
4. Test search, edit, and payment marking functions

## Important Notes

- **Always backup** before migrating
- The frontend sends `fullName` but backend returns `name` - this is intentional for consistency
- All API responses now use consistent field names: `registrationId`, `name`, `gender`, `age`, `phone`, `telegram`, `address`, `church`, `payment`, `transactionNumber`, `screenshot`, `date`
- The centralized `COL` constants in Code.gs ensure all functions use the same column indices
- After migration, redeploy your Apps Script as a Web App

## Troubleshooting

**Data appears in wrong columns after migration**
- Check that headers match exactly (case-sensitive)
- Verify the column order matches the new structure
- Re-run the migration script if needed

**Dashboard statistics are incorrect**
- Ensure Payment Status column contains only "Paid" or "Unpaid"
- Check that the column index for Payment Status is 8 (0-based)
- Verify the getDashboardStats function is using correct field names

**Registration fails**
- Ensure the Google Sheet has the correct headers in the correct order
- Check that the Apps Script is deployed with the updated code
- Verify the SPREADSHEET_ID is correct in Code.gs
