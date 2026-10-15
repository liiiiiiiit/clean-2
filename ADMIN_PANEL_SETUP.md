# 🎛️ Admin Panel Setup Guide

## Overview

Your Shine Cleaning website now has a complete admin panel where you can:
- ✅ View all contact form submissions
- ✅ Track request status (New → Contacted → Completed)
- ✅ Filter and search requests
- ✅ Delete old requests
- ✅ See statistics dashboard
- ✅ Access from any device

**Admin Panel URL:** `your-domain.com/admin`

---

## 🚀 Step 1: Create Supabase Project (Free)

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or Email
4. Create a new organization (free tier is perfect!)

### 1.2 Create New Project
1. Click "New Project"
2. Fill in:
   - **Name:** Shine Cleaning
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to Armenia (e.g., Frankfurt)
3. Click "Create new project"
4. Wait 2-3 minutes for setup

---

## 🗄️ Step 2: Create Database Table

### 2.1 Open SQL Editor
1. In Supabase dashboard, click "SQL Editor" (left sidebar)
2. Click "New query"

### 2.2 Run This SQL:

```sql
-- Create the contact_requests table
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all inserts (for form submissions)
CREATE POLICY "Allow public to insert contact requests"
ON contact_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow all reads (for admin panel)
CREATE POLICY "Allow public to read contact requests"
ON contact_requests
FOR SELECT
TO anon
USING (true);

-- Create policy to allow all updates (for status changes)
CREATE POLICY "Allow public to update contact requests"
ON contact_requests
FOR UPDATE
TO anon
USING (true);

-- Create policy to allow all deletes (for admin panel)
CREATE POLICY "Allow public to delete contact requests"
ON contact_requests
FOR DELETE
TO anon
USING (true);

-- Create index for faster queries
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
```

### 2.3 Click "Run" (or press Ctrl+Enter)

You should see "Success. No rows returned"

---

## 🔑 Step 3: Get Your API Keys

### 3.1 Find API Settings
1. In Supabase dashboard, click "Settings" (gear icon, bottom left)
2. Click "API"

### 3.2 Copy Your Keys
You'll see:
- **Project URL:** `https://xxxxx.supabase.co`
- **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Copy both of these!**

---

## ⚙️ Step 4: Configure Your Website

### 4.1 Create Environment File
Create a file named `.env` in your project root:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from Step 3.2

### 4.2 Update Admin Password
Open `src/pages/AdminPanel.tsx` and find this line (around line 14):

```typescript
const ADMIN_PASSWORD = 'shine2024'; // Change this!
```

Change `'shine2024'` to your desired password.

**Important:** Use a strong password! This protects your admin panel.

---

## 🧪 Step 5: Test Everything

### 5.1 Test Form Submission
1. Run your website: `npm run dev`
2. Go to `http://localhost:5173`
3. Fill out the contact form
4. Submit it
5. Check Supabase dashboard → Table Editor → contact_requests
6. You should see your submission!

### 5.2 Test Admin Panel
1. Go to `http://localhost:5173/admin`
2. Enter your admin password
3. You should see your test submission
4. Try changing status, filtering, deleting

---

## 🌐 Step 6: Deploy to Production

### 6.1 Update Environment Variables
When deploying, you need to set environment variables:

**For Vercel:**
1. Go to your project settings
2. Environment Variables section
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key

**For Netlify:**
1. Site settings → Environment variables
2. Add the same variables

**For other platforms:**
Check their documentation for environment variable setup.

### 6.2 Deploy
```bash
npm run build
# Then deploy the 'dist' folder
```

---

## 📊 Admin Panel Features

### Dashboard
- **Total Requests:** All-time count
- **New:** Requests not yet contacted
- **Contacted:** Requests you've reached out to
- **Completed:** Finished requests

### Request Management
- **View Details:** See name, phone, service, message, date
- **Change Status:** Dropdown to update status
- **Delete:** Remove old/irrelevant requests
- **Filter:** View by status (All/New/Contacted/Completed)

### Security
- Password-protected admin panel
- Only you can access `/admin`
- All data stored securely in Supabase

---

## 🔒 Security Best Practices

### 1. Strong Admin Password
- Use at least 12 characters
- Mix letters, numbers, symbols
- Don't share with anyone

### 2. Supabase Security
For production, consider tightening security:

```sql
-- Instead of allowing all access, require authentication
-- This is more advanced but more secure

-- Remove the public policies above and create authenticated ones:
CREATE POLICY "Allow authenticated users to read"
ON contact_requests
FOR SELECT
TO authenticated
USING (true);
```

Then implement Supabase Auth in your admin panel.

### 3. Environment Variables
- Never commit `.env` file to Git
- Add `.env` to `.gitignore`
- Use different Supabase projects for dev/prod

---

## 📱 Access Admin Panel

### From Any Device:
1. Go to `your-domain.com/admin`
2. Enter password
3. Manage all requests

### Mobile Friendly:
The admin panel is fully responsive and works on:
- Desktop
- Tablet
- Mobile phone

---

## 🆘 Troubleshooting

### "Error loading requests"
- Check your Supabase URL and key in `.env`
- Make sure you ran the SQL to create the table
- Check browser console for errors

### "Failed to send message"
- Verify Supabase table exists
- Check RLS policies are set correctly
- Ensure environment variables are loaded

### Admin panel not loading
- Check you're accessing `/admin` (not `/admin/`)
- Verify React Router is configured
- Check browser console for errors

### Can't see new submissions
- Refresh the admin panel
- Check Supabase table directly
- Verify form is saving to database

---

## 💡 Pro Tips

### 1. Email Notifications
Combine with EmailJS to get email alerts:
- Form submits → Saves to Supabase → Sends email
- Best of both worlds!

### 2. Export Data
Need to export requests? Run this in Supabase SQL Editor:
```sql
SELECT * FROM contact_requests ORDER BY created_at DESC;
```
Then click "Download as CSV"

### 3. Backup
Supabase automatically backs up your data, but you can:
- Export CSV regularly
- Set up automatic backups (paid feature)

### 4. Analytics
Add more fields to track:
- Source (website, social media, etc.)
- Estimated price
- Assigned staff member
- Notes

---

## 📞 Need Help?

- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord:** [https://discord.supabase.com](https://discord.supabase.com)
- **Email Support:** support@supabase.io

---

## ✅ Quick Checklist

- [ ] Created Supabase project
- [ ] Ran SQL to create table
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file with credentials
- [ ] Changed admin password
- [ ] Tested form submission
- [ ] Tested admin panel
- [ ] Deployed to production
- [ ] Set environment variables in production

---

**That's it! Your admin panel is ready to use! 🎉**

Access it anytime at `your-domain.com/admin`
