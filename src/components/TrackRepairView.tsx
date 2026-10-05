import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Clock, 
  AlertCircle, 
  Phone, 
  ShieldCheck 
} from 'lucide-react';

export const TrackRepairView: React.FC = () => {
  const { bookings, trackingQuery, setTrackingQuery, showNotification, setCurrentPage } = useApp();
  const [inputQuery, setInputQuery] = useState(trackingQuery || 'IRM-78241');
  const [searchedId, setSearchedId] = useState(trackingQuery || 'IRM-78241');

  // Search logic
  const activeBooking = bookings.find(b => 
    b.id.toLowerCase() === searchedId.toLowerCase() ||
    b.customerPhone.includes(searchedId) ||
    b.customerEmail.toLowerCase() === searchedId.toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) {
      showNotification('Please enter a Job Reference Number (e.g. IRM-78241) or phone number', 'info');
      return;
    }
    setSearchedId(inputQuery.trim());
    setTrackingQuery(inputQuery.trim());
  };

  // Status mapping
  const steps = [
    { key: 'received', title: '1. Device Received', desc: 'Checked in at lab & logged into system' },
    { key: 'diagnosing', title: '2. Diagnostic Inspection', desc: 'Hardware testing & component assessment' },
    { key: 'in-progress', title: '3. Repair in Progress', desc: 'Precision parts installation & calibration' },
    { key: 'testing', title: '4. Quality Control Passed', desc: '70-point touchscreen, sensor & battery testing' },
    { key: 'ready', title: '5. Ready for Collection / Shipped', desc: 'Device ready or dispatched with Royal Mail' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'received': return 0;
      case 'diagnosing': return 1;
      case 'in-progress': return 2;
      case 'testing': return 3;
      case 'ready':
      case 'collected': return 4;
      default: return 0;
    }
  };

  const currentStepIndex = activeBooking ? getStepIndex(activeBooking.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live UK Repair Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-heading">
          Track Your Device Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Enter your unique Job Reference (e.g. <strong>IRM-78241</strong>), phone number, or email to see the real-time progress of your repair.
        </p>
      </div>

      {/* Tracker Lookup Form */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter Job Ref (e.g. IRM-78241) or Mobile Phone Number"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors shrink-0"
          >
            <span>Track Progress</span>
          </button>
        </form>

        {/* Quick Demo Pre-fill Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Quick Demo Samples:</span>
          {['IRM-78241', 'IRM-52910', 'IRM-10842'].map(demoId => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setInputQuery(demoId);
                setSearchedId(demoId);
                setTrackingQuery(demoId);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                searchedId === demoId 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {demoId}
            </button>
          ))}
        </div>
      </div>

      {/* Repair Tracking Results Card */}
      {activeBooking ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
          
          {/* Header of the Job */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  {activeBooking.category}
                </span>
                <span className="text-xs text-slate-400">Booked on {activeBooking.createdAt}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mt-1">
                {activeBooking.model}
              </h2>
              <div className="text-xs font-semibold text-slate-600 mt-0.5">
                Fault: <span className="text-[#DF0C88]">{activeBooking.issue}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Job Reference ID</span>
              <span className="text-xl font-mono font-bold text-slate-900">{activeBooking.id}</span>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="capitalize">{activeBooking.status.replace('-', ' ')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Progress Visual Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Progress Stages
            </h3>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={st.key} className="relative">
                    {/* Step Icon / Circle */}
                    <div 
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#DF0C88] text-white ring-4 ring-pink-100 scale-110'
                          : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? '✓' : idx + 1}
                    </div>

                    <div>
                      <div className={`text-sm font-bold ${isCurrent ? 'text-[#DF0C88]' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {st.title}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] bg-pink-100 text-[#DF0C88] px-2 py-0.5 rounded font-semibold uppercase">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Technician Notes Block */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Service Method:</span>
              <span className="font-semibold text-slate-800 capitalize">{activeBooking.method}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estimated Ready:</span>
              <span className="font-semibold text-slate-800">{activeBooking.estimatedCompletion}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Customer Name:</span>
              <span className="font-semibold text-slate-800">{activeBooking.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Repair Total:</span>
              <span className="font-bold text-[#DF0C88] tabular-nums text-sm">£{activeBooking.price.toFixed(2)}</span>
            </div>
            {activeBooking.notes && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400 block">Technician Diagnostic Notes:</span>
                <span className="text-slate-700 italic">{activeBooking.notes}</span>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Includes 6-Month iRepair UK Guarantee on all parts</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:+447717103365"
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#DF0C88]" />
                <span>Call Lab Support</span>
              </a>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-pink-50 text-[#DF0C88] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">
            No Repair Found for "{searchedId}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please double check your reference number format (e.g. <strong>IRM-78241</strong>) or telephone number.
          </p>
          <button
            onClick={() => setCurrentPage('book-repair')}
            className="px-5 py-2.5 bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold rounded-xl text-xs"
          >
            Book a New Repair Now
          </button>
        </div>
      )}

    </div>
  );
};
