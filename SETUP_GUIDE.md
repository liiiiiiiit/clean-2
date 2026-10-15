# 🚀 Complete Setup Guide - Shine Cleaning Admin Panel

## Overview

This guide will help you set up the complete admin panel with:
- ✅ User authentication (login/logout)
- ✅ Password change functionality
- ✅ Request management (view, update, delete)
- ✅ Dashboard with statistics
- ✅ Cloud database (Supabase)

---

## 📋 Prerequisites

- Node.js installed
- A Supabase account (free tier is sufficient)
- Your Shine Cleaning website deployed or running locally

---

## 🔧 Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or Email
4. Create a new organization (free tier works perfectly!)

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all inserts (for form submissions)
CREATE POLICY "Allow public to insert contact requests"
ON contact_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow authenticated users to read
CREATE POLICY "Allow authenticated users to read contact requests"
ON contact_requests
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update contact requests"
ON contact_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete contact requests"
ON contact_requests
FOR DELETE
TO authenticated
USING (true);

-- Create indexes for faster queries
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Click "Run" (or press Ctrl+Enter)

You should see "Success. No rows returned"

---

## 👤 Step 3: Create Admin User

### 3.1 Go to Authentication
1. In Supabase dashboard, click "Authentication" (left sidebar)
2. Click "Users"
3. Click "Add user" → "Create new user"

### 3.2 Fill in User Details
- **Email:** admin@shinecleaning.am (or your preferred email)
- **Password:** Choose a strong password (save it!)
- **Auto Confirm User:** ✅ Check this box
- Click "Create user"

**Important:** Remember this email and password - you'll use it to login to the admin panel!

---

## 🔑 Step 4: Get Your API Keys

### 4.1 Find API Settings
1. In Supabase dashboard, click "Settings" (gear icon, bottom left)
2. Click "API"

### 4.2 Copy Your Keys
You'll see:
- **Project URL:** `https://xxxxx.supabase.co`
- **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Copy both of these!**

---

## ⚙️ Step 5: Configure Your Website

### 5.1 Create Environment File
Create a file named `.env` in your project root (same level as package.json):

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from Step 4.2

### 5.2 Add .env to .gitignore
Make sure `.env` is in your `.gitignore` file:

```
# Environment variables
.env
.env.local
.env.production
```

---

## 🧪 Step 6: Test Everything

### 6.1 Start Development Server
```bash
npm run dev
```

### 6.2 Test Form Submission
1. Go to `http://localhost:5173`
2. Fill out the contact form
3. Submit it
4. Check Supabase dashboard → Table Editor → contact_requests
5. You should see your submission!

### 6.3 Test Admin Panel
1. Go to `http://localhost:5173/admin`
2. Login with:
   - **Email:** admin@shinecleaning.am (from Step 3)
   - **Password:** (from Step 3)
3. You should see:
   - ✅ Dashboard with statistics
   - ✅ Your test submission in the requests list
   - ✅ Ability to change status
   - ✅ Ability to delete requests

### 6.4 Test Password Change
1. In admin panel, click "Settings" tab
2. Enter new password (twice)
3. Click "Update Password"
4. Logout and login with new password

---

## 🌐 Step 7: Deploy to Production

### 7.1 Build Your Project
```bash
npm run build
```

### 7.2 Set Environment Variables in Production

**For Vercel:**
1. Go to your project settings
2. Environment Variables section
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Redeploy

**For Netlify:**
1. Site settings → Environment variables
2. Add the same variables
3. Redeploy

**For other platforms:**
Check their documentation for environment variable setup.

### 7.3 Test Production
1. Go to `https://your-domain.com`
2. Submit a test form
3. Go to `https://your-domain.com/admin`
4. Login and verify the request appears

---

## 📊 Admin Panel Features

### Dashboard Tab
- **Total Requests** - All-time count
- **New** - Requests not yet contacted
- **Contacted** - Requests you've reached out to
- **Completed** - Finished requests
- **Recent Requests** - Last 5 submissions

### Requests Tab
- **View All Requests** - Complete list with details
- **Filter by Status** - All/New/Contacted/Completed
- **Search** - Find by name, phone, or message
- **Update Status** - Change request status
- **Delete Requests** - Remove old requests
- **Quick Actions:**
  - 📞 Call button (opens phone dialer)
  - 💬 WhatsApp button (opens WhatsApp chat)

### Settings Tab
- **Profile Information** - View your email
- **Change Password** - Update your password securely

---

## 🔒 Security Best Practices

### 1. Strong Password
- Use at least 12 characters
- Mix letters, numbers, symbols
- Don't share with anyone

### 2. Environment Variables
- Never commit `.env` file to Git
- Use different Supabase projects for dev/prod (optional)
- Rotate keys periodically

### 3. Supabase Security
- Row Level Security (RLS) is enabled
- Only authenticated users can manage requests
- Public can only submit new requests

### 4. Regular Backups
- Supabase automatically backs up your data
- Export CSV regularly for extra safety
- Consider upgrading to Pro plan for point-in-time recovery

---

## 🆘 Troubleshooting

### "Supabase Not Configured" Error
- Check `.env` file exists
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart development server after adding `.env`

### "Failed to login" Error
- Check email and password are correct
- Verify user is created in Supabase Authentication
- Check user is "Auto Confirmed"

### "Failed to send message" Error
- Check database table exists
- Verify RLS policies are set correctly
- Check browser console for errors

### Admin Panel Not Showing Requests
- Refresh the page
- Check Supabase table has data
- Verify you're logged in with correct user

### Password Change Not Working
- Make sure new password is at least 6 characters
- Check both password fields match
- Try logging out and back in

---

## 💡 Pro Tips

### 1. Email Notifications
Combine with EmailJS to get email alerts:
- Form submits → Saves to Supabase → Sends email
- Edit `src/App.tsx` to add EmailJS integration

### 2. Export Data
Need to export requests? Run this in Supabase SQL Editor:
```sql
SELECT * FROM contact_requests ORDER BY created_at DESC;
```
Then click "Download as CSV"

### 3. Multiple Admin Users
Create multiple users in Supabase Authentication:
- Each gets their own login
- All can access admin panel
- Track who made changes

### 4. Custom Fields
Add more fields to track:
- Estimated price
- Assigned staff member
- Notes
- Priority level

### 5. Analytics
Add charts and graphs:
- Requests per day/week/month
- Most popular services
- Conversion rates

---

## 📞 Support

### Supabase Documentation
- [https://supabase.com/docs](https://supabase.com/docs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)

### Supabase Community
- [Discord](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)

### Contact
- **Phone:** +374 77 442554
- **Contact Person:** Irina

---

## ✅ Quick Checklist

- [ ] Created Supabase project
- [ ] Ran SQL to create table
- [ ] Created admin user in Authentication
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file with credentials
- [ ] Added `.env` to `.gitignore`
- [ ] Tested form submission
- [ ] Tested admin panel login
- [ ] Tested password change
- [ ] Deployed to production
- [ ] Set environment variables in production
- [ ] Tested production deployment

---

## 🎉 You're All Set!

Your Shine Cleaning website now has:
- ✅ Professional website (EN/HY/RU)
- ✅ Contact form with database
- ✅ Admin panel with authentication
- ✅ Password change functionality
- ✅ Request management system
- ✅ Cloud database (Supabase)
- ✅ Mobile-responsive design

**Access your admin panel anytime at:** `your-domain.com/admin`

---

**Last Updated:** 2024
**Version:** 2.0 (with Supabase)
