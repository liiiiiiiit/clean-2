import { useLanguage } from '../context/LanguageContext';
import { Building2, Home, Store, SprayCan } from 'lucide-react';

const serviceIcons = [Building2, Home, Store, SprayCan];
const serviceColors = [
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
];
const serviceBgColors = [
  'from-sky-50 to-blue-50',
  'from-emerald-50 to-teal-50',
  'from-violet-50 to-purple-50',
  'from-amber-50 to-orange-50',
];

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { ...t.services.office, key: 'office' },
    { ...t.services.home, key: 'home' },
    { ...t.services.commercial, key: 'commercial' },
    { ...t.services.deep, key: 'deep' },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-sky-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-4">
            <span className="w-2 h-2 bg-sky-500 rounded-full" />
            <span className="text-sm font-medium text-sky-700">What We Do</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <div
                key={service.key}
                className={`group relative bg-gradient-to-br ${serviceBgColors[index]} rounded-3xl p-8 lg:p-10 border border-white/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${serviceColors[index]} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.desc}
                </p>

                {/* CTA */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 group-hover:gap-3 transition-all"
                >
                  Book Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
