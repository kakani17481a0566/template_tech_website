# Email Integration Guide (Updated)

This guide explains how to update your Google Apps Script to:
1.  Send an automated welcome email.
2.  **Add a new column** in your Google Sheet that says "Email Sent".

## Updated Google Apps Script

Copy the code below and replace your **entire** existing Google Apps Script.

```javascript
function doPost(e) {
  try {
    // 1. Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 2. Parse parameters
    var data = e.parameter;

    // 3. Handle Interests
    var interests = '';
    if (data['interests[]']) {
      if (Array.isArray(data['interests[]'])) {
        interests = data['interests[]'].join(', ');
      } else {
        interests = data['interests[]'];
      }
    }

    // 4. SEND EMAIL & GET STATUS
    var emailStatus = "Skipped";
    if (data.email) {
      // Call the helper function to send email
      var isSent = sendWelcomeEmail(data.email, data.firstName, data.lastName);
      if (isSent) {
        emailStatus = "Email Sent";
      } else {
        emailStatus = "Email Failed";
      }
    }

    // 5. Create a new row (Including Email Status)
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
      interests,                     // Interests
      emailStatus                    // <--- NEW COLUMN: Email Status
    ];

    // 6. Append the new row to the sheet
    sheet.appendRow(newRow);

    // 7. Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Registration submitted successfully!'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to send the email
// Returns true if sent, false if failed
function sendWelcomeEmail(email, firstName, lastName) {
  try {
    var customerName = firstName + " " + lastName;
    var subject = "Welcome to NeuroPi - Registration Successful";

    // Email Body
    var body = "Dear " + customerName + ",\n\n" +
      "Thank you for registering with NeuroPi and taking the first step towards transforming early childhood development with us. We are delighted to have you on board.\n\n" +
      "In a separate email, you will shortly receive your login credentials to access the NeuroPi EDGE (Epigenetics Development and Growth Experience). That email will contain:\n" +
      "• Your username / registered email ID, and\n" +
      "• A link to set or reset your password and complete your first-time login.\n\n" +
      "Once you receive those details, please follow these simple steps:\n" +
      "1. Open the email titled “Your NeuroPi Login Credentials”.\n" +
      "2. Click on the secure login / password setup link.\n" +
      "3. Set your password and log in to the NeuroPi.\n" +
      "4. Complete your basic profile and add your child / student / institution details (as applicable).\n\n" +
      "If you do not see the login credentials email in your inbox, please:\n" +
      "• Check your Spam / Junk / Promotions folders, and\n" +
      "• Add info@neuropi.ai to your safe senders list.\n\n" +
      "For any assistance during login or onboarding, feel free to reach out to us at:\n" +
      "• Email: info@neuropi.ai\n" +
      "• Phone / WhatsApp: +91 7799 772 881\n\n" +
      "We truly appreciate your trust in NeuroPi and look forward to partnering with you in building a strong foundation in the early years.\n\n" +
      "Warm regards,\n" +
      "Team NeuroPi EDGE";

    // Send the email
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });

    Logger.log("Email sent to: " + email);
    return true; // Success

  } catch (e) {
    Logger.log("Error sending email: " + e.toString());
    return false; // Failed
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running!");
}
```

## Setup Instructions

1.  **Open your Google Sheet**.
2.  Go to **Extensions** > **Apps Script**.
3.  **Delete all existing code** and paste the code above.
4.  Click the **Save** icon (💾).
5.  **IMPORTANT: Authorize the Script**
    *   Run the `doPost` function manually once to trigger the permission dialog.
    *   Click **Review Permissions** -> Choose your account -> **Advanced** -> **Go to (Script Name) (unsafe)** -> **Allow**.
6.  **Deploy New Version**:
    *   Click **Deploy** > **Manage deployments**.
    *   Click the **Edit** (pencil) icon.
    *   Select **New version** from the dropdown.
    *   Click **Deploy**.
    *   Click **Done**.

Now, when a user registers:
1.  They will get the email.
2.  Your Google Sheet will have a new column at the end saying **"Email Sent"**.
