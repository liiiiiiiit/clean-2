# 📋 راهنمای کامل فرم رزرو چند مرحله‌ای

## 🎯 معرفی

سیستم فرم رزرو چند مرحله‌ای Shine Cleaning برای افزایش نرخ تبدیل و تجربه کاربری بهتر طراحی شده است.

---

## 📊 ساختار فرم 4 مرحله‌ای

### مرحله 1: Property Details (جزئیات ملک)
**هدف:** درک نوع و اندازه ملک

#### فیلدها:
1. **نوع ملک** (Radio Buttons - اجباری)
   - 🏠 مسکونی (Residential)
   - 🏢 اداری (Office)
   - 🏪 تجاری (Commercial)

2. **متراژ** (Number Input - اجباری)
   - حداقل: 10 متر مربع
   - Placeholder: "50"

3. **تعداد اتاق خواب** (Dropdown - فقط مسکونی)
   - 0, 1, 2, 3, 4+

4. **تعداد حمام** (Dropdown - فقط مسکونی)
   - 1, 2, 3+

5. **نام شرکت** (Text Input - فقط تجاری/اداری)
   - Placeholder: "ABC Company LLC"

#### منطق UX:
- فیلدهای مسکونی فقط وقتی نمایش داده می‌شوند که "مسکونی" انتخاب شده باشد
- فیلد نام شرکت فقط برای تجاری/اداری نمایش داده می‌شود
- دکمه "Next" تا زمانی که فیلدهای اجباری پر نشوند، غیرفعال است

---

### مرحله 2: Service & Schedule (خدمات و زمان‌بندی)
**هدف:** انتخاب نوع خدمات و زمان

#### فیلدها:
1. **نوع خدمات** (Card Selection - اجباری)
   - 🧹 نظافت عادی (Regular)
   - ✨ نظافت عمیق (Deep Clean)
   - 📦 نظافت اسباب‌کشی (Move In/Out)
   - 🏗️ بعد از ساخت‌وساز (Post-Construction)
   - 🪟 شستشوی پنجره‌ها (Windows)
   - 🛋️ شستشوی فرش (Carpet)

2. **تاریخ** (Date Picker - اجباری)
   - حداقل تاریخ: امروز
   - Format: YYYY-MM-DD

3. **ساعت** (Dropdown - اجباری)
   - از 08:00 تا 19:00
   - هر ساعت یک گزینه

4. **تکرار** (Card Selection - اجباری)
   - یکبار (One-time) - 0% تخفیف
   - هفتگی (Weekly) - 15% تخفیف
   - دو هفته یکبار (Bi-weekly) - 10% تخفیف
   - ماهانه (Monthly) - 5% تخفیف

#### منطق UX:
- کارت‌های خدمات با آیکون و نام واضح
- نمایش درصد تخفیف برای تکرارهای منظم
- دکمه "Next" تا زمانی که همه فیلدها پر نشوند، غیرفعال است

---

### مرحله 3: Add-on Services (خدمات اضافی)
**هدف:** افزایش ارزش سفارش با خدمات اضافی

#### فیلدها:
1. **خدمات اضافی** (Checkboxes - اختیاری)
   - 🍳 داخل فر (Inside Oven) - +15,000 AMD
   - ❄️ داخل یخچال (Inside Fridge) - +12,000 AMD
   - 👕 شستشوی لباس (Laundry) - +8,000 AMD
   - 👔 اتو کردن (Ironing) - +10,000 AMD
   - 🗄️ داخل کابینت‌ها (Inside Cabinets) - +20,000 AMD
   - 🪟 پنجره‌های داخلی (Interior Windows) - +15,000 AMD

2. **درخواست‌های خاص** (Textarea - اختیاری)
   - Placeholder: "E.g., We have pets, please use pet-friendly products..."
   - حداکثر 500 کاراکتر

#### منطق UX:
- هر checkbox با آیکون، نام و قیمت
- انتخاب بصری با border و background رنگی
- کاربر می‌تواند چندین خدمت اضافی انتخاب کند

---

### مرحله 4: Contact Information (اطلاعات تماس)
**هدف:** دریافت اطلاعات تماس و نهایی کردن سفارش

#### فیلدها:
1. **نام کامل** (Text Input - اجباری)
   - Placeholder: "John Smith"

2. **شماره تلفن** (Tel Input - اجباری)
   - Placeholder: "+374 XX XXX XXX"

3. **ایمیل** (Email Input - اختیاری)
   - Placeholder: "example@email.com"

