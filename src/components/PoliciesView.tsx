import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowLeft, Wrench } from 'lucide-react';

export const PoliciesView: React.FC<{ type: 'terms' | 'privacy' | 'warranty' }> = ({ type }) => {
  const { setCurrentPage, startRepairBooking } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <button 
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {type === 'warranty' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                iRepair Mobiles 6-Month Warranty Policy
              </h1>
              <p className="text-xs text-slate-500">
                Phone Fresh UK Limited · Verified Guarantee Terms
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed divide-y divide-slate-100">
            <div className="pt-2">
              <h3 className="font-bold text-slate-900 text-sm mb-1">1. Scope of Coverage</h3>
              <p>
                All replacement parts (screens, digitizers, batteries, charging ports, cameras, and micro-soldered components) fitted by iRepair Mobiles are protected by our comprehensive 6-Month Parts & Labour Guarantee from the date of collection or return delivery.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1">2. No Fix, No Fee Guarantee</h3>
              <p>
                If our technician determines upon physical bench inspection that a device cannot be economically restored to working operational order, no diagnostic fee or repair charge will be levied to the customer.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1">3. Exclusions</h3>
              <p>
                The warranty covers manufacturing faults and installation defects. It does not cover subsequent accidental drops, cracked glass after return, intentional mishandling, unauthorized third-party tampering, or subsequent submersion in liquid after repair.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1">4. Refurbished Tech 12-Month Hardware Guarantee</h3>
              <p>
                All refurbished smartphones and laptops purchased through our online shop come with an extended 12-Month Hardware Guarantee against battery defects and hardware component failures.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4">
            <button
              onClick={() => startRepairBooking()}
              className="bg-[#DF0C88] hover:bg-[#C50875] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
            >
              Book a Repair Now
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-slate-100 text-slate-800 px-5 py-2.5 rounded-xl text-xs font-semibold"
            >
              Submit a Warranty Enquiry
            </button>
          </div>
        </div>
      )}

      {type === 'terms' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Terms of Use & Service Agreement
          </h1>
          <p className="text-xs text-slate-500">Last updated: October 2026 · Phone Fresh UK Limited (Co. No. 03133908)</p>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Welcome to iRepair Mobiles (irepair-mobiles.co.uk). By booking a repair, buying devices or accessing our services across our 8 UK branches or website, you agree to be bound by these Terms of Service.
            </p>
            <h3 className="font-bold text-slate-900 text-sm">Customer Data Protection</h3>
            <p>
              While standard hardware repairs do not modify user storage, customers are advised to back up critical data where feasible. iRepair Mobiles is committed to GDPR compliance and never accesses or copies personal contents.
            </p>
            <h3 className="font-bold text-slate-900 text-sm">Mail-In Dispatch</h3>
            <p>
              Free return courier shipments are handled via Royal Mail Special Delivery with signature tracking. Devices are dispatched within 24 hours of successful quality control testing.
            </p>
          </div>
        </div>
      )}

      {type === 'privacy' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Phone Fresh UK Limited · UK GDPR Compliant</p>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Phone Fresh UK Limited takes your privacy seriously. We only collect contact details (name, email, phone number) necessary to update you regarding your repair job or fulfill order deliveries. We never sell or share user information with third-party advertisers.
            </p>
            <h3 className="font-bold text-slate-900 text-sm">Data Retention</h3>
            <p>
              Booking logs and invoice records are stored securely for tax accounting and warranty verification purposes for a period of up to 6 years in accordance with UK statutory laws.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
