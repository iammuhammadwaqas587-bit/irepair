import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STORE_LOCATIONS } from '../data/mockData';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showNotification } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('reading');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showNotification('Thank you! Your message has been sent to our customer service desk.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#DF0C88] text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>We're Here to Help</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-heading">
          Contact iRepair Mobiles
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Need a quick quote, have a question about a mail-in repair, or want to speak to a technician? Send us a message or call any of our retail branches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">National UK Hotline</div>
                  <a href="tel:+447717103365" className="text-[#DF0C88] font-semibold hover:underline block mt-0.5">
                    +44 771 7103 365
                  </a>
                  <div className="text-[11px] text-slate-500 mt-0.5">Reading Store: +44 7922 446999</div>
                  <div className="text-[11px] text-slate-500">Canterbury Store: +44 7516 982673</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Email Enquiries</div>
                  <a href="mailto:info@irepair-mobiles.co.uk" className="text-[#DF0C88] font-semibold hover:underline block mt-0.5">
                    info@irepair-mobiles.co.uk
                  </a>
                  <div className="text-[11px] text-slate-500 mt-0.5">Response within 2 hours during working hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Operating Hours</div>
                  <div className="text-slate-600 mt-0.5">Monday - Saturday: 09:00 - 18:00</div>
                  <div className="text-slate-600">Sunday: 10:30 - 16:30</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Flagship High Street Hub</div>
                  <div className="text-slate-600 mt-0.5">49 Broad Street, Reading, RG1 2AA</div>
                  <div className="text-[11px] text-slate-500">7 additional stores across the South & East</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 text-xs">
            <span className="font-bold text-[#DF0C88] uppercase tracking-wider text-[11px]">Emergency Repair</span>
            <h4 className="text-sm font-bold text-white font-heading">Smashed screen or water dropped today?</h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              No booking required for emergencies. Bring your phone directly to any iRepair branch for immediate bench evaluation.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Message Sent Successfully
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. An iRepair technician from our {branch} hub will get in touch with you shortly at <strong>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Davies"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 07700 900123"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex.davies@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nearest Store Branch</label>
                  <select 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  >
                    {STORE_LOCATIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  >
                    <option value="Repair Quote">Repair Quote Request</option>
                    <option value="Mail-In Query">Mail-in Status Inquiry</option>
                    <option value="Refurbished Shop">Refurbished Device Stock</option>
                    <option value="Warranty Claim">Warranty / Guarantee Inquiry</option>
                    <option value="Business Corporate">Corporate / Bulk Repair</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your device model, fault symptoms, or any question you have..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-bold py-3 px-8 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
