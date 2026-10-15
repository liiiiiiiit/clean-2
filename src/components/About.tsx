import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Leaf, Calendar, Award } from 'lucide-react';

const iconMap = [ShieldCheck, Leaf, Calendar, Award];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-50 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-4">
            <span className="w-2 h-2 bg-sky-500 rounded-full" />
            <span className="text-sm font-medium text-sky-700">About Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.about.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.about.features.map((feature: { title: string; desc: string }, index: number) => {
            const Icon = iconMap[index];
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-sky-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl flex items-center justify-center mb-5 group-hover:from-sky-200 group-hover:to-blue-200 transition-colors">
                  <Icon className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
