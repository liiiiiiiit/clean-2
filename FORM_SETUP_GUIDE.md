# 📧 Form Submission Setup Guide

## How to Receive Contact Form Submissions

Your Shine Cleaning website now has a working contact form! To receive email notifications when someone submits a request, follow these steps:

---

## 🚀 Option 1: EmailJS (Recommended - Free & Easy)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account (the one where you want to receive submissions)
5. **Copy the Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Set up your template like this:

**Subject:**
```
New Cleaning Request from {{from_name}}
```

**Content:**
```
New contact form submission:

Name: {{from_name}}
Phone: {{from_phone}}
Service: {{service_type}}
Message: {{message}}

---
Sent from Shine Cleaning Website
```

4. Click "Save"
5. **Copy the Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key
1. Go to **"Account"** → **"General"**
2. Find **"Public Key"** section
3. **Copy the Public Key** (e.g., `user_abc123def456`)

### Step 5: Update Your Code
Open `src/App.tsx` and find this section (around line 30):

```typescript
const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

Replace with your actual values:

```typescript
const SERVICE_ID = 'service_abc123';  // Your Service ID
const TEMPLATE_ID = 'template_xyz789';  // Your Template ID
const PUBLIC_KEY = 'user_abc123def456';  // Your Public Key
```

Also update the email address (around line 40):

```typescript
to_email: 'your-email@example.com',  // Change to your email
```

### Step 6: Test It!
1. Run your website locally: `npm run dev`
2. Fill out the contact form
3. Submit it
4. Check your email inbox! 📧

---

## 🔄 Option 2: Formspree (Alternative - Also Free)

If you prefer Formspree instead of EmailJS:

### Setup Steps:
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Create a new form
4. You'll get a form endpoint URL like: `https://formspree.io/f/your-form-id`

### Update the Code:
Replace the EmailJS code with this:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormSubmitted(true);
      setFormData({ name: '', phone: '', service: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 4000);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert('Failed to send message. Please try again or call us directly.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 📊 Option 3: Google Sheets Integration (For Tracking)

If you want to store all submissions in a Google Sheet:

1. Create a Google Sheet
2. Go to Extensions → Apps Script
3. Use this script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.name, data.phone, data.service, data.message]);
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as web app and get the URL
5. Update your form submission to POST to that URL

---

## ✅ What Happens Now?

When someone fills out the form:

1. **User fills out:** Name, Phone, Service Type, Message
2. **Clicks "Send Request"** button
3. **Form shows:** "⏳ Sending..." while processing
4. **Email is sent** to your inbox with all details
5. **User sees:** Success message "Thank you! We will contact you shortly."
6. **Form resets** automatically

---

## 🎯 Quick Checklist

- [ ] Create EmailJS account
- [ ] Add email service (connect your email)
- [ ] Create email template
- [ ] Copy Service ID, Template ID, Public Key
- [ ] Update `src/App.tsx` with your credentials
- [ ] Update `to_email` with your email address
- [ ] Test the form
- [ ] Deploy your website

---

## 💡 Pro Tips

1. **Test Before Going Live:** Always test the form after setup
2. **Check Spam Folder:** First few emails might go to spam
3. **Free Tier Limits:** EmailJS free plan = 200 emails/month
4. **Upgrade if Needed:** For more emails, upgrade to paid plan ($10/month)
5. **Backup Contact:** Keep your phone number (+374 77 442554) visible as backup

---

## 🆘 Need Help?

- **EmailJS Documentation:** [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **EmailJS Support:** support@emailjs.com
- **Video Tutorial:** Search "EmailJS React tutorial" on YouTube

---

## 📱 What Users See

### Before Submission:
- Form with fields: Name, Phone, Service, Message
- Blue "Send Request" button

### During Submission:
- Button shows: "⏳ Sending..."
- Button is disabled (can't click twice)

### After Success:
- Green checkmark ✅
- Message: "Thank you! We will contact you shortly."
- Form automatically resets after 4 seconds

### If Error Occurs:
- Alert popup: "Failed to send message. Please try again or call us directly."
- User can try again or call +374 77 442554

---

**That's it! Your contact form is now fully functional and will send you emails for every submission! 🎉**
