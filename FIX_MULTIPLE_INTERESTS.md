# FIXED: Google Apps Script for Multiple Interests

## The Problem
When multiple interests are selected, Google Apps Script only receives the LAST value, not all of them.

## The Solution
Use `e.parameters` (with an 's') instead of `e.parameter` for array data.

## Updated Google Apps Script

**Replace your entire Google Apps Script with this:**

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // IMPORTANT: Use e.parameters (with 's') to get arrays
    var params = e.parameters;
    var data = e.parameter;

    // Get interests - THIS IS THE FIX!
    var interests = '';

    // Check in e.parameters first (this contains arrays)
    if (params['interests[]'] && params['interests[]'].length > 0) {
      // Join all selected interests with comma and space
      interests = params['interests[]'].join(', ');
      Logger.log('Multiple interests found: ' + interests);
    }
    // Fallback to e.parameter for single value
    else if (data['interests[]']) {
      interests = data['interests[]'];
      Logger.log('Single interest found: ' + interests);
    }

    // Create a new row with the data
    var newRow = [
      new Date(),                    // Timestamp
      data.firstName || '',          // First Name
      data.lastName || '',           // Last Name
      data.dob || '',                // Date of Birth
      data.gender || '',             // Gender
      data.mobile || '',             // Phone Number
      data.email || '',              // Email
      data.address || '',            // Address
      data.city || '',               // City
      data.state || '',              // State
      data.pincode || '',            // Pincode
      data.country || '',            // Country
      interests                      // Interests (now properly joined!)
    ];

    // Append the new row to the sheet
    sheet.appendRow(newRow);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Registration submitted successfully!'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());

    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running!");
}
```

## Key Change

**BEFORE (Wrong):**
```javascript
var data = e.parameter;
if (data['interests[]']) {
  interests = data['interests[]'].join(', '); // Only gets last value!
}
```

**AFTER (Correct):**
```javascript
var params = e.parameters;  // Note the 's' - this contains arrays!
if (params['interests[]'] && params['interests[]'].length > 0) {
  interests = params['interests[]'].join(', '); // Gets ALL values!
}
```

## Steps to Fix:

1. **Open your Google Sheet**
2. **Go to Extensions → Apps Script**
3. **Delete ALL existing code**
4. **Copy and paste** the script above
5. **Click Save** (💾 icon)
6. **Deploy the update**:
   - Click **Deploy → Manage deployments**
   - Click the **edit icon** (pencil) next to your deployment
   - Change version to **New version**
   - Add description: "Fixed multiple interests handling"
   - Click **Deploy**
7. **Click Done**

## Test It:

1. Open your registration form
2. Select **3 or more interests** (e.g., NeuroPi, Sports, Defence)
3. Fill out the rest of the form
4. Click **Register**
5. Check your Google Sheet

**You should now see:** `neuroPi, sport, defence` (all values separated by commas!)

## Why This Works:

- `e.parameter` - Contains single values (only gets the LAST item from arrays)
- `e.parameters` - Contains arrays (gets ALL items from arrays)

This is a Google Apps Script quirk that catches many people!
