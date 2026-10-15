# 🎯 Admin Panel Guide

## Access the Admin Panel

1. **Open your website** in the browser
2. **Navigate to**: `http://localhost:5173/admin` (or your domain + `/admin`)
3. **Enter password**: `shine2024`
4. **Click Login**

## What You Can Do

### 📊 Dashboard
- See total number of requests
- View new requests (not yet contacted)
- Track contacted and completed requests
- See recent requests preview

### 📋 Manage Requests
- **View all requests** with customer details
- **Filter by status**: All / New / Contacted / Completed
- **Search** by name, phone, or message
- **Update status**: Change request status
- **Delete requests**: Remove old requests
- **Quick actions**:
  - 📞 Call customer directly
  - 💬 Send WhatsApp message

### ⚙️ Settings
- View account information
- Change your password
- See data storage info

## How It Works

1. **Customer submits form** on the website
2. **Request is saved** to browser storage
3. **Admin sees it** in the admin panel
4. **Admin contacts customer** via phone or WhatsApp
5. **Admin updates status** to "Contacted" or "Completed"

## Tips

- **Check regularly**: New requests appear automatically every 3 seconds
- **Use filters**: Quickly find specific requests
- **Update status**: Keep track of your workflow
- **Delete old requests**: Keep the panel clean
- **Change password**: Update it in the code for better security

## Change Password

To change the admin password:

1. Open `src/pages/AdminPanel.tsx`
2. Find this line: `const ADMIN_PASSWORD = 'shine2024';`
3. Change `'shine2024'` to your new password
4. Save the file
5. Rebuild: `npm run build`
6. Deploy the new build

## Data Storage

Requests are stored in your browser's localStorage:
- ✅ Works immediately
- ✅ No setup required
- ⚠️ Only visible in the browser where requests were submitted
- ⚠️ Lost if browser cache is cleared

For multi-device access, you'd need to integrate a database like Supabase.

## Need Help?

- **Phone**: +374 77 442554
- **Contact**: Irina

---

**Enjoy managing your cleaning business! 🧹✨**
