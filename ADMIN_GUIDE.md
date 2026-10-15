# 🎯 Admin Panel Guide - Services, Pricing & Work Samples

## Overview

The admin panel now includes three new management sections:
- **Services** - Add, edit, and delete service types
- **Pricing** - Set prices per square meter for each service
- **Work Samples** - Showcase your cleaning projects with images

All changes are saved automatically and reflected on the main website in real-time.

---

## 🔐 Accessing the Admin Panel

1. Click **"Admin Panel"** in the top navigation bar
2. Or click **"Staff Portal"** in the footer
3. Or navigate to `/#admin`

**Login Credentials:**
- Username: `admin`
- Password: `shine2026`

---

## 🛠️ Managing Services

### What You Can Do:
- ✅ Add new service types
- ✅ Edit existing services (title, description, icon, colors)
- ✅ Delete services
- ✅ Customize icons (emojis) and color schemes

### How to Add a New Service:

1. Click the **"Services"** tab
2. Click the **"+ Add Service"** button
3. Fill in the form:
   - **Service Key**: Unique identifier (e.g., `carpet`, `window`)
   - **Title**: Display name (e.g., "Carpet Cleaning")
   - **Description**: Brief description of the service
   - **Icon**: Emoji (e.g., 🧽, 🪟, 🛋️)
   - **Background Color**: Choose from preset gradients
   - **Icon Background**: Choose icon gradient color
4. Click **"Add Service"**

### How to Edit a Service:

1. Click the **"Services"** tab
2. Find the service you want to edit
3. Click the **edit icon** (✏️) on the service card
4. Modify the fields
5. Click **"Update Service"**

### How to Delete a Service:

1. Click the **"Services"** tab
2. Find the service you want to delete
3. Click the **delete icon** (🗑️) on the service card
4. Confirm deletion

**Note:** Deleting a service will also remove its pricing information.

---

## 💰 Managing Pricing

### What You Can Do:
- ✅ Set price per square meter for each service
- ✅ Update prices in real-time
- ✅ Changes automatically sync with the website calculator

### How to Update Pricing:

1. Click the **"Pricing"** tab
2. Find the service you want to price
3. Enter the price per square meter in AMD
4. The price is saved automatically

**Example:**
- Office Cleaning: 500 AMD/sq.m
- Home Cleaning: 400 AMD/sq.m
- Deep Cleaning: 800 AMD/sq.m

**Note:** The pricing calculator on the main website will automatically update when you change prices.

---

## 🖼️ Managing Work Samples

### What You Can Do:
- ✅ Add work samples with images
- ✅ Edit existing samples
- ✅ Delete samples
- ✅ Categorize by service type

### How to Add a Work Sample:

1. Click the **"Work Samples"** tab
2. Click the **"+ Add Sample"** button
3. Fill in the form:
   - **Title**: Project name (e.g., "Office Deep Clean - Downtown")
   - **Service Type**: Select the service category
   - **Description**: Describe the work done
   - **Image URL**: Paste the image URL (must be publicly accessible)
4. Preview the image
5. Click **"Add Sample"**

### Image URL Tips:

**Good sources for images:**
- Your own website: `https://yourwebsite.com/images/sample1.jpg`
- Cloud storage: Google Drive, Dropbox (with public link)
- Image hosting: Imgur, Cloudinary
- CDN: Any publicly accessible URL

**Image requirements:**
- Must be publicly accessible (no login required)
- Recommended size: 800x600px or larger
- Supported formats: JPG, PNG, WebP
- Max recommended size: 2MB

**Example URLs:**
```
https://images.unsplash.com/photo-1581578731548-c64695cc6952
https://your-domain.com/uploads/cleaning-sample-1.jpg
```

### How to Edit a Work Sample:

1. Click the **"Work Samples"** tab
2. Find the sample you want to edit
3. Click the **edit icon** (✏️)
4. Modify the fields
5. Click **"Update Sample"**

### How to Delete a Work Sample:

1. Click the **"Work Samples"** tab
2. Find the sample you want to delete
3. Click the **delete icon** (🗑️)
4. Confirm deletion

---

## 🔄 How Changes Sync

All changes are saved to your browser's localStorage and automatically sync with the main website:

1. **Services** → Updates the Services section on the main site
2. **Pricing** → Updates the Pricing Calculator on the main site
3. **Work Samples** → Updates the Work Samples section on the main site

**Sync behavior:**
- Changes are saved immediately
- Main site checks for updates every 2 seconds
- No page refresh needed
- Works across tabs in the same browser

---

## 💡 Best Practices

### Services:
- Use clear, descriptive titles
- Keep descriptions concise (1-2 sentences)
- Choose relevant emojis for icons
- Use consistent color schemes

### Pricing:
- Research competitor pricing
- Consider your costs and profit margins
- Update prices seasonally if needed
- Test the calculator after changes

### Work Samples:
- Use high-quality, well-lit photos
- Show before/after if possible
- Write detailed descriptions
- Categorize correctly by service type
- Update samples regularly (monthly recommended)

---

## 🎨 Color Scheme Options

### Background Colors:
- **Sky Blue**: `from-sky-50 to-blue-50`
- **Emerald**: `from-emerald-50 to-teal-50`
- **Violet**: `from-violet-50 to-purple-50`
- **Amber**: `from-amber-50 to-orange-50`
- **Rose**: `from-rose-50 to-pink-50`
- **Cyan**: `from-cyan-50 to-sky-50`

### Icon Backgrounds:
- **Sky Blue**: `from-sky-400 to-blue-500`
- **Emerald**: `from-emerald-400 to-teal-500`
- **Violet**: `from-violet-400 to-purple-500`
- **Amber**: `from-amber-400 to-orange-500`
- **Rose**: `from-rose-400 to-pink-500`
- **Cyan**: `from-cyan-400 to-sky-500`

---

## 🔧 Troubleshooting

### Services not showing on main site?
- Check that services are saved in admin panel
- Refresh the main site page
- Check browser console for errors

### Pricing not updating?
- Ensure service key matches between services and pricing
- Check that price is a valid number
- Refresh the main site page

### Work samples not displaying?
- Verify image URL is publicly accessible
- Check image URL format (must start with http:// or https://)
- Try a different image URL
- Check browser console for errors

### Changes not syncing?
- Make sure you're in the same browser
- Clear browser cache if needed
- Check localStorage is enabled
- Try refreshing both admin and main site

---

## 📊 Data Storage

All data is stored in your browser's localStorage:
- `shine_services` - Service definitions
- `shine_pricing` - Pricing rates
- `shine_work_samples` - Work sample data

**Important:**
- Data is per-browser (not shared across devices)
- Clearing browser data will reset to defaults
- Consider backing up your data regularly

---

## 🚀 Quick Reference

| Feature | Location | Action |
|---------|----------|--------|
| Add Service | Services tab → + Add Service | Fill form → Add Service |
| Edit Service | Services tab → Edit icon | Modify → Update Service |
| Delete Service | Services tab → Delete icon | Confirm deletion |
| Update Price | Pricing tab → Input field | Enter price (auto-saves) |
| Add Sample | Work Samples tab → + Add Sample | Fill form → Add Sample |
| Edit Sample | Work Samples tab → Edit icon | Modify → Update Sample |
| Delete Sample | Work Samples tab → Delete icon | Confirm deletion |

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Verify all required fields are filled
3. Ensure image URLs are accessible
4. Try clearing browser cache
5. Contact technical support

---

**Last Updated:** 2024
**Version:** 3.0 (with Services, Pricing & Work Samples management)
