import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-500 text-white py-20 px-8 text-center">
        <div className="max-w-[800px] mx-auto">
          <span className="inline-block text-xs font-bold text-amber-100 uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">Get In Touch</span>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Contact Our Team</h1>
          <p className="text-lg opacity-90 leading-relaxed max-w-[600px] mx-auto">
            Have questions about registrations, payments, or the youth conference program? 
            We're here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            {/* Contact Information */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Reach Out Directly</h2>
                <p className="text-gray-600 leading-relaxed">Choose the most convenient way to connect with our team</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 transition-all hover:translate-x-2 hover:shadow-md hover:border-amber-400">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-sm text-gray-600 m-0">Main Church, Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 transition-all hover:translate-x-2 hover:shadow-md hover:border-amber-400">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-sm text-gray-600 m-0">support@kycregistration.org</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 transition-all hover:translate-x-2 hover:shadow-md hover:border-amber-400">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Telegram</h3>
                    <p className="text-sm text-gray-600 m-0">@KYC_Youth_2026</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 transition-all hover:translate-x-2 hover:shadow-md hover:border-amber-400">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-sm text-gray-600 m-0">+251 911 XX XX XX</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 rounded-xl shadow-lg shadow-amber-500/30">
                <div className="text-3xl">⏰</div>
                <div>
                  <h4 className="text-sm font-bold mb-1">Average Response Time</h4>
                  <p className="text-xs opacity-90 m-0">Within 24 hours on business days</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-10 shadow-xl">
              {submitted ? (
                <div className="text-center py-12 px-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-5xl font-bold mx-auto mb-6 shadow-lg shadow-green-500/30">✓</div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Message Sent!</h2>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Thank you for reaching out. Our team will review your message 
                    and get back to you within 24 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold text-base hover:bg-amber-600 transition-colors cursor-pointer border-none">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">Fill out the form below and we'll get back to you shortly</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-amber-50 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all font-inherit"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-amber-50 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all font-inherit"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                    <input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-amber-50 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all font-inherit"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl bg-amber-50 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100 transition-all font-inherit resize-y min-h-[120px]"
                    />
                  </div>

                  <button type="submit" className="w-full px-6 py-4 bg-amber-500 text-white rounded-xl font-semibold text-base hover:bg-amber-600 transition-colors cursor-pointer border-none inline-flex items-center justify-center gap-2">
                    Send Message
                    <span className="text-xl">→</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
