# Google Sheets Integration Setup Guide

This guide will help you connect your registration form to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Registration Form Responses" (or any name you prefer)
4. In the first row, add these column headers:
   - A1: `Timestamp`
   - B1: `First Name`
   - C1: `Last Name`
   - D1: `Date of Birth`
   - E1: `Gender`
   - F1: `Phone Number`
   - G1: `Email`
   - H1: `Address`
   - I1: `City`
   - J1: `State`
   - K1: `Pincode`
   - L1: `Country`
   - M1: `Interests`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

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
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional)
function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running!");
}
```

4. Click **Save** (💾 icon)
5. Name your project (e.g., "Registration Form Handler")

## Step 3: Deploy the Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Registration Form Submission Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **IMPORTANT**: Copy the **Web app URL** that appears (it will look like: `https://script.google.com/macros/s/XXXXX/exec`)
7. Click **Done**

## Step 4: Update Your HTML Form

You'll need to replace the Formspree URL with your Google Apps Script URL in `RegistrationHome.html`.

The URL will be provided in the next step after you complete the deployment.

## Step 5: Test the Integration

1. Submit a test registration through your form
2. Check your Google Sheet - you should see a new row with the submitted data
3. If it doesn't work, check the Apps Script execution logs:
   - Go to Apps Script editor
   - Click **Executions** (clock icon on left sidebar)
   - Look for any errors

## Troubleshooting

### Common Issues:

1. **Form doesn't submit**: Make sure the Web App URL is correct
2. **Data not appearing**: Check that column headers match exactly
3. **Permission errors**: Ensure "Who has access" is set to "Anyone"
4. **Interests not showing**: The script handles both single and multiple checkbox values

### Need to Update the Script?

If you make changes to the Apps Script:
1. Save the changes
2. Click **Deploy** → **Manage deployments**
3. Click the edit icon (pencil) on your deployment
4. Change the version to "New version"
5. Click **Deploy**

## Security Notes

- The web app URL is public but doesn't expose your sheet data
- Only POST requests with proper form data will add rows
- Consider adding email notifications for new submissions
- You can add data validation in the script if needed

## Optional Enhancements

### Email Notifications

Add this function to get email notifications:

```javascript
function sendEmailNotification(data) {
  var recipient = "your-email@example.com";
  var subject = "New Registration: " + data.firstName + " " + data.lastName;
  var body = "New registration received:\n\n" +
             "Name: " + data.firstName + " " + data.lastName + "\n" +
             "Email: " + data.email + "\n" +
             "Phone: " + data.mobile;

  MailApp.sendEmail(recipient, subject, body);
}
```

Then add this line in the `doPost` function after `sheet.appendRow(newRow);`:
```javascript
sendEmailNotification(data);
```

### Data Validation

Add validation before appending:

```javascript
// Validate email
if (!data.email || !data.email.includes('@')) {
  throw new Error('Invalid email address');
}

// Validate phone number
if (!data.mobile || data.mobile.length !== 10) {
  throw new Error('Invalid phone number');
}
```
