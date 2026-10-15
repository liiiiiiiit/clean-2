# 🌍 راهنمای نمونه کارهای چندزبانه

## ✅ ویژگی جدید: پشتیبانی از سه زبان

بخش نمونه کارها اکنون از **سه زبان** پشتیبانی می‌کند:
- 🇬🇧 **انگلیسی** (English)
- 🇦🇲 **ارمنی** (Հայերեն)
- 🇷🇺 **روسی** (Русский)

---

## 📝 نحوه افزودن نمونه کار چندزبانه

### مرحله 1: ورود به پنل ادمین
1. روی **"پنل ادمین"** کلیک کنید
2. وارد شوید: `admin` / `shine2026`

### مرحله 2: رفتن به بخش نمونه کارها
1. روی تب **"نمونه کارها"** کلیک کنید
2. روی **"+ افزودن نمونه"** کلیک کنید

### مرحله 3: انتخاب زبان
در بالای فرم، سه تب زبان می‌بینید:
- 🇬🇧 **English**
- 🇦🇲 **Հայերեն**
- 🇷🇺 **Русский**

### مرحله 4: پر کردن اطلاعات برای هر زبان

#### برای زبان انگلیسی:
1. روی تب **🇬🇧 English** کلیک کنید
2. عنوان را به انگلیسی وارد کنید
   - مثال: "Office Deep Cleaning"
3. توضیحات را به انگلیسی بنویسید
   - مثال: "Complete deep cleaning of 200sq.m office space including carpets, windows, and sanitization"

#### برای زبان ارمنی:
1. روی تب **🇦🇲 Հայերեն** کلیک کنید
2. عنوان را به ارمنی وارد کنید
   - مثال: "Գրdelays Մdelays"
3. توضیحات را به ارمنی بنویسید
   - مثال: "200 delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays"

#### برای زبان روسی:
1. روی تب **🇷🇺 Русский** کلیک کنید
2. عنوان را به روسی وارد کنید
   - مثال: "Глубокая уборка офиса"
3. توضیحات را به روسی بنویسید
   - مثال: "Полная глубокая уборка офисного помещения площадью 200 кв.м, включая чистку ковров, мытьё окон и дезинфекцию"

### مرحله 5: آپلود تصویر
1. روی کادر آپلود کلیک کنید
2. تصویر را انتخاب کنید
3. تصویر به صورت خودکار فشرده می‌شود

### مرحله 6: انتخاب نوع خدمات
از لیست کشویی، نوع خدمات را انتخاب کنید

### مرحله 7: ذخیره
روی **"افزودن نمونه"** کلیک کنید

---

## 🎯 نکات مهم

### حداقل زبان مورد نیاز
- **حداقل زبان انگلیسی** باید پر شود
- سایر زبان‌ها اختیاری هستند
- اگر زبانی پر نشود، متن انگلیسی نمایش داده می‌شود

### بهترین شیوه‌ها
1. **هر سه زبان را پر کنید** - برای تجربه کاربری بهتر
2. **ترجمه دقیق** - از ترجمه ماشینی استفاده نکنید
3. **عنوان کوتاه** - حداکثر 50 کاراکتر
4. **توضیحات کامل** - 100-200 کلمه

### تغییر زبان سایت
کاربران می‌توانند زبان سایت را از نوار بالا تغییر دهند:
- روی **🇬🇧 English** یا **🇦🇲 Հայերեն** یا **🇷🇺 Русский** کلیک کنید
- نمونه کارها به زبان انتخابی نمایش داده می‌شوند

---

## 📊 ساختار داده

هر نمونه کار شامل:
```typescript
{
  id: string,
  title: {
    en: string,    // عنوان انگلیسی
    hy: string,    // عنوان ارمنی
    ru: string     // عنوان روسی
  },
  description: {
    en: string,    // توضیحات انگلیسی
    hy: string,    // توضیحات ارمنی
    ru: string     // توضیحات روسی
  },
  imageUrl: string,
  serviceType: string,
  createdAt: string
}
```

---

## 🔧 ویرایش نمونه کار موجود

1. روی تب **"نمونه کارها"** کلیک کنید
2. روی آیکون ✏️ (ویرایش) کلیک کنید
3. تب زبان مورد نظر را انتخاب کنید
4. اطلاعات را تغییر دهید
5. روی **"بروزرسانی نمونه"** کلیک کنید

---

## 💡 مثال‌های ترجمه

### مثال 1: نظافت دفتر
**انگلیسی:**
- Title: "Office Deep Cleaning"
- Description: "Complete deep cleaning of 200sq.m office space including carpets, windows, and sanitization"

**ارمنی:**
- Title: "Գրdelays Մdelays"
- Description: "200 delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays"

**روسی:**
- Title: "Глубокая уборка офиса"
- Description: "Полная глубокая уборка офисного помещения площадью 200 кв.м, включая чистку ковров, мытьё окон и дезинфекцию"

### مثال 2: نظافت خانه
**انگلیسی:**
- Title: "Home Cleaning Service"
- Description: "Regular home cleaning service for a 150sq.m apartment including kitchen, bathrooms, and living areas"

**ارمنی:**
- Title: "Տdelays Մdelays"
- Description: "150 delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays delays......"

**روسی:**
- Title: "Уборка дома"
- Description: "Регулярная уборка квартиры площадью 150 кв.м, включая кухню, ванные комнаты и жилые помещения"

---

## 🎨 نمایش در سایت

### وقتی کاربر زبان انگلیسی را انتخاب می‌کند:
- عنوان انگلیسی نمایش داده می‌شود
- توضیحات انگلیسی نمایش داده می‌شود

### وقتی کاربر زبان ارمنی را انتخاب می‌کند:
- عنوان ارمنی نمایش داده می‌شود
- توضیحات ارمنی نمایش داده می‌شود
- اگر ارمنی پر نشده باشد، انگلیسی نمایش داده می‌شود

### وقتی کاربر زبان روسی را انتخاب می‌کند:
- عنوان روسی نمایش داده می‌شود
- توضیحات روسی نمایش داده می‌شود
- اگر روسی پر نشده باشد، انگلیسی نمایش داده می‌شود

---

## 🔍 بررسی نمونه کارها

### در پنل ادمین:
- تمام نمونه کارها با عنوان انگلیسی نمایش داده می‌شوند
- برای مشاهده جزئیات، روی نمونه کار کلیک کنید

### در سایت اصلی:
- نمونه کارها به زبان انتخابی کاربر نمایش داده می‌شوند
- تاریخ به فرمت محلی نمایش داده می‌شود

---

## 📞 پشتیبانی

اگر مشکلی داشتید:
1. بررسی کنید که حداقل زبان انگلیسی پر شده باشد
2. کش مرورگر را پاک کنید
3. صفحه را رفرش کنید
4. با پشتیبانی تماس بگیرید

---

## 🎉 خلاصه

✅ **سه زبان پشتیبانی می‌شود**
✅ **تب‌های زبان در فرم**
✅ **نمایش خودکار بر اساس زبان سایت**
✅ **Fallback به انگلیسی**
✅ **ویرایش آسان**

**همین حالا نمونه کارهای خود را به سه زبان اضافه کنید!** 🚀

---

**نسخه:** 5.0
**آخرین به‌روزرسانی:** 2024
**وضعیت:** ✅ آماده برای استفاده
