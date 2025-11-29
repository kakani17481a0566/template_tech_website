# Quick Start: Google Sheets Integration

## ✅ What I've Done

I've set up your registration form to work with Google Sheets. Here's what's been updated:

### Files Modified/Created:
1. **RegistrationHome.html** - Updated to use Google Sheets instead of Formspree
2. **js/form-handler.js** - New JavaScript handler for form submissions
3. **GOOGLE_SHEETS_SETUP.md** - Complete setup guide

## 🚀 Next Steps (You Need to Do This)

### Step 1: Create Your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Add these headers in row 1:
   ```
   Timestamp | First Name | Last Name | Date of Birth | Gender | Phone Number | Email | Address | City | State | Pincode | Country | Interests
   ```

### Step 2: Add the Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy the code from `GOOGLE_SHEETS_SETUP.md` (Step 2)
4. Save the project

### Step 3: Deploy the Web App
1. Click **Deploy** → **New deployment**
2. Select type: **Web app**
3. Set **Execute as**: Me
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. **COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/XXXXX/exec`)

### Step 4: Update Your Files
Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual URL in **TWO** places:

#### File 1: `RegistrationHome.html` (Line 16)
```html
<form id="registerForm" action="YOUR_ACTUAL_URL_HERE" method="POST">
```

#### File 2: `js/form-handler.js` (Line 6)
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_URL_HERE';
```

### Step 5: Test It!
1. Open `RegistrationHome.html` in your browser
2. Fill out and submit the form
3. Check your Google Sheet - you should see the data!

## 📋 How It Works

```
User fills form → Submits → Google Apps Script → Adds row to Sheet
                              ↓
                    Shows success message to user
```

## 🔧 Troubleshooting

**Form doesn't submit?**
- Check that you replaced BOTH URLs
- Make sure the Google Apps Script is deployed with "Anyone" access

**Data not appearing in sheet?**
- Check the Apps Script execution logs (Extensions → Apps Script → Executions)
- Verify column headers match exactly

**Need help?**
- See the detailed guide in `GOOGLE_SHEETS_SETUP.md`

## 🎨 Features Included

✅ Automatic timestamp for each submission
✅ Success/error messages to users
✅ Form resets after successful submission
✅ Handles multiple checkbox selections (interests)
✅ Loading state on submit button
✅ No page reload needed

## 📧 Optional: Email Notifications

Want to get emailed when someone registers? See the "Optional Enhancements" section in `GOOGLE_SHEETS_SETUP.md`!
