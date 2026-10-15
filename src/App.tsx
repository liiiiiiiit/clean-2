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

  const t = translations[lang];

  // Handle hash-based routing for admin panel
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

  // Load dynamic data from localStorage
  useEffect(() => {
    const loadData = () => {
      const loadedServices = getServices();
      const loadedPricing = getPricing();
      const loadedSamples = getWorkSamples();
      
      setServices(loadedServices);
      
      // Convert pricing array to object
      const pricingObj: Record<string, number> = {};
      loadedPricing.forEach(p => {
        pricingObj[p.serviceKey] = p.ratePerSqm;
      });
      setPricingRates(pricingObj);
      
      setWorkSamples(loadedSamples);
    };

    loadData();
    
    // Listen for storage changes
    window.addEventListener('storage', loadData);
    
    // Also check periodically for changes from admin panel
    const interval = setInterval(loadData, 2000);
    
    return () => {
      window.removeEventListener('storage', loadData);
      clearInterval(interval);
    };
  }, []);

  const calculatedPrice = pricingRates[serviceType] ? pricingRates[serviceType] * area : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to localStorage
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

  const navItems = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.pricing, href: '#pricing' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hy', label: 'Հայerեն', flag: '🇦🇲' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  // Show admin panel if hash is #admin
  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', 'Noto Sans Armenian', sans-serif" }}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="#home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">✨</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Shine</span>
                <span className="text-[10px] font-medium text-gray-500 -mt-1 tracking-wider uppercase">Cleaning</span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-all">
                  {item.label}
                </a>
              ))}
              <a href="#admin" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-all">
                Admin Panel
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {languages.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code)} className={`px-2 py-1 text-xs rounded-lg transition-all ${lang === l.code ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <span className="mr-1">{l.flag}</span>
                    <span className="hidden sm:inline">{l.label}</span>
                  </button>
                ))}
              </div>

              <a href="#contact" className="hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all">
                {t.hero.cta}
              </a>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-600">
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-sky-600 rounded-lg hover:bg-sky-50">
                  {item.label}
                </a>
              ))}
              <a href="#admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-sky-600 rounded-lg hover:bg-sky-50">
                Admin Panel
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-sky-300/10 to-blue-400/10 rounded-full blur-3xl" />
        
        {/* Modern grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-6">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm font-medium text-yellow-700">{t.hero.tagline}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                {t.hero.headline}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                {t.hero.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <a href="#contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:from-sky-600 hover:to-blue-700 transition-all">
                  {t.hero.cta} →
                </a>
                <a href="#services" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-sky-300 hover:text-sky-600 transition-all">
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-sky-500">🛡️</span> Guaranteed
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-sky-500">🕐</span> Flexible
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-yellow-500">⭐</span> 5-Star Rated
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-8 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-gradient-to-br from-sky-200 to-blue-200 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-7xl mb-4">✨</div>
                      <div className="text-2xl font-bold text-sky-700">Shine</div>
                      <div className="text-sm text-sky-600">Professional Cleaning</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="text-xs font-medium text-gray-600">Office</div>
                </div>
                <div className="absolute bottom-16 left-0 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="text-xs font-medium text-gray-600">Home</div>
                </div>
                <div className="absolute top-1/2 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDuration: '3.5s' }}>
                  <div className="text-2xl mb-1">🧹</div>
                  <div className="text-xs font-medium text-gray-600">Deep</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.about.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.about.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.about.features.map((feature: { title: string; desc: string }, index: number) => {
              const icons = ['🛡️', '🌿', '📅', '⭐'];
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-200 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-5 text-2xl">
                    {icons[index]}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.services.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.services.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service) => (
              <div key={service.id} className={`bg-gradient-to-br ${service.color} rounded-3xl p-8 border border-white/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg text-3xl`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <a href="#contact" className="text-sm font-semibold text-sky-600 hover:text-sky-700">Book Now →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.pricing.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.pricing.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(pricingRates).map(([key, rate]) => (
                <div key={key} onClick={() => { setServiceType(key); setShowPrice(false); }} className={`rounded-2xl p-6 border cursor-pointer transition-all ${serviceType === key ? 'bg-sky-50 border-sky-300 shadow-lg' : 'bg-white border-gray-200 hover:border-sky-200'}`}>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{(t.pricing.services as any)[key]}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-sky-600">{rate}</span>
                    <span className="text-sm text-gray-500">{t.pricing.currency}/sq.m</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center text-white">🧮</div>
                <h3 className="text-xl font-bold text-gray-900">{t.pricing.calculate}</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.pricing.serviceType}</label>
                  <select value={serviceType} onChange={(e) => { setServiceType(e.target.value); setShowPrice(false); }} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none">
                    {Object.keys(pricingRates).map((key) => (
                      <option key={key} value={key}>{(t.pricing.services as any)[key]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.pricing.area}</label>
                  <input type="number" value={area} onChange={(e) => { setArea(Number(e.target.value)); setShowPrice(false); }} min={10} max={10000} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none" />
                  <input type="range" value={area} onChange={(e) => { setArea(Number(e.target.value)); setShowPrice(false); }} min={10} max={500} className="w-full mt-3 accent-sky-500" />
                </div>

                <button onClick={() => setShowPrice(true)} className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all">
                  {t.pricing.calculate}
                </button>

                {showPrice && (
                  <div className="bg-white rounded-2xl p-6 border border-sky-200">
                    <p className="text-sm text-gray-500 mb-1">{t.pricing.estimatedPrice}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-sky-600">{calculatedPrice.toLocaleString()}</span>
                      <span className="text-lg text-gray-500">{t.pricing.currency}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Samples Section */}
      {workSamples.length > 0 && (
        <section id="samples" className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-blue-50 rounded-full mb-4 border border-sky-100">
                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-sky-700">نمونه کارهای ما</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                نمونه کارهای ما
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                کیفیت خدمات نظافتی ما را از طریق پروژه‌های اخیر مشاهده کنید
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {workSamples.map((sample, index) => {
                const service = services.find(s => s.key === sample.serviceType);
                return (
                  <div 
                    key={sample.id} 
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-sky-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img 
                        src={sample.imageUrl} 
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f1f5f9"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="18" fill="%2394a3b8"%3Eتصویر موجود نیست%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Service Badge */}
                      {service && (
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-lg`}>
                            <span>{service.icon}</span>
                            <span className="text-gray-700">{service.title}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors">
                        {sample.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {sample.description}
                      </p>
                      
                      {/* Date */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(sample.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 group-hover:gap-2 transition-all">
                          مشاهده جزئیات
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{t.contact.title}</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">📞</div>
                  <div>
                    <p className="text-sky-100 text-sm">Call us directly</p>
                    <p className="text-2xl lg:text-3xl font-bold">{t.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">👤</div>
                  <div>
                    <p className="text-sky-100 text-xs">Contact Person</p>
                    <p className="font-semibold text-lg">{t.contact.contactPerson}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-gray-600 mb-6">{t.contact.subtitle}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><span>📍</span><span className="text-gray-700">Yerevan, Armenia</span></div>
                  <div className="flex items-center gap-3"><span>🕐</span><span className="text-gray-700">Mon - Sat: 8:00 - 20:00</span></div>
                  <div className="flex items-center gap-3"><span>💬</span><span className="text-gray-700">WhatsApp / Telegram</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.contact.form.success}</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.name}</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.phone}</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none" placeholder="+374 XX XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.form.service}</label>
                    <select required value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-300 outline-none">
                      <option value="">{t.contact.form.service}</option>
                      <option value="office">{t.contact.selectOptions.office}</option>
                      <option value="home">{t.contact.selectOptions.home}</option>
                      <option value="commercial">{t.contact.selectOptions.commercial}</option>
                      <option value="deep">{t.contact.selectOptions.deep}</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '⏳ Sending...' : t.contact.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <span className="font-bold">Shine Cleaning</span>
            </div>
            <p className="text-sm text-gray-400">{t.footer.rights}</p>
            <div className="flex gap-4 items-center">
              <a href="tel:+37477442554" className="text-gray-400 hover:text-sky-400 transition-colors">📞 +374 77 442554</a>
              <a href="#admin" className="text-gray-400 hover:text-sky-400 transition-colors text-sm">Staff Portal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
