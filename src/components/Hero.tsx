import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-blue-50" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url(https://image.qwenlm.ai/generated-images/7bb768fa-de87-4433-a49c-e1c6438b31ee/_result.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-sky-100/20 to-blue-100/20 rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #0369a1 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">{t.hero.tagline}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {t.hero.headline.split(' ').map((word: string, i: number) => (
                <span key={i}>
                  {word === 'Armenia' || word === 'Հայաստանում' || word === 'Армении' ? (
                    <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">{word}</span>
                  ) : (
                    word
                  )}{' '}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-sky-200 hover:shadow-sky-300 hover:from-sky-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5"
              >
                {t.hero.cta}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-2xl border-2 border-gray-200 hover:border-sky-300 hover:text-sky-600 transition-all"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-5 h-5 text-sky-500" />
                <span>100% Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-5 h-5 text-sky-500" />
                <span>Flexible Schedule</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>5-Star Rated</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main circle */}
              <div className="absolute inset-8 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gradient-to-br from-sky-200 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-7xl mb-4">✨</div>
                    <div className="text-2xl font-bold text-sky-700">Shine</div>
                    <div className="text-sm text-sky-600 font-medium">Professional Cleaning</div>
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="text-2xl mb-1">🏢</div>
                <div className="text-xs font-medium text-gray-600">Office</div>
              </div>
              <div className="absolute bottom-16 left-0 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="text-2xl mb-1">🏠</div>
                <div className="text-xs font-medium text-gray-600">Home</div>
              </div>
              <div className="absolute top-1/2 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '3.5s' }}>
                <div className="text-2xl mb-1">🧹</div>
                <div className="text-xs font-medium text-gray-600">Deep Clean</div>
              </div>
              <div className="absolute bottom-4 right-16 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '2.5s' }}>
                <div className="text-2xl mb-1">🏪</div>
                <div className="text-xs font-medium text-gray-600">Commercial</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
