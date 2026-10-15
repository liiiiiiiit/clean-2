# ✨ Shine Cleaning - Professional Cleaning Services in Armenia

A modern, multi-language website for Shine Cleaning with a built-in admin panel.

## 🌟 Features

### Website
- **Multi-language support**: English, Armenian (Հայերեն), Russian (Русский)
- **Responsive design**: Works on all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Services showcase**: Office, Home, Commercial, and Deep Cleaning
- **Pricing calculator**: Interactive tool to estimate cleaning costs
- **Contact form**: Easy way for customers to reach you

### Admin Panel
- **Secure login**: Password-protected access
- **Dashboard**: Overview of all requests with statistics
- **Request management**: View, filter, search, update, and delete requests
- **Quick actions**: Call or WhatsApp customers directly
- **Settings**: Change password and view account info
- **Auto-refresh**: Real-time updates every 3 seconds

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### 3. Access Admin Panel
Navigate to `http://localhost:5173/admin`

**Default Password:** `shine2024`

## 📋 How It Works

### For Customers
1. Visit the website
2. Browse services and pricing
3. Fill out the contact form
4. Request is saved and appears in admin panel

### For Admin
1. Login to admin panel at `/admin`
2. View dashboard with statistics
3. Manage requests (view, update status, delete)
4. Contact customers via phone or WhatsApp
5. Change password in settings

## 🔐 Admin Panel Features

### Dashboard
- Total requests count
- New requests (not yet contacted)
- Contacted requests
- Completed requests
- Recent requests preview

### Requests Management
- **Filter**: All / New / Contacted / Completed
- **Search**: By name, phone, or message
- **Update status**: Change request status
- **Delete**: Remove requests
- **Quick actions**: Call or WhatsApp customers

### Settings
- View account information
- Change password
- Data storage info

## 🛠️ Customization

### Change Admin Password
Edit `src/pages/AdminPanel.tsx`:
```typescript
const ADMIN_PASSWORD = 'your_new_password';
```

### Change Pricing
Edit `src/App.tsx`:
```typescript
const pricingRates = {
  office: 500,      // AMD per sq.m
  home: 400,        // AMD per sq.m
  commercial: 350,  // AMD per sq.m
  deep: 800         // AMD per sq.m
};
```

### Change Contact Information
Edit `src/App.tsx`:
```typescript
// Phone number
+374 77 442554

// Contact person
Irina
```

### Change Colors
Edit Tailwind classes in components. Main colors:
- Primary: Sky blue (`sky-500`, `blue-600`)
- Accent: Yellow (`yellow-400`)
- Background: White, light gray

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder. Deploy this folder to your hosting provider.

## 🌐 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Option 2: Netlify
1. Push code to GitHub
2. Connect to Netlify
3. Deploy automatically

### Option 3: Any Hosting
1. Run `npm run build`
2. Upload `dist` folder to your hosting
3. Configure domain and SSL

## 💾 Data Storage

Requests are stored in the browser's localStorage. This means:
- ✅ Works immediately without setup
- ✅ No database required
- ✅ Fast and simple
- ⚠️ Data is per-browser (admin sees requests from their browser)
- ⚠️ Data is lost if browser cache is cleared

For production with multi-device access, consider integrating:
- Supabase (free tier available)
- Firebase
- Custom backend

## 📱 Mobile Responsive

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🌍 Languages

The website supports three languages:
- **English** (default)
- **Armenian** (Հայերեն)
- **Russian** (Русский)

Language switcher is in the header.

## 🎨 Design

- **Color scheme**: Sky blue, white, yellow accents
- **Typography**: Inter font family
- **Icons**: Emoji-based for simplicity
- **Animations**: Smooth transitions and hover effects

## 🔧 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **date-fns** - Date formatting
- **localStorage** - Data storage

## 📞 Contact

- **Phone**: +374 77 442554
- **Contact Person**: Irina
- **Location**: Yerevan, Armenia

## 📄 License

This project is created for Shine Cleaning.

## 🎉 Ready to Use!

The website is ready to deploy. Just:
1. Change the admin password
2. Update contact information if needed
3. Build and deploy
4. Start receiving requests!

---

**Built with ❤️ for Shine Cleaning**