4. **آدرس** (Text Input - اجباری)
   - Placeholder: "Street, Building, Apt, City"

5. **یادداشت‌های اضافی** (Textarea - اختیاری)
   - Placeholder: "Gate code, parking instructions, etc."

#### Price Summary:
- نمایش قیمت پایه
- نمایش هزینه خدمات اضافی
- نمایش قیمت نهایی

#### دکمه نهایی:
- "Confirm Booking ✓" (سبز رنگ)
- تا زمانی که فیلدهای اجباری پر نشوند، غیرفعال است

---

## 💰 منطق قیمت‌گذاری

### فرمول محاسبه قیمت:

```typescript
قیمت نهایی = (قیمت پایه × ضریب ملک) × ضریب تکرار + هزینه خدمات اضافی
```

### جزئیات:

#### 1. قیمت پایه بر اساس نوع خدمات:
```typescript
const servicePrices = {
  regular: 400,          // AMD per sq.m
  deep: 600,             // AMD per sq.m
  move: 700,             // AMD per sq.m
  postConstruction: 800, // AMD per sq.m
  window: 500,           // AMD per sq.m
  carpet: 550,           // AMD per sq.m
};
```

#### 2. ضریب نوع ملک:
```typescript
const propertyMultiplier = {
  residential: 1.0,      // استاندارد
  office: 1.15,          // +15% برای اداری
  commercial: 1.2,       // +20% برای تجاری
};
```

#### 3. ضریب تکرار (تخفیف):
```typescript
const frequencyMultiplier = {
  'one-time': 1.0,       // بدون تخفیف
  'weekly': 0.85,        // 15% تخفیف
  'bi-weekly': 0.90,     // 10% تخفیف
  'monthly': 0.95,       // 5% تخفیف
};
```

#### 4. هزینه خدمات اضافی:
```typescript
const addonPrices = {
  oven: 15000,           // AMD fixed
  fridge: 12000,         // AMD fixed
  laundry: 8000,         // AMD fixed
  ironing: 10000,        // AMD fixed
  cabinets: 20000,       // AMD fixed
  windows: 15000,        // AMD fixed
};
```

### مثال محاسبه:

**سناریو:**
- ملک: اداری (Office)
- متراژ: 100 sq.m
- خدمات: نظافت عمیق (Deep Clean)
- تکرار: هفتگی (Weekly)
- خدمات اضافی: داخل فر + داخل یخچال

**محاسبه:**
```
قیمت پایه = 600 AMD × 100 sq.m = 60,000 AMD
ضریب ملک = 60,000 × 1.15 = 69,000 AMD
ضریب تکرار = 69,000 × 0.85 = 58,650 AMD
خدمات اضافی = 15,000 + 12,000 = 27,000 AMD
قیمت نهایی = 58,650 + 27,000 = 85,650 AMD
```

---

## 🎨 UX/UI Design Principles

### 1. Progress Bar
- نمایش 4 مرحله با دایره‌های شماره‌دار
- مرحله فعلی با رنگ آبی ملایم
- مراحل قبلی با خط متصل
- نام هر مرحله در زیر دایره

### 2. Visual Hierarchy
- عناوین بزرگ و واضح
- فیلدهای اجباری با ستاره (*)
- Placeholder های راهنما
- فاصله مناسب بین عناصر

### 3. Interactive Elements
- **Radio Buttons:** کارت‌های بزرگ با آیکون
- **Checkboxes:** لیبل‌های کامل با قیمت
- **Buttons:** رنگی و واضح (آبی برای Next، سبز برای Submit)
- **Disabled State:** خاکستری و غیرقابل کلیک

### 4. Feedback
- **Success Message:** تیک سبز + پیام تشکر + نمایش قیمت
- **Error Handling:** Alert برای خطاها
- **Validation:** دکمه‌ها تا پر شدن فیلدهای اجباری غیرفعال هستند

### 5. Mobile Optimization
- فرم‌ها تمام عرض صفحه را می‌گیرند
- دکمه‌ها بزرگ و قابل لمس
- فیلدها با padding مناسب
- Progress bar ساده‌تر در موبایل

---

## 📝 Copywriting & Tone

### Tone:
- **Friendly:** صمیمی و گرم
- **Professional:** حرفه‌ای و قابل اعتماد
- **Clear:** واضح و بدون ابهام
- **Action-oriented:** ترغیب به اقدام

### Examples:

