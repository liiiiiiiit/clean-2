# Shine Cleaning - Admin Panel

## ✅ What Was Cleaned Up

1. **Removed Supabase dependency** - No more external database setup required
2. **Removed EmailJS dependency** - Simplified form submission
3. **Removed unnecessary documentation files** - Cleaner project structure
4. **Simplified authentication** - Uses localStorage instead of complex auth

## 🎯 How It Works Now

### Form Submissions
- When customers submit the contact form, data is saved to **localStorage**
- No external database needed
- Works immediately after deployment

### Admin Panel Access
1. Go to `http://localhost:5173/admin` (local) or `https://your-domain.com/admin` (production)
2. Enter password: **`shine2024`**
3. View and manage all contact requests

### Features
- ✅ Dashboard with statistics (Total, New, Contacted, Completed)
- ✅ Filter requests by status
- ✅ Search by name, phone, or message
- ✅ Update request status
- ✅ Delete requests
- ✅ Click to expand request details
- ✅ Quick actions: Call, WhatsApp, Copy Phone
- ✅ Auto-refresh every 3 seconds
- ✅ Mobile responsive design

## 🔐 Security Notes

**Current Setup:**
- Password is hardcoded in `src/pages/AdminPanel.tsx` (line 12)
- Data stored in browser localStorage
- Session-based authentication (clears on browser close)

**For Production:**
- Change the password in `src/pages/AdminPanel.tsx`
- Consider adding server-side authentication
- Consider using a real database (Supabase, Firebase, etc.) for multi-device access

## 📝 How to Change Admin Password

1. Open `src/pages/AdminPanel.tsx`
2. Find line 12: `const ADMIN_PASSWORD = 'shine2024';`
3. Change `'shine2024'` to your desired password
4. Rebuild: `npm run build`
5. Deploy

## 🚀 Deployment

### Local Development
```bash
npm run dev
```
- Website: http://localhost:5173
- Admin: http://localhost:5173/admin

### Production Build
```bash
npm run build
```
Deploy the `dist` folder to your hosting provider.

## 📊 Data Storage

**Where is data stored?**
- Browser localStorage (per device/browser)
- Key: `shine_cleaning_requests`

**Limitations:**
- Data only exists in the browser where it was submitted
- Admin can only see requests from the same browser/device
- Clearing browser data will delete all requests

**For Multi-Device Access:**
You'll need to integrate a real database like:
- Supabase (recommended)
- Firebase
- MongoDB
- PostgreSQL

## 🎨 Customization

### Change Colors
Edit `src/index.css` and `src/App.tsx` Tailwind classes

### Change Languages
Edit `src/translations.ts`

### Change Pricing
Edit `pricingRates` in `src/App.tsx` (line 25)

## 📞 Support

For questions or issues, contact:
- Phone: +374 77 442554
- Contact: Irina

---

**Built with React + TypeScript + Tailwind CSS**
