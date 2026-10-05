import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { STORE_LOCATIONS, ASSET_IMAGES } from '../data/mockData';

export const Footer: React.FC = () => {
  const { setCurrentPage, startRepairBooking, setShowWpSyncModal } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#DF0C88]/10 border border-[#DF0C88]/20 flex items-center justify-center shrink-0 text-[#DF0C88]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">30-Min Repairs</div>
              <div className="text-xs text-slate-400 mt-0.5">Most common screen & battery repairs completed while you wait.</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">6-Month Warranty</div>
              <div className="text-xs text-slate-400 mt-0.5">Comprehensive guarantee on all replacement parts & certified labour.</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">No Fix, No Fee</div>
              <div className="text-xs text-slate-400 mt-0.5">100% risk free. If we cannot restore your device, you pay £0.</div>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">15+ Years Trust</div>
              <div className="text-xs text-slate-400 mt-0.5">Over 50,000 satisfied customers across 8 high-street UK branches.</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        {/* Main Footer Links Columns (5 Clear Columns featuring About Us & Contact Us) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 py-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Corporate Info Column */}
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentPage('home')} 
              className="text-left focus:outline-none group inline-block"
              aria-label="iRepair Mobiles Home"
            >
              <img 
                src={ASSET_IMAGES.logoWhite} 
                alt="iRepair" 
                className="h-9 sm:h-10 w-auto object-contain transition-opacity group-hover:opacity-90" 
              />
            </button>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              iRepair Mobiles is a trading name of <strong className="text-slate-200">Phone Fresh UK Limited</strong> (Co. No. 03133908, inc. 2014). The UK's premier independent destination for rapid device hardware repairs &amp; certified refurbished tech.
            </p>

            {/* Official Social Channels */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Connect With Us</div>
              <div className="flex items-center gap-2 text-slate-400">
                <a 
                  href="https://whatsapp.com/channel/0029VbBT1RAJJhzeRGdRDI1D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="WhatsApp" 
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <a 
                  href="https://www.threads.net/@irepair.mobiles.uk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Threads" 
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.186 24C5.46 24 0 18.544 0 11.824 0 5.105 5.46 0 12.186 0c6.643 0 11.99 5.253 12.062 11.899v.57h-3.655c-.179-4.63-4.004-8.326-8.407-8.326-4.672 0-8.483 3.811-8.483 8.483s3.811 8.483 8.483 8.483c3.085 0 5.908-1.688 7.37-4.406l3.195 1.777C20.672 22.02 16.634 24 12.186 24zm-.008-16.732c-2.483 0-4.502 2.019-4.502 4.502 0 2.483 2.019 4.502 4.502 4.502 1.782 0 3.32-.98 4.093-2.428l-3.136-1.745c-.244.475-.724.786-1.28.786-.799 0-1.447-.648-1.447-1.447s.648-1.447 1.447-1.447c.56 0 1.042.316 1.285.798l3.136-1.746a4.506 4.506 0 00-4.098-2.475z"/></svg>
                </a>
                <a 
                  href="https://www.instagram.com/irepair.mobiles.uk/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram" 
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a 
                  href="https://x.com/irepair_iVape?t=-GHD_k1aeWcAcTnDJIX5YQ&s=09" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="X" 
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a 
                  href="https://www.facebook.com/irepairmobiles.uk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook" 
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: About Us Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              About Us
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className="hover:text-[#DF0C88] transition-colors text-left font-medium text-slate-200"
                >
                  About iRepair Mobiles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('locations')} 
                  className="hover:text-[#DF0C88] transition-colors text-left flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#DF0C88] shrink-0" />
                  <span>Our 8 UK Stores &amp; Hours</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  15+ Years Trust &amp; Story
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('warranty')} 
                  className="hover:text-[#DF0C88] transition-colors text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>6-Month Repair Warranty</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  70-Point Diagnostic Check
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('terms')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Company Policies &amp; Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Contact Us
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => setCurrentPage('contact')} 
                  className="hover:text-[#DF0C88] transition-colors text-left font-semibold text-slate-200 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#DF0C88]" />
                  <span>Contact Form &amp; Support</span>
                </button>
              </li>
              <li>
                <a 
                  href="tel:+447717103365" 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#DF0C88]" />
                  <span>+44 771 7103 365 (Hotline)</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@irepair-mobiles.co.uk" 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>info@irepair-mobiles.co.uk</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-[#DF0C88] shrink-0" />
                  <span>Mon-Sat: 09:00 - 18:00</span>
                </div>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('track-repair')} 
                  className="hover:text-[#DF0C88] transition-colors text-left flex items-center gap-1 text-emerald-400 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Track Existing Repair</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('locations')} 
                  className="text-[#DF0C88] font-semibold hover:underline flex items-center gap-1 pt-0.5"
                >
                  <span>Find Nearest Branch</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Repair Services Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Repair Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => startRepairBooking({ issue: 'screen' })} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Screen Replacement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startRepairBooking({ issue: 'battery' })} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Battery Replacement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startRepairBooking({ issue: 'water-damage' })} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Water Damage Clean
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startRepairBooking({ issue: 'charging-port' })} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Charging Port Fix
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startRepairBooking({ issue: 'back-glass' })} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Laser Back Glass Repair
                </button>
              </li>
              <li>
                <button 
                  onClick={() => startRepairBooking({ category: 'laptop' })} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  MacBook & Laptop Servicing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('services')} 
                  className="text-[#DF0C88] font-semibold hover:underline flex items-center gap-1 pt-1"
                >
                  <span>View All Services</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Tech & Refurbished */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Shop Tech Online
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button 
                  onClick={() => setCurrentPage('shop')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Refurbished iPhones (Grade A)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('shop')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Refurbished Samsung Galaxy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('shop')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Certified MacBooks & Laptops
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('shop')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  20W Fast Chargers & Cables
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('shop')} 
                  className="hover:text-[#DF0C88] transition-colors text-left"
                >
                  Shockproof Cases & 9H Glass
                </button>
              </li>
              <li>
                <a 
                  href="https://sell.irepair-mobiles.co.uk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DF0C88] transition-colors text-left flex items-center gap-1.5 text-pink-400 font-semibold"
                >
                  <span>Sell Old Phone (Instant Cash)</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('track-repair')} 
                  className="hover:text-[#DF0C88] transition-colors text-left flex items-center gap-1 text-emerald-400 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Track Existing Repair</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowWpSyncModal(true)} 
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 text-slate-400 text-[11px] pt-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>WordPress &amp; Yoast SEO Sync</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Store Locations Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Our UK Stores
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {STORE_LOCATIONS.slice(0, 6).map(store => (
                <li key={store.id}>
                  <button 
                    onClick={() => setCurrentPage('locations')} 
                    className="hover:text-[#DF0C88] transition-colors text-left flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-[#DF0C88] shrink-0" />
                    <span>{store.city} ({store.postcode})</span>
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => setCurrentPage('locations')} 
                  className="text-[#DF0C88] font-semibold hover:underline flex items-center gap-1 pt-1"
                >
                  <span>See All 8 Stores & Hours</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, WooCommerce note, Policies & Payments */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>© 2026 iRepair Mobiles (Phone Fresh UK Limited). All Rights Reserved.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Registered in England and Wales · Co. No. 03133908. VAT Registered.
            </p>
          </div>

          {/* Policy & Navigation Links */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setCurrentPage('about')} className="text-white hover:text-[#DF0C88] font-bold transition-colors">
              About Us
            </button>
            <span>·</span>
            <button onClick={() => setCurrentPage('contact')} className="text-white hover:text-[#DF0C88] font-bold transition-colors">
              Contact Us
            </button>
            <span>·</span>
            <button onClick={() => setCurrentPage('locations')} className="hover:text-white transition-colors">
              Store Locations
            </button>
            <span>·</span>
            <button onClick={() => setCurrentPage('terms')} className="hover:text-white transition-colors">
              Terms of Use
            </button>
            <span>·</span>
            <button onClick={() => setCurrentPage('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => setCurrentPage('warranty')} className="hover:text-white transition-colors">
              6-Month Warranty
            </button>
          </div>

          {/* Secure Payment Badges */}
          <div className="flex items-center gap-2 text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px]">
            <CreditCard className="w-3.5 h-3.5 text-[#DF0C88]" />
            <span>Visa · Mastercard · PayPal · Apple Pay · Klarna</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
