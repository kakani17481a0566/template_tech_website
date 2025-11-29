# Troubleshooting: Data Not Appearing in Google Sheet

## Quick Checklist

Let's go through these steps to identify the issue:

### ✅ Step 1: Verify Google Apps Script Deployment

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Click **Deploy** → **Manage deployments**
4. Check that:
   - ✅ **Execute as**: Me (your email)
   - ✅ **Who has access**: **Anyone** (this is critical!)
   - ✅ Status shows "Active"

**If "Who has access" is NOT set to "Anyone":**
1. Click the edit icon (pencil)
2. Change "Who has access" to **Anyone**
3. Click **Deploy**
4. Copy the NEW URL and update your files again

### ✅ Step 2: Check Execution Logs

1. In Apps Script editor, click the **clock icon** (Executions) on the left sidebar
2. Look for recent executions when you submitted the form
3. Check for errors:
   - **Red X** = Error occurred
   - **Green checkmark** = Success

**Common Errors:**
- "Authorization required" → Need to set "Who has access" to "Anyone"
- "Exception: Cannot call SpreadsheetApp" → Script needs permission

### ✅ Step 3: Test the Script Directly

1. In Apps Script editor, add this test function:

```javascript
function testSubmission() {
  var testData = {
    parameter: {
      firstName: 'Test',
      lastName: 'User',
      dob: '2000-01-01',
      gender: 'male',
      mobile: '1234567890',
      email: 'test@example.com',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      country: 'Test Country',
      'interests[]': ['neuroPi', 'sport']
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

2. Click **Save**
3. Select `testSubmission` from the function dropdown
4. Click **Run**
5. Check your Google Sheet - you should see a test row
6. If it works, the issue is with the form submission, not the script

### ✅ Step 4: Check Browser Console

1. Open `RegistrationHome.html` in your browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Submit the form
5. Look for errors (red text)

**Common Console Errors:**
- "CORS error" → This is NORMAL with Google Apps Script (form will still work)
- "Failed to fetch" → Check the URL is correct
- "form-handler.js not found" → Check file path

### ✅ Step 5: Verify the URLs Match

Check that BOTH files have the SAME URL:

**File 1: RegistrationHome.html (line 16)**
```html
<form id="registerForm" action="https://script.google.com/macros/s/AKfycbzc9G5eP0SrtGTPkMATkwVQ3DcKD0wa0vVnFtnJqfIy953ixCyOwuTQqR7tEv0xqFzj/exec" method="POST">
```

**File 2: js/form-handler.js (line 6)**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzc9G5eP0SrtGTPkMATkwVQ3DcKD0wa0vVnFtnJqfIy953ixCyOwuTQqR7tEv0xqFzj/exec';
```

## Improved Google Apps Script with Logging

Replace your current Apps Script with this improved version that includes detailed logging:

```javascript
function doPost(e) {
  try {
    // Log the incoming request
    Logger.log('Received POST request');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));

    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    Logger.log('Sheet name: ' + sheet.getName());

    // Parse the form data
    var data = e.parameter;

    // Get interests (handle array)
    var interests = '';
    if (data['interests[]']) {
      if (Array.isArray(data['interests[]'])) {
        interests = data['interests[]'].join(', ');
      } else {
        interests = data['interests[]'];
      }
    }
    Logger.log('Interests: ' + interests);

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
      interests                      // Interests
    ];

    Logger.log('New row data: ' + JSON.stringify(newRow));

    // Append the new row to the sheet
    sheet.appendRow(newRow);
    Logger.log('Row appended successfully');

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Registration submitted successfully!'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error
    Logger.log('ERROR: ' + error.toString());

    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function
function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running!");
}

// Test submission function
function testSubmission() {
  var testData = {
    parameter: {
      firstName: 'Test',
      lastName: 'User',
      dob: '2000-01-01',
      gender: 'male',
      mobile: '1234567890',
      email: 'test@example.com',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      country: 'Test Country',
      'interests[]': ['neuroPi', 'sport']
    }
  };

  var result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}
```

### After updating the script:

1. Click **Save**
2. Click **Deploy** → **Manage deployments**
3. Click the **edit icon** (pencil)
4. Change version to **New version**
5. Click **Deploy**
6. Test the form again

### View Logs:

1. In Apps Script, click **Executions** (clock icon)
2. Click on a recent execution
3. View the logs to see what's happening

## Still Not Working?

If none of the above works, please check:

1. **Is the form actually submitting?**
   - Do you see the success message?
   - Check browser console for errors

2. **Is the script receiving data?**
   - Check Executions in Apps Script
   - Look at the logs

3. **Are you looking at the right sheet?**
   - Make sure you're checking the correct Google Sheet
   - Check the correct tab/sheet within the spreadsheet

Let me know which step reveals the issue!
