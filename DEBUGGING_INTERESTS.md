# Updated Google Apps Script for Better Interest Handling

Replace your current Google Apps Script with this improved version:

```javascript
function doPost(e) {
  try {
    // Log incoming data for debugging
    Logger.log('Received POST request');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));

    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    Logger.log('Sheet name: ' + sheet.getName());

    // Parse the form data
    var data = e.parameter;

    // Get interests (handle both array and single value)
    var interests = '';

    // Check if interests[] exists
    if (data['interests[]']) {
      Logger.log('Raw interests data: ' + data['interests[]']);
      Logger.log('Is array: ' + Array.isArray(data['interests[]']));

      if (Array.isArray(data['interests[]'])) {
        // Multiple interests selected
        interests = data['interests[]'].join(', ');
        Logger.log('Joined interests: ' + interests);
      } else {
        // Single interest selected
        interests = data['interests[]'];
        Logger.log('Single interest: ' + interests);
      }
    } else {
      Logger.log('No interests selected');
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
        'message': 'Registration submitted successfully!',
        'interests': interests
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

// Test submission function - use this to test!
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
      'interests[]': ['neuroPi', 'sport', 'defence']  // Test with multiple interests
    }
  };

  var result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}
```

## Steps to Update:

1. **Open your Google Sheet**
2. **Go to Extensions → Apps Script**
3. **Replace all code** with the above script
4. **Click Save** (💾 icon)
5. **Test it**:
   - Select `testSubmission` from the function dropdown
   - Click **Run**
   - Check your sheet - you should see a test row with multiple interests
6. **Deploy**:
   - Click **Deploy → Manage deployments**
   - Click the **edit icon** (pencil)
   - Change version to **New version**
   - Click **Deploy**
   - **Copy the new URL** if it changed

## Then Test Your Form:

1. Open `RegistrationHome.html` in your browser
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Fill out the form and select **multiple interests**
5. Click **Register**
6. Check the console - you should see:
   ```
   Total checkboxes checked: 3
   Adding interest: neuroPi
   Adding interest: sport
   Adding interest: defence
   All interests collected: ['neuroPi', 'sport', 'defence']
   FormData interests: ['neuroPi', 'sport', 'defence']
   ```
7. Check your Google Sheet - all interests should appear separated by commas

If you still see issues, check the **Executions** log in Apps Script to see what data is being received!
