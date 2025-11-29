# Email Troubleshooting Guide

If emails are not being sent, follow these steps to find and fix the issue.

## Step 1: Run the Direct Diagnostic Test

This test will try to send an email and print the **exact error message** if it fails.

1.  Open your Google Apps Script editor.
2.  **Delete** the previous `testEmailSystem` function if you added it.
3.  **Copy and paste** this new function at the bottom of your script:

```javascript
function debugEmailSystem() {
  // REPLACE THIS with your personal email (e.g., gmail.com) to test delivery
  var recipient = Session.getActiveUser().getEmail();

  Logger.log("----------------------------------------");
  Logger.log("🔍 STARTING EMAIL DIAGNOSTIC");
  Logger.log("📧 Recipient: " + recipient);

  try {
    // Check quota
    var quota = MailApp.getRemainingDailyQuota();
    Logger.log("📊 Remaining Daily Quota: " + quota);

    if (quota <= 0) {
      Logger.log("❌ ERROR: Daily email quota exceeded!");
      return;
    }

    // Attempt to send
    Logger.log("🚀 Attempting to send email...");

    MailApp.sendEmail({
      to: recipient,
      subject: "NeuroPi Test Email",
      body: "If you are reading this, the email system is working!"
    });

    Logger.log("✅ SUCCESS: Email sent without errors!");
    Logger.log("👉 Check your inbox (and spam folder) for 'NeuroPi Test Email'");

  } catch (e) {
    Logger.log("❌ FATAL ERROR: " + e.toString());
    Logger.log("⚠️ SUGGESTION: " + suggestFix(e.toString()));
  }
  Logger.log("----------------------------------------");
}

function suggestFix(errorMsg) {
  if (errorMsg.includes("permission")) return "You need to AUTHORIZE the script. Run the function again and click 'Review Permissions'.";
  if (errorMsg.includes("limit")) return "You have hit the daily email limit (100 for free accounts, 1500 for Workspace).";
  if (errorMsg.includes("recipient")) return "The recipient email address is invalid.";
  return "Check if the 'Gmail' service is enabled in your Google Cloud project or Workspace settings.";
}
```

4.  **Save** (💾).
5.  Select `debugEmailSystem` from the dropdown.
6.  Click **Run**.

## Step 2: Analyze the Result

Look at the **Execution Log** that appears.

### Scenario A: "❌ FATAL ERROR: ..."
*   **Copy the error message** and tell me what it says.
*   Common errors:
    *   `Exception: The script does not have permission...`: You didn't authorize it properly.
    *   `Exception: Service invoked too many times...`: You ran out of quota.

### Scenario B: "✅ SUCCESS" but NO Email Received
1.  **Check Spam/Junk**: It's very likely there.
2.  **Check Recipient**: Did it send to `noreply@neuropi.ai`? That email might not have an inbox!
    *   **Fix**: Change `var recipient = "your.personal@gmail.com";` in the code above and run it again.

## Step 3: Deployment Check

If the test works but the **Form** doesn't:
1.  Go to **Deploy** > **Manage deployments**.
2.  **Edit** the active deployment.
3.  **Create a NEW VERSION** (Version 5, 6, etc.).
4.  **Deploy**.
    *   *Note: If you don't create a new version, the form will keep using the OLD code without the email feature!*
