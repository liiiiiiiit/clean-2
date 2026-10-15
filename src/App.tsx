import { useState, useEffect } from 'react';
import { translations, Language } from './translations';
import AdminPanel from './pages/AdminPanel';
import { getServices, getPricing, getWorkSamples, type Service, type WorkSample } from './lib/dataStore';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [serviceType, setServiceType] = useState('home');
  const [area, setArea] = useState(50);
  const [showPrice, setShowPrice] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', message: '' });
  const [showAdmin, setShowAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [pricingRates, setPricingRates] = useState<Record<string, number>>({});
  const [workSamples, setWorkSamples] = useState<WorkSample[]>([]);
  
  // Multi-step booking form state
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // Step 1: Property Details
    propertyType: '' as '' | 'residential' | 'commercial' | 'office',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    companyName: '',
    
    // Step 2: Service & Schedule
    serviceType: '' as '' | 'regular' | 'deep' | 'move' | 'postConstruction' | 'window' | 'carpet',
    date: '',
    time: '',
    frequency: '' as '' | 'one-time' | 'weekly' | 'bi-weekly' | 'monthly',
    
    // Step 3: Add-ons
    addons: [] as string[],
    specialRequests: '',
    
    // Step 4: Contact
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const t = translations[lang];

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      setShowAdmin(hash === '#admin');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const loadedServices = getServices();
      const loadedPricing = getPricing();
      const loadedSamples = getWorkSamples();
      
      setServices(loadedServices);
      
      const pricingObj: Record<string, number> = {};
      loadedPricing.forEach(p => {
        pricingObj[p.serviceKey] = p.ratePerSqm;
      });
      setPricingRates(pricingObj);
      
      setWorkSamples(loadedSamples);
    };

    loadData();
    window.addEventListener('storage', loadData);
    const interval = setInterval(loadData, 2000);
    
    return () => {
      window.removeEventListener('storage', loadData);
      clearInterval(interval);
    };
  }, []);

  const calculatedPrice = pricingRates[serviceType] ? pricingRates[serviceType] * area : 0;

  // Multi-step booking form pricing logic
  const calculateBookingPrice = () => {
    let basePrice = 0;
    
    // Base price by service type
    const servicePrices: Record<string, number> = {
      regular: 400,
      deep: 600,
      move: 700,
      postConstruction: 800,
      window: 500,
      carpet: 550,
    };
    
    basePrice = (servicePrices[bookingData.serviceType] || 400) * (bookingData.area || 50);
    
    // Frequency discount
    const frequencyMultiplier: Record<string, number> = {
      'one-time': 1,
      weekly: 0.85,
      'bi-weekly': 0.9,
      monthly: 0.95,
    };
    basePrice *= frequencyMultiplier[bookingData.frequency] || 1;
    
    // Add-ons price
    const addonPrices: Record<string, number> = {
      oven: 15000,
      fridge: 12000,
      laundry: 8000,
      ironing: 10000,
      cabinets: 20000,
      windows: 15000,
    };
    
    let addonsTotal = 0;
    bookingData.addons.forEach(addon => {
      addonsTotal += addonPrices[addon] || 0;
    });
    
    // Commercial/Office multiplier
    const propertyMultiplier = bookingData.propertyType === 'commercial' ? 1.2 : 
                               bookingData.propertyType === 'office' ? 1.15 : 1;
    
    return Math.round((basePrice + addonsTotal) * propertyMultiplier);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newRequest = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        status: 'new' as const,
        created_at: new Date().toISOString(),
      };

      const existingRequests = JSON.parse(localStorage.getItem('shine_requests') || '[]');
      existingRequests.push(newRequest);
      localStorage.setItem('shine_requests', JSON.stringify(existingRequests));

      setFormSubmitted(true);
      setFormData({ name: '', phone: '', service: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 4000);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to send message. Please try again or call us directly at +374 77 442554.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);

    try {
      const newRequest = {
        id: Date.now().toString(),
        name: bookingData.fullName,
        phone: bookingData.phone,
        service: bookingData.serviceType,
        message: `Property: ${bookingData.propertyType}, Area: ${bookingData.area}sqm, Date: ${bookingData.date} ${bookingData.time}, Frequency: ${bookingData.frequency}, Add-ons: ${bookingData.addons.join(', ')}, Address: ${bookingData.address}, Notes: ${bookingData.notes}`,
        status: 'new' as const,
        created_at: new Date().toISOString(),
      };

      const existingRequests = JSON.parse(localStorage.getItem('shine_requests') || '[]');
      existingRequests.push(newRequest);
      localStorage.setItem('shine_requests', JSON.stringify(existingRequests));

      setFormSubmitted(true);
      setBookingStep(1);
      setBookingData({
        propertyType: '',
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        companyName: '',
        serviceType: '',
        date: '',
        time: '',
        frequency: '',
        addons: [],
        specialRequests: '',
        fullName: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error('Booking submission failed:', error);
      alert('Failed to submit booking. Please try again or call us directly at +374 77 442554.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'Noto Sans Armenian', sans-serif" }}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-base sm:text-lg">✨</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Shine</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 -mt-1 tracking-wider uppercase">Cleaning</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: t.nav.home, href: '#home' },
                { label: t.nav.about, href: '#about' },
                { label: t.nav.services, href: '#services' },
                { label: t.nav.pricing, href: '#pricing' },
                { label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Заказать' : 'Book Now', href: '#booking' },
                { label: t.nav.contact, href: '#contact' },
              ].map((item) => (
                <a key={item.href} href={item.href} className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-all whitespace-nowrap">
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="flex gap-0.5 sm:gap-1">
                {([
                  { code: 'en' as Language, label: 'EN', flag: '🇬🇧' },
                  { code: 'hy' as Language, label: 'ՀԱՅ', flag: '🇦🇲' },
                  { code: 'ru' as Language, label: 'РУС', flag: '🇷🇺' },
                ]).map((l) => (
                  <button 
                    key={l.code} 
                    onClick={() => setLang(l.code)} 
                    className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs rounded-lg transition-all ${
                      lang === l.code 
                        ? 'bg-sky-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline mr-0.5">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>

              {/* CTA Button - Desktop */}
              <a href="#contact" className="hidden md:inline-flex items-center px-4 lg:px-5 py-2 lg:py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all whitespace-nowrap">
                {t.hero.cta}
              </a>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl">
            <div className="px-4 py-4 space-y-1">
              {[
                { label: t.nav.home, href: '#home' },
                { label: t.nav.about, href: '#about' },
                { label: t.nav.services, href: '#services' },
                { label: t.nav.pricing, href: '#pricing' },
                { label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Заказать' : 'Book Now', href: '#booking' },
                { label: t.nav.contact, href: '#contact' },
              ].map((item) => (
                <a 
                  key={item.href} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-sky-600 rounded-lg hover:bg-sky-50"
                >
                  {item.label}
                </a>
              ))}
              <a 
                href="#booking" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="block mt-4 text-center px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl"
              >
                {t.hero.cta}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50" />
        <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-100/40 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-4 sm:mb-6">
                <span className="text-yellow-500 text-sm">⭐</span>
                <span className="text-xs sm:text-sm font-medium text-yellow-700">{t.hero.tagline}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6 break-words">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg xl:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
                {t.hero.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12">
                <a href="#booking" className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-base sm:text-lg font-semibold rounded-2xl shadow-xl hover:from-sky-600 hover:to-blue-700 transition-all">
                  {t.hero.cta} →
                </a>
                <a href="#services" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 text-base sm:text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-sky-300 hover:text-sky-600 transition-all">
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span className="text-sky-500">🛡️</span> Guaranteed
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span className="text-sky-500">🕐</span> Flexible
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span className="text-yellow-500">⭐</span> 5-Star
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-8 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-gradient-to-br from-sky-200 to-blue-200 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl xl:text-7xl mb-4">✨</div>
                      <div className="text-xl xl:text-2xl font-bold text-sky-700">Shine</div>
                      <div className="text-sm text-sky-600">Professional Cleaning</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 xl:p-4 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="text-xl xl:text-2xl mb-1">🏢</div>
                  <div className="text-[10px] xl:text-xs font-medium text-gray-600">Office</div>
                </div>
                <div className="absolute bottom-16 left-0 bg-white rounded-2xl p-3 xl:p-4 shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="text-xl xl:text-2xl mb-1">🏠</div>
                  <div className="text-[10px] xl:text-xs font-medium text-gray-600">Home</div>
                </div>
                <div className="absolute top-1/2 -right-4 bg-white rounded-2xl p-3 xl:p-4 shadow-xl animate-bounce" style={{ animationDuration: '3.5s' }}>
                  <div className="text-xl xl:text-2xl mb-1">🧹</div>
                  <div className="text-[10px] xl:text-xs font-medium text-gray-600">Deep</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">{t.about.title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{t.about.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.about.features.map((feature: { title: string; desc: string }, index: number) => {
              const icons = ['🛡️', '🌿', '📅', '⭐'];
              return (
                <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-sky-200 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 text-xl sm:text-2xl">
                    {icons[index]}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">{t.services.title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service) => (
              <div key={service.id} className={`bg-gradient-to-br ${service.color} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${service.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg text-2xl sm:text-3xl`}>
                  {service.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{service.description}</p>
                <a href="#contact" className="text-sm font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">
                  Book Now →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">{t.pricing.title}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(pricingRates).map(([key, rate]) => (
              <div 
                key={key} 
                className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100 hover:shadow-lg transition-all"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 break-words">{(t.pricing.services as any)[key]}</h3>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-sky-600">{rate}</span>
                  <span className="text-sm text-gray-500">{t.pricing.currency}/{lang === 'hy' ? ' delays' : lang === 'ru' ? 'кв.м' : 'sq.m'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Samples Section */}
      {workSamples.length > 0 && (
        <section id="samples" className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-sky-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full mb-4 border border-sky-100">
                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-sky-700">{t.samples.title}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                {t.samples.title}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {t.samples.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {workSamples.map((sample) => {
                const service = services.find(s => s.key === sample.serviceType);
                return (
                  <div key={sample.id} className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-sky-200">
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img 
                        src={sample.imageUrl} 
                        alt={sample.title[lang]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {service && (
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-lg">
                            <span>{service.icon}</span>
                            <span className="text-gray-700">{service.title}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-sky-600 transition-colors break-words">
                        {sample.title[lang] || sample.title.en}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {sample.description[lang] || sample.description.en}
                      </p>
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          {new Date(sample.createdAt).toLocaleDateString(lang === 'hy' ? 'hy-AM' : lang === 'ru' ? 'ru-RU' : 'en-US')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-sky-600">
                          {t.samples.viewDetails} →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Multi-Step Booking Form Section */}
      <section id="booking" className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {lang === 'hy' ? 'Delays Delays' : lang === 'ru' ? 'Заказать уборку' : 'Book Your Cleaning'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {lang === 'hy' ? 'Delays delays delays delays' : lang === 'ru' ? 'Заполните форму и получите бесплатную оценку' : 'Fill out the form and get a free estimate in minutes'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    bookingStep >= step 
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`hidden sm:block w-12 md:w-20 lg:w-32 h-1 mx-2 transition-all ${
                      bookingStep > step ? 'bg-sky-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>{lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Детали' : 'Details'}</span>
              <span>{lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Услуга' : 'Service'}</span>
              <span>{lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Дополнительно' : 'Add-ons'}</span>
              <span>{lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Контакт' : 'Contact'}</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl">
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl">✅</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {lang === 'hy' ? 'Delays!' : lang === 'ru' ? 'Спасибо!' : 'Thank You!'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {lang === 'hy' ? 'Delays delays delays' : lang === 'ru' ? 'Ваша заявка принята. Мы свяжемся с вами в течение 30 минут.' : 'Your booking request has been received. We will contact you within 30 minutes.'}
                </p>
                <div className="bg-sky-50 rounded-xl p-4 sm:p-6 mt-4 w-full max-w-md">
                  <p className="text-sm text-gray-600 mb-2">
                    {lang === 'hy' ? 'Delays delays:' : lang === 'ru' ? 'Ориентировочная цена:' : 'Estimated Price:'}
                  </p>
                  <p className="text-3xl font-bold text-sky-600">{calculateBookingPrice().toLocaleString()} AMD</p>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Property Details */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                      {lang === 'hy' ? 'Delays 1: Delays Delays' : lang === 'ru' ? 'Шаг 1: Детали объекта' : 'Step 1: Property Details'}
                    </h3>

                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {lang === 'hy' ? 'Delays delays delays?' : lang === 'ru' ? 'Какой тип объекта?' : 'What type of property?'} *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'residential', icon: '🏠', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Жилой' : 'Residential' },
                          { value: 'office', icon: '🏢', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Офис' : 'Office' },
                          { value: 'commercial', icon: '🏪', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Коммерческий' : 'Commercial' },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, propertyType: type.value as any })}
                            className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
                              bookingData.propertyType === type.value
                                ? 'border-sky-500 bg-sky-50 shadow-md'
                                : 'border-gray-200 hover:border-sky-300'
                            }`}
                          >
                            <div className="text-3xl sm:text-4xl mb-2">{type.icon}</div>
                            <div className="text-sm sm:text-base font-medium">{type.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'hy' ? 'Delays (delays. delays)?' : lang === 'ru' ? 'Площадь (кв.м)?' : 'Area (sq.m)?'} *
                      </label>
                      <input
                        type="number"
                        value={bookingData.area || ''}
                        onChange={(e) => setBookingData({ ...bookingData, area: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                        placeholder="50"
                        min="10"
                        required
                      />
                    </div>

                    {/* Residential specific fields */}
                    {bookingData.propertyType === 'residential' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'hy' ? 'Delays delays?' : lang === 'ru' ? 'Спальни?' : 'Bedrooms?'}
                          </label>
                          <select
                            value={bookingData.bedrooms}
                            onChange={(e) => setBookingData({ ...bookingData, bedrooms: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {lang === 'hy' ? 'Delays?' : lang === 'ru' ? 'Ванные?' : 'Bathrooms?'}
                          </label>
                          <select
                            value={bookingData.bathrooms}
                            onChange={(e) => setBookingData({ ...bookingData, bathrooms: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Commercial/Office specific field */}
                    {(bookingData.propertyType === 'commercial' || bookingData.propertyType === 'office') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {lang === 'hy' ? 'Delays delays?' : lang === 'ru' ? 'Название компании?' : 'Company Name?'}
                        </label>
                        <input
                          type="text"
                          value={bookingData.companyName}
                          onChange={(e) => setBookingData({ ...bookingData, companyName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          placeholder={lang === 'hy' ? 'Delays Delays' : lang === 'ru' ? 'ООО Компания' : 'ABC Company LLC'}
                        />
                      </div>
                    )}

                    <button
                      onClick={() => setBookingStep(2)}
                      disabled={!bookingData.propertyType || !bookingData.area}
                      className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Далее' : 'Next'} →
                    </button>
                  </div>
                )}

                {/* Step 2: Service & Schedule */}
                {bookingStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                      {lang === 'hy' ? 'Delays 2: Delays Delays' : lang === 'ru' ? 'Шаг 2: Услуга и расписание' : 'Step 2: Service & Schedule'}
                    </h3>

                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {lang === 'hy' ? 'Delays delays delays?' : lang === 'ru' ? 'Какой тип уборки?' : 'What type of cleaning?'} *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'regular', icon: '🧹', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Обычная' : 'Regular' },
                          { value: 'deep', icon: '✨', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Глубокая' : 'Deep Clean' },
                          { value: 'move', icon: '📦', label: lang === 'hy' ? 'Delays/Delays' : lang === 'ru' ? 'Переезд' : 'Move In/Out' },
                          { value: 'postConstruction', icon: '🏗️', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'После ремонта' : 'Post-Construction' },
                          { value: 'window', icon: '🪟', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Окна' : 'Windows' },
                          { value: 'carpet', icon: '🛋️', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Ковры' : 'Carpet' },
                        ].map((service) => (
                          <button
                            key={service.value}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, serviceType: service.value as any })}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              bookingData.serviceType === service.value
                                ? 'border-sky-500 bg-sky-50 shadow-md'
                                : 'border-gray-200 hover:border-sky-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{service.icon}</div>
                            <div className="text-sm font-medium">{service.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {lang === 'hy' ? 'Delays?' : lang === 'ru' ? 'Дата?' : 'Date?'} *
                        </label>
                        <input
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {lang === 'hy' ? 'Delays?' : lang === 'ru' ? 'Время?' : 'Time?'} *
                        </label>
                        <select
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          required
                        >
                          <option value="">Select time</option>
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                          <option value="19:00">19:00</option>
                        </select>
                      </div>
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {lang === 'hy' ? 'Delays delays?' : lang === 'ru' ? 'Частота?' : 'Frequency?'} *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { value: 'one-time', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Один раз' : 'One-time' },
                          { value: 'weekly', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Еженедельно' : 'Weekly', discount: '-15%' },
                          { value: 'bi-weekly', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? '2 раза/мес' : 'Bi-weekly', discount: '-10%' },
                          { value: 'monthly', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Ежемесячно' : 'Monthly', discount: '-5%' },
                        ].map((freq) => (
                          <button
                            key={freq.value}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, frequency: freq.value as any })}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              bookingData.frequency === freq.value
                                ? 'border-sky-500 bg-sky-50 shadow-md'
                                : 'border-gray-200 hover:border-sky-300'
                            }`}
                          >
                            <div className="text-xs sm:text-sm font-medium">{freq.label}</div>
                            {freq.discount && <div className="text-xs text-green-600 font-semibold mt-1">{freq.discount}</div>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                      >
                        ← {lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Назад' : 'Back'}
                      </button>
                      <button
                        onClick={() => setBookingStep(3)}
                        disabled={!bookingData.serviceType || !bookingData.date || !bookingData.time || !bookingData.frequency}
                        className="flex-1 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Далее' : 'Next'} →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Add-ons */}
                {bookingStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                      {lang === 'hy' ? 'Delays 3: Delays delays' : lang === 'ru' ? 'Шаг 3: Дополнительные услуги' : 'Step 3: Add-on Services'}
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {lang === 'hy' ? 'Delays delays delays delays?' : lang === 'ru' ? 'Выберите дополнительные услуги:' : 'Select add-on services:'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'oven', icon: '🍳', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Духовка' : 'Inside Oven', price: '15,000' },
                          { value: 'fridge', icon: '❄️', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Холодильник' : 'Inside Fridge', price: '12,000' },
                          { value: 'laundry', icon: '👕', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Стирка' : 'Laundry', price: '8,000' },
                          { value: 'ironing', icon: '👔', label: lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Глажка' : 'Ironing', price: '10,000' },
                          { value: 'cabinets', icon: '🗄️', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Шкафы' : 'Inside Cabinets', price: '20,000' },
                          { value: 'windows', icon: '🪟', label: lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Окна внутри' : 'Interior Windows', price: '15,000' },
                        ].map((addon) => (
                          <label
                            key={addon.value}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              bookingData.addons.includes(addon.value)
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-gray-200 hover:border-sky-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={bookingData.addons.includes(addon.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBookingData({ ...bookingData, addons: [...bookingData.addons, addon.value] });
                                } else {
                                  setBookingData({ ...bookingData, addons: bookingData.addons.filter(a => a !== addon.value) });
                                }
                              }}
                              className="w-5 h-5 text-sky-600 rounded focus:ring-sky-500"
                            />
                            <div className="text-2xl">{addon.icon}</div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{addon.label}</div>
                              <div className="text-xs text-gray-500">+{addon.price} AMD</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'hy' ? 'Delays delays delays?' : lang === 'ru' ? 'Особые пожелания?' : 'Special Requests?'}
                      </label>
                      <textarea
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                        rows={3}
                        placeholder={lang === 'hy' ? 'Delays delays delays delays delays...' : lang === 'ru' ? 'Например: у нас есть собака...' : 'E.g., We have pets, please use pet-friendly products...'}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(2)}
                        className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                      >
                        ← {lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Назад' : 'Back'}
                      </button>
                      <button
                        onClick={() => setBookingStep(4)}
                        className="flex-1 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all"
                      >
                        {lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Далее' : 'Next'} →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Contact Info */}
                {bookingStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                      {lang === 'hy' ? 'Delays 4: Delays delays' : lang === 'ru' ? 'Шаг 4: Контактная информация' : 'Step 4: Contact Information'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {lang === 'hy' ? 'Delays delays?' : lang === 'ru' ? 'Полное имя?' : 'Full Name?'} *
                        </label>
                        <input
                          type="text"
                          value={bookingData.fullName}
                          onChange={(e) => setBookingData({ ...bookingData, fullName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          placeholder={lang === 'hy' ? 'Delays Delays' : lang === 'ru' ? 'Иван Иванов' : 'John Smith'}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {lang === 'hy' ? 'Delays delays?' : lang === 'ru' ? 'Телефон?' : 'Phone?'} *
                        </label>
                        <input
                          type="tel"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                          placeholder="+374 XX XXX XXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'hy' ? 'Delays?' : lang === 'ru' ? 'Email?' : 'Email?'}
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'hy' ? 'Delays?' : lang === 'ru' ? 'Адрес?' : 'Address?'} *
                      </label>
                      <input
                        type="text"
                        value={bookingData.address}
                        onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                        placeholder={lang === 'hy' ? 'Delays, Delays, delays, delays' : lang === 'ru' ? 'Улица, дом, квартира, город' : 'Street, Building, Apt, City'}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'hy' ? 'Delays delays?' : lang === 'ru' ? 'Дополнительные заметки?' : 'Additional Notes?'}
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none"
                        rows={3}
                        placeholder={lang === 'hy' ? 'Delays delays delays delays...' : lang === 'ru' ? 'Код от двери, парковка...' : 'Gate code, parking instructions, etc.'}
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {lang === 'hy' ? 'Delays delays:' : lang === 'ru' ? 'Итого:' : 'Price Summary:'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Базовая цена' : 'Base Price'}</span>
                          <span className="font-medium">{Math.round((pricingRates[bookingData.serviceType] || 400) * bookingData.area).toLocaleString()} AMD</span>
                        </div>
                        {bookingData.addons.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Дополнительно' : 'Add-ons'}</span>
                            <span className="font-medium">+{bookingData.addons.length * 15000} AMD</span>
                          </div>
                        )}
                        <div className="border-t border-sky-200 pt-2 flex justify-between">
                          <span className="font-semibold text-gray-900">{lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Итого' : 'Total'}</span>
                          <span className="text-2xl font-bold text-sky-600">{calculateBookingPrice().toLocaleString()} AMD</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(3)}
                        className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                      >
                        ← {lang === 'hy' ? 'Delays' : lang === 'ru' ? 'Назад' : 'Back'}
                      </button>
                      <button
                        onClick={handleSubmitBooking}
                        disabled={!bookingData.fullName || !bookingData.phone || !bookingData.address}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Подтвердить заказ' : 'Confirm Booking'} ✓
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.contact.title}</h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">📞</div>
                <div className="min-w-0">
                  <p className="text-sky-100 text-xs sm:text-sm">{lang === 'hy' ? 'Delays delays delays' : lang === 'ru' ? 'Звоните нам' : 'Call us directly'}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all">{t.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">👤</div>
                <div>
                  <p className="text-sky-100 text-[10px] sm:text-xs">{lang === 'hy' ? 'Delays delays' : lang === 'ru' ? 'Контактное лицо' : 'Contact Person'}</p>
                  <p className="font-semibold text-base sm:text-lg">{t.contact.contactPerson}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm mt-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">📍</span>
                  <span className="text-sm sm:text-base text-gray-700">Yerevan, Armenia</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">🕐</span>
                  <span className="text-sm sm:text-base text-gray-700">Mon - Sat: 8:00 - 20:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">💬</span>
                  <span className="text-sm sm:text-base text-gray-700">WhatsApp / Telegram</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm">✨</span>
              </div>
              <span className="font-bold text-sm sm:text-base">Shine Cleaning</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 text-center">{t.footer.rights}</p>
            <div className="flex gap-3 sm:gap-4 items-center">
              <a href="tel:+37477442554" className="text-gray-400 hover:text-sky-400 transition-colors text-xs sm:text-sm">📞 +374 77 442554</a>
              <a href="#admin" className="text-gray-400 hover:text-sky-400 transition-colors text-xs sm:text-sm">Staff Portal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
