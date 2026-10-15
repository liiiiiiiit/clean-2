import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, User, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', service: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-100/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 rounded-full mb-4">
            <span className="w-2 h-2 bg-sky-500 rounded-full" />
            <span className="text-sm font-medium text-sky-700">Contact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.contact.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Phone Card */}
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-sky-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sky-100 text-sm font-medium">Call us directly</p>
                  <p className="text-2xl lg:text-3xl font-bold">{t.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sky-100 text-xs">Contact Person</p>
                  <p className="font-semibold text-lg">{t.contact.contactPerson}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-6">{t.contact.subtitle}</p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📍</span>
                  </div>
                  <span className="text-gray-700">Yerevan, Armenia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🕐</span>
                  </div>
                  <span className="text-gray-700">Mon - Sat: 8:00 - 20:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">💬</span>
                  </div>
                  <span className="text-gray-700">WhatsApp / Telegram available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.contact.form.success}</h3>
                <p className="text-gray-500">We will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 focus:bg-white outline-none transition-all"
                    placeholder={t.contact.form.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 focus:bg-white outline-none transition-all"
                    placeholder="+374 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.service}
                  </label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 focus:bg-white outline-none transition-all"
                  >
                    <option value="">{t.contact.form.service}</option>
                    <option value="office">{t.contact.selectOptions.office}</option>
                    <option value="home">{t.contact.selectOptions.home}</option>
                    <option value="commercial">{t.contact.selectOptions.commercial}</option>
                    <option value="deep">{t.contact.selectOptions.deep}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-sky-300 focus:border-sky-300 focus:bg-white outline-none transition-all resize-none"
                    placeholder={t.contact.form.message}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:from-sky-600 hover:to-blue-700 transition-all"
                >
                  <Send className="w-5 h-5" />
                  {t.contact.form.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
