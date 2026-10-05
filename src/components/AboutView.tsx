import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ASSET_IMAGES, 
  STORE_LOCATIONS 
} from '../data/mockData';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Recycle, 
  Wrench, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentPage, startRepairBooking } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      
      {/* Hero / Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#DF0C88] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#DF0C88]" />
            <span>Over 15 Years of British Tech Repair Heritage</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-heading leading-tight">
            About <span className="text-[#DF0C88]">iRepair Mobiles</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            iRepair Mobiles is a trusted trading brand of <strong className="text-slate-900">Phone Fresh UK Limited</strong>, incorporated on July 16, 2014 (Company Number 03133908). Over the past 15+ years, we have grown from a single dedicated workshop into one of the United Kingdom's most respected independent device repair and certified refurbished electronics networks.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div>
              <div className="text-xl sm:text-2xl font-semibold text-slate-900 font-heading">50,000+</div>
              <div className="text-xs text-slate-500">Devices Repaired</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-semibold text-slate-900 font-heading">8</div>
              <div className="text-xs text-slate-500">UK Store Branches</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-semibold text-slate-900 font-heading">4.9★</div>
              <div className="text-xs text-slate-500">TrustScore Rating</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-4/3 relative">
            <img 
              src={ASSET_IMAGES.heroTech} 
              alt="iRepair Mobiles specialist in clean lab"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">What Sets Us Apart</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Our Core Quality Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Speed Without Compromise</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We know how vital your smartphone and laptop are to daily work and family life. Over 90% of screen and battery replacements are completed on-site in 20 to 30 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">No Fix, No Fee Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If our technicians inspect your device and find it unfixable, you pay £0. We believe in upfront, transparent pricing with zero surprise diagnostic fees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Circular Tech Economy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              By repairing rather than replacing, our team prevents thousands of kilograms of toxic e-waste from entering UK landfills every year.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Registration & Authenticity Details */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-4">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Company Registration</span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Phone Fresh UK Limited
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Registered office: England & Wales · Company Number: <strong>03133908</strong> (Incorporated 16 July 2014).<br />
            Our retail footprint covers flagship high-street stores in Reading, Canterbury, Southend, Basingstoke, Eastbourne, Norwich, Ipswich, and Solihull.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentPage('locations')}
            className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Find a Branch Near You</span>
          </button>
          <button
            onClick={() => startRepairBooking()}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Book Repair Service</span>
          </button>
        </div>
      </div>

    </div>
  );
};
