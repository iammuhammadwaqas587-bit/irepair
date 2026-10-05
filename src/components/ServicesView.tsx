import React from 'react';
import { useApp } from '../context/AppContext';
import { REPAIR_ISSUES } from '../data/mockData';
import { 
  Wrench, 
  Smartphone, 
  BatteryCharging, 
  Zap, 
  Droplets, 
  ShieldCheck, 
  Camera, 
  Volume2, 
  Cpu, 
  Database, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { startRepairBooking } = useApp();

  const getIcon = (id: string) => {
    switch (id) {
      case 'screen': return Smartphone;
      case 'battery': return BatteryCharging;
      case 'charging-port': return Zap;
      case 'water-damage': return Droplets;
      case 'back-glass': return ShieldCheck;
      case 'camera': return Camera;
      case 'speaker-mic': return Volume2;
      case 'motherboard': return Cpu;
      case 'data-recovery': return Database;
      default: return Wrench;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      
      {/* Page Title & Intro Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#DF0C88] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#DF0C88]" />
          <span>Professional Tech Services Across 8 UK Outlets</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-heading">
          All Mobile & Laptop Repair Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          At iRepair Mobiles, our certified technicians handle everything from shattered iPhone glass and failing Samsung batteries to complex MacBook logic board micro-soldering and liquid damage recovery.
        </p>
      </div>

      {/* Services Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPAIR_ISSUES.map((service) => {
          const IconComponent = getIcon(service.id);
          return (
            <div 
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-pink-300 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center group-hover:bg-[#DF0C88] group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Starting from</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums">£{service.basePrice}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#DF0C88] transition-colors">
                  {service.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-1.5 pt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#DF0C88] shrink-0" />
                    <span>Average repair turnaround: <strong>{service.durationMinutes} minutes</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Warranty: <strong>6 Months Parts & Labour</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Policy: <strong>No Fix, No Fee Guarantee</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={() => startRepairBooking({ issue: service.id })}
                  className="w-full bg-slate-900 group-hover:bg-[#DF0C88] text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book This Repair Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Repair Standards Strip */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Our Quality Promise</span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Why UK Customers Trust iRepair Mobiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Over 15 years in operation as part of Phone Fresh UK Limited (Company No. 03133908). We don't take shortcuts or use cheap imitation copy parts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-800">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-heading">OEM Grade Precision</h4>
            <p className="text-xs text-slate-400">Displays maintain 120Hz refresh rates, true-tone functionality, and factory color gamut.</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-heading">Certified Cleanrooms</h4>
            <p className="text-xs text-slate-400">All logic board ultrasonic baths and micro-soldering conducted in ESD-safe clean environments.</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white font-heading">Data Privacy Guaranteed</h4>
            <p className="text-xs text-slate-400">Your photos, contacts, banking apps and sensitive personal data are never accessed or erased.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
