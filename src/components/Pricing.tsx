import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calculator, Info } from 'lucide-react';

const pricingData = {
  office: { base: 500, label: 'services.office' },
  home: { base: 400, label: 'services.home' },
  commercial: { base: 350, label: 'services.commercial' },
  deep: { base: 800, label: 'services.deep' },
};

export default function Pricing() {
  const { t } = useLanguage();
  const [serviceType, setServiceType] = useState<keyof typeof pricingData>('home');
  const [area, setArea] = useState<number>(50);
  const [showResult, setShowResult] = useState(false);

  const calculatePrice = () => {
    const base = pricingData[serviceType].base;
    return Math.round(base * area);
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-sky-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-4">
            <span className="w-2 h-2 bg-sky-500 rounded-full" />
            <span className="text-sm font-medium text-sky-700">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(pricingData).map(([key, data]) => (
              <div
                key={key}
                className={`relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                  serviceType === key
                    ? 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-300 shadow-lg shadow-sky-100'
                    : 'bg-white border-gray-200 hover:border-sky-200 hover:shadow-md'
                }`}
                onClick={() => { setServiceType(key as keyof typeof pricingData); setShowResult(false); }}
              >
                {serviceType === key && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-sky-500 rounded-full" />
                )}
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {(t.pricing.services as any)[key]}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-500">{t.pricing.from}</span>
                  <span className="text-2xl font-bold text-sky-600">{data.base}</span>
                  <span className="text-sm text-gray-500">{t.pricing.currency}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{t.pricing.perSqm}</p>
              </div>
            ))}
          </div>

          {/* Calculator */}
          <div className="bg-gradient-to-br from-gray-50 to-sky-50/30 rounded-3xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t.pricing.calculate}</h3>
            </div>

            <div className="space-y-5">
              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.pricing.serviceType}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => { setServiceType(e.target.value as keyof typeof pricingData); setShowResult(false); }}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all"
                >
                  {Object.entries(pricingData).map(([key]) => (
                    <option key={key} value={key}>
                      {(t.pricing.services as any)[key]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.pricing.area}
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => { setArea(Number(e.target.value)); setShowResult(false); }}
                  min={10}
                  max={10000}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all"
                />
                <input
                  type="range"
                  value={area}
                  onChange={(e) => { setArea(Number(e.target.value)); setShowResult(false); }}
                  min={10}
                  max={500}
                  className="w-full mt-3 accent-sky-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10 sq.m</span>
                  <span>500 sq.m</span>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:from-sky-600 hover:to-blue-700 transition-all"
              >
                {t.pricing.calculate}
              </button>

              {/* Result */}
              {showResult && (
                <div className="bg-white rounded-2xl p-6 border border-sky-200 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">{t.pricing.estimatedPrice}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                      {calculatePrice().toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 font-medium">{t.pricing.currency}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="flex items-start gap-2 mt-6 text-xs text-gray-500">
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>{t.pricing.note}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