#### Headings:
- ✅ "Book Your Cleaning" (دعوت به اقدام)
- ✅ "Step 1: Property Details" (واضح و مشخص)
- ❌ "Fill Out This Form" (خشک و رسمی)

#### Labels:
- ✅ "What type of property?" (سوالی و صمیمی)
- ✅ "Area (sq.m)?" (کوتاه و واضح)
- ❌ "Property Type Selection" (رسمی و خشک)

#### Placeholders:
- ✅ "50" (ساده و واضح)
- ✅ "+374 XX XXX XXX" (فرمت واقعی)
- ✅ "E.g., We have pets..." (مثال کاربردی)
- ❌ "Enter value here" (کلی و بی‌معنی)

#### Buttons:
- ✅ "Next →" (اقدام واضح)
- ✅ "Confirm Booking ✓" (تأیید نهایی)
- ✅ "← Back" (بازگشت)
- ❌ "Submit" (کلی و بی‌معنی)

#### Success Message:
```
✅ Thank You!
Your booking request has been received. 
We will contact you within 30 minutes.

Estimated Price: 85,650 AMD
```

---

## 🔄 B2B vs B2C Segmentation

### B2C (Residential):
**فیلدهای اضافی:**
- تعداد اتاق خواب
- تعداد حمام

**ویژگی‌ها:**
- قیمت استاندارد
- تمرکز بر راحتی و آسانی
- تخفیف برای تکرار منظم
- زبان صمیمی‌تر

### B2B (Commercial/Office):
**فیلدهای اضافی:**
- نام شرکت

**ویژگی‌ها:**
- ضریب قیمت بالاتر (+15-20%)
- تمرکز بر حرفه‌ای بودن
- امکان فاکتور رسمی
- زبان رسمی‌تر

---

## 📊 Conversion Optimization

### 1. Reduce Friction
- ✅ فرم چند مرحله‌ای (کمتر overwhelming)
- ✅ Progress bar (کاربر می‌داند چقدر مانده)
- ✅ Auto-save (اگر صفحه رفرش شود)
- ✅ Validation واضح (کاربر می‌داند چه چیزی اشتباه است)

### 2. Build Trust
- ✅ نمایش قیمت در هر مرحله
- ✅ تخفیف برای تکرار منظم
- ✅ پیام موفقیت با جزئیات
- ✅ اطلاعات تماس واضح

### 3. Increase Value
- ✅ خدمات اضافی با قیمت واضح
- ✅ نمایش تخفیف‌ها
- ✅ Price summary شفاف
- ✅ Upsell opportunities

### 4. Mobile First
- ✅ طراحی ریسپانسیو
- ✅ دکمه‌های بزرگ
- ✅ فیلدهای آسان برای تایپ
- ✅ Progress bar ساده

---

## 🎯 Best Practices

### Do's:
✅ از آیکون‌ها استفاده کنید (بصری‌تر)
✅ قیمت‌ها را واضح نمایش دهید
✅ تخفیف‌ها را برجسته کنید
✅ از رنگ‌های ملایم استفاده کنید
✅ فیلدهای اجباری را مشخص کنید
✅ Placeholder های مفید بنویسید
✅ دکمه‌های واضح و بزرگ داشته باشید
✅ Progress bar نمایش دهید

### Don'ts:
❌ فرم طولانی در یک صفحه
❌ فیلدهای اجباری بدون علامت
❌ Placeholder های بی‌معنی
❌ دکمه‌های کوچک و نامشخص
❌ بدون feedback بعد از submit
❌ قیمت‌های پنهان
❌ زبان رسمی و خشک
❌ بدون mobile optimization

---

## 🚀 Future Enhancements

### Phase 2:
- [ ] ذخیره خودکار (Auto-save)
- [ ] ارسال ایمیل تأیید
- [ ] تقویم تعاملی
- [ ] نقشه برای آدرس
- [ ] آپلود تصویر از ملک

### Phase 3:
- [ ] سیستم پرداخت آنلاین
- [ ] بررسی موجودی زمان
- [ ] نظرات مشتریان
- [ ] سیستم وفاداری
- [ ] ارجاع دوستان

---

## 📞 Support

اگر سوالی دارید:
- 📞 +374 77 442554
- 👤 Irina
- 📍 Yerevan, Armenia
- 🕐 Mon - Sat: 8:00 - 20:00

---

**نسخه:** 1.0
**آخرین به‌روزرسانی:** 2024
**وضعیت:** ✅ آماده برای استفاده
