import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  ShoppingBag, 
  MapPin, 
  Search, 
  Phone, 
  Menu, 
  X, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Sparkles,
  User,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  LogIn,
  Zap,
  BatteryCharging,
  Database
} from 'lucide-react';
import { STORE_LOCATIONS, ASSET_IMAGES } from '../data/mockData';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    cartCount, 
    cartSubtotal, 
    setIsCartDrawerOpen, 
    startRepairBooking,
    setShopBrandFilter,
    setShopConditionFilter,
    setTrackingQuery,
    showNotification,
    setShowWpSyncModal,
    wpSyncStatus
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileRepairOpen, setMobileRepairOpen] = useState(false);
  const [mobilePhonesOpen, setMobilePhonesOpen] = useState(false);
  const [mobileLaptopsOpen, setMobileLaptopsOpen] = useState(false);
  const [mobileAccessoriesOpen, setMobileAccessoriesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [repairDropdownOpen, setRepairDropdownOpen] = useState(false);
  const [mobilePhonesMegaOpen, setMobilePhonesMegaOpen] = useState(false);
  const [laptopsDropdownOpen, setLaptopsDropdownOpen] = useState(false);
  const [accessoriesDropdownOpen, setAccessoriesDropdownOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // External buyback redirection URL
  const SELL_OLD_PHONE_URL = 'https://sell.irepair-mobiles.co.uk';

  // Customer Login Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTab, setLoginTab] = useState<'signin' | 'track'>('signin');
  const [quickTrackTicket, setQuickTrackTicket] = useState('');

  const navigateTo = (page: any) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setRepairDropdownOpen(false);
    setMobilePhonesMegaOpen(false);
    setLaptopsDropdownOpen(false);
    setAccessoriesDropdownOpen(false);
  };

  const handleSelectBrand = (brand: string) => {
    setShopBrandFilter(brand);
    setShopConditionFilter('all');
    navigateTo('shop');
  };

  const handleSelectCondition = (condition: string) => {
    setShopConditionFilter(condition);
    setShopBrandFilter('all');
    navigateTo('shop');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    showNotification(`Welcome back! Logged in as ${loginEmail}`, 'success');
    setLoginModalOpen(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackTicket.trim()) {
      showNotification('Please enter your repair reference number', 'error');
      return;
    }
    setTrackingQuery(quickTrackTicket.trim());
    setLoginModalOpen(false);
    navigateTo('track-repair');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Social Icons on Left Side */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-slate-300">
            <span className="text-[11px] font-medium text-slate-400 hidden lg:inline mr-1">Follow Us:</span>
            
            {/* WhatsApp */}
            <a 
              href="https://whatsapp.com/channel/0029VbBT1RAJJhzeRGdRDI1D" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp Channel"
              className="p-1 rounded text-slate-400 hover:text-[#25D366] hover:bg-slate-800 transition-colors"
              title="Join our WhatsApp Channel"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>

            {/* Threads */}
            <a 
              href="https://www.threads.net/@irepair.mobiles.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Threads Profile"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Threads @irepair.mobiles.uk"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.186 24C5.46 24 0 18.544 0 11.824 0 5.105 5.46 0 12.186 0c6.643 0 11.99 5.253 12.062 11.899v.57h-3.655c-.179-4.63-4.004-8.326-8.407-8.326-4.672 0-8.483 3.811-8.483 8.483s3.811 8.483 8.483 8.483c3.085 0 5.908-1.688 7.37-4.406l3.195 1.777C20.672 22.02 16.634 24 12.186 24zm-.008-16.732c-2.483 0-4.502 2.019-4.502 4.502 0 2.483 2.019 4.502 4.502 4.502 1.782 0 3.32-.98 4.093-2.428l-3.136-1.745c-.244.475-.724.786-1.28.786-.799 0-1.447-.648-1.447-1.447s.648-1.447 1.447-1.447c.56 0 1.042.316 1.285.798l3.136-1.746a4.506 4.506 0 00-4.098-2.475z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/irepair.mobiles.uk/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="p-1 rounded text-slate-400 hover:text-[#E4405F] hover:bg-slate-800 transition-colors"
              title="Instagram @irepair.mobiles.uk"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* X / Twitter */}
            <a 
              href="https://x.com/irepair_iVape?t=-GHD_k1aeWcAcTnDJIX5YQ&s=09" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="X Twitter Profile"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="X @irepair_iVape"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/irepairmobiles.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook Page"
              className="p-1 rounded text-slate-400 hover:text-[#1877F2] hover:bg-slate-800 transition-colors"
              title="Facebook @irepairmobiles.uk"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {/* Middle: Fast Hotline & Trust */}
          <div className="hidden md:flex items-center gap-3 text-[11px]">
            <a 
              href="tel:+447717103365" 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#DF0C88]" />
              <span>Express Repairs Hotline: <strong className="text-white">+44 771 7103 365</strong></span>
            </a>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400">30-Min Walk-in · 6-Month Warranty</span>
          </div>

          {/* Right Side: User Icon & WP Sync */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWpSyncModal(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer group"
              title="WordPress & Yoast SEO Live Catalog"
            >
              <Database className="w-3 h-3 text-[#DF0C88]" />
              <span className="font-medium hidden sm:inline">WP Sync</span>
              {wpSyncStatus.status === 'success' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Synchronized"></span>
              )}
            </button>

            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white hover:bg-slate-800 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer group"
              title="Customer Login / Account"
            >
              <div className="w-4 h-4 rounded-full bg-slate-800 group-hover:bg-[#DF0C88] flex items-center justify-center transition-colors">
                <User className="w-2.5 h-2.5 text-slate-200 group-hover:text-white" />
              </div>
              <span className="font-medium">Login / Account</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 flex-nowrap gap-2 xl:gap-4">
          
          {/* Brand Logo Zone (Clicking navigates to Home) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => navigateTo('home')} 
              className="group flex items-center gap-2 text-left focus:outline-none cursor-pointer"
              aria-label="iRepair Mobiles Home"
            >
              <img 
                src={ASSET_IMAGES.logo} 
                alt="iRepair Mobiles" 
                className="h-8 sm:h-9 xl:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </button>
          </div>

          {/* Desktop Navigation Links (Clean 5 Core Categories with No Text Wrapping - About & Contact in Footer) */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 text-xs xl:text-sm font-semibold text-slate-800 whitespace-nowrap shrink-0">
            
            {/* 1. Mobile Repair ▼ */}
            <div 
              className="relative"
              onMouseEnter={() => setRepairDropdownOpen(true)}
              onMouseLeave={() => setRepairDropdownOpen(false)}
            >
              <button 
                onClick={() => navigateTo('services')}
                className={`flex items-center gap-1 hover:text-[#DF0C88] transition-colors py-2 px-1 text-sm font-semibold cursor-pointer whitespace-nowrap ${
                  currentPage === 'services' ? 'text-[#DF0C88]' : ''
                }`}
              >
                <span>Mobile Repair</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#DF0C88]" />
              </button>

              {repairDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Express Phone Services
                  </div>
                  
                  <button 
                    onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'screen' }); setRepairDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-[#DF0C88] shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Screen Replacement</div>
                      <div className="text-[11px] text-slate-500">From £49 · Ready in 30 Mins</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'battery' }); setRepairDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 text-emerald-600 font-mono font-bold text-xs flex items-center justify-center shrink-0">🔋</div>
                    <div>
                      <div className="font-bold text-slate-900">Battery Replacement</div>
                      <div className="text-[11px] text-slate-500">From £35 · Certified High-Capacity</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'water-damage' }); setRepairDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 text-cyan-600 font-mono font-bold text-xs flex items-center justify-center shrink-0">💧</div>
                    <div>
                      <div className="font-bold text-slate-900">Water Damage Ultrasonic</div>
                      <div className="text-[11px] text-slate-500">Chemical PCB Decontamination</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'charging' }); setRepairDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <div className="w-4 h-4 text-amber-500 font-mono font-bold text-xs flex items-center justify-center shrink-0">⚡</div>
                    <div>
                      <div className="font-bold text-slate-900">Charging Port &amp; Audio</div>
                      <div className="text-[11px] text-slate-500">Rapid micro-soldering &amp; clean</div>
                    </div>
                  </button>

                  <div className="mt-1 pt-1.5 border-t border-slate-100">
                    <button 
                      onClick={() => navigateTo('services')}
                      className="w-full px-3 py-2 text-xs font-bold text-center text-[#DF0C88] hover:text-[#C50875] transition-colors cursor-pointer"
                    >
                      View All Mobile Repair Services →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="text-[#DF0C88] font-bold text-sm select-none opacity-85">|</span>

            {/* 2. Laptop Repair */}
            <button 
              onClick={() => { startRepairBooking({ category: 'laptop' }); }}
              className="hover:text-[#DF0C88] transition-colors py-2 px-1 text-sm font-semibold cursor-pointer whitespace-nowrap"
            >
              <span>Laptop Repair</span>
            </button>

            {/* Divider */}
            <span className="text-[#DF0C88] font-bold text-sm select-none opacity-85">|</span>

            {/* 3. Mobile Phones ▼ */}
            <div 
              className="relative"
              onMouseEnter={() => setMobilePhonesMegaOpen(true)}
              onMouseLeave={() => setMobilePhonesMegaOpen(false)}
            >
              <button 
                onClick={() => navigateTo('shop')}
                className={`flex items-center gap-1 hover:text-[#DF0C88] transition-colors py-2 px-1 text-sm font-semibold cursor-pointer whitespace-nowrap ${
                  currentPage === 'shop' || currentPage === 'product-detail' ? 'text-[#DF0C88]' : ''
                }`}
              >
                <span>Mobile Phones</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#DF0C88]" />
              </button>

              {mobilePhonesMegaOpen && (
                <div className="absolute top-full left-0 w-[530px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-2 gap-6">
                    
                    {/* Column 1: By Brand */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DF0C88] border-b border-slate-100 pb-2">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>By Brand</span>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <button 
                          onClick={() => handleSelectBrand('apple')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Apple iPhone</div>
                            <div className="text-[11px] text-slate-500">iPhone 15, 14, 13, 12, 11</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#DF0C88] transition-transform group-hover:translate-x-0.5" />
                        </button>

                        <button 
                          onClick={() => handleSelectBrand('samsung')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Samsung Galaxy</div>
                            <div className="text-[11px] text-slate-500">S24 Ultra, S23, S22, A-Series</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#DF0C88] transition-transform group-hover:translate-x-0.5" />
                        </button>

                        <button 
                          onClick={() => handleSelectBrand('google')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Google Pixel</div>
                            <div className="text-[11px] text-slate-500">Pixel 8 Pro, 8, 7a, 6</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#DF0C88] transition-transform group-hover:translate-x-0.5" />
                        </button>

                        <button 
                          onClick={() => handleSelectBrand('all')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">All Mobile Phone Brands</div>
                            <div className="text-[11px] text-slate-500">Motorola, Xiaomi, OnePlus</div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#DF0C88]" />
                        </button>
                      </div>
                    </div>

                    {/* Column 2: By Condition */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 border-b border-slate-100 pb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>By Condition</span>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <button 
                          onClick={() => handleSelectCondition('refurbished')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Grade A+ Pristine</div>
                            <div className="text-[11px] text-slate-500">100% battery, flawless condition</div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Like New</span>
                        </button>

                        <button 
                          onClick={() => handleSelectCondition('refurbished')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Grade A Excellent</div>
                            <div className="text-[11px] text-slate-500">Clean screen, 12-Month Guarantee</div>
                          </div>
                          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">Popular</span>
                        </button>

                        <button 
                          onClick={() => handleSelectCondition('refurbished')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Grade B Good Value</div>
                            <div className="text-[11px] text-slate-500">Fully tested, maximum £ savings</div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Best Price</span>
                        </button>

                        <button 
                          onClick={() => handleSelectCondition('new')}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-[#DF0C88] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#DF0C88]">Brand New In Box</div>
                            <div className="text-[11px] text-slate-500">Factory sealed with warranty</div>
                          </div>
                          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Sealed</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Free Next-Day UK Delivery · 12-Mo Warranty
                    </span>
                    <button 
                      onClick={() => navigateTo('shop')}
                      className="text-[#DF0C88] font-bold hover:text-[#C50875] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Mobile Phones</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="text-[#DF0C88] font-bold text-sm select-none opacity-85">|</span>

            {/* 4. Laptops ▼ */}
            <div 
              className="relative"
              onMouseEnter={() => setLaptopsDropdownOpen(true)}
              onMouseLeave={() => setLaptopsDropdownOpen(false)}
            >
              <button 
                onClick={() => { setShopBrandFilter('apple'); navigateTo('shop'); }}
                className="flex items-center gap-1 hover:text-[#DF0C88] transition-colors py-2 px-1 text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                <span>Laptops</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#DF0C88]" />
              </button>

              {laptopsDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Refurbished Laptops &amp; MacBooks
                  </div>
                  <button 
                    onClick={() => { setShopBrandFilter('apple'); navigateTo('shop'); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Apple MacBook Air &amp; Pro</div>
                      <div className="text-[11px] text-slate-500">M1, M2, M3 Chips from £549</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => { setShopBrandFilter('all'); navigateTo('shop'); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <Laptop className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Windows Business Laptops</div>
                      <div className="text-[11px] text-slate-500">Dell XPS, HP Spectre, Lenovo</div>
                    </div>
                  </button>
                  <div className="mt-1 pt-1.5 border-t border-slate-100">
                    <button 
                      onClick={() => navigateTo('shop')}
                      className="w-full px-3 py-2 text-xs font-bold text-center text-[#DF0C88] hover:text-[#C50875] transition-colors cursor-pointer"
                    >
                      Browse All Laptops with 12M Warranty →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="text-[#DF0C88] font-bold text-sm select-none opacity-85">|</span>

            {/* 5. Accessories ▼ */}
            <div 
              className="relative"
              onMouseEnter={() => setAccessoriesDropdownOpen(true)}
              onMouseLeave={() => setAccessoriesDropdownOpen(false)}
            >
              <button 
                onClick={() => navigateTo('shop')}
                className="flex items-center gap-1 hover:text-[#DF0C88] transition-colors py-2 px-1 text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                <span>Accessories</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#DF0C88]" />
              </button>

              {accessoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Tech Essentials &amp; Protection
                  </div>
                  <button 
                    onClick={() => navigateTo('shop')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">20W PD Fast Chargers</div>
                      <div className="text-[11px] text-slate-500">MFi Braided Cables &amp; Plugs</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigateTo('shop')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">9H Tempered Glass Protectors</div>
                      <div className="text-[11px] text-slate-500">Diamond Shatterproof (2-Pack)</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigateTo('shop')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 rounded-xl hover:bg-pink-50 hover:text-[#DF0C88] text-left transition-colors cursor-pointer"
                  >
                    <BatteryCharging className="w-4 h-4 text-pink-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">MagSafe Magnetic Power Banks</div>
                      <div className="text-[11px] text-slate-500">10,000mAh with Folding Kickstand</div>
                    </div>
                  </button>
                  <div className="mt-1 pt-1.5 border-t border-slate-100">
                    <button 
                      onClick={() => navigateTo('shop')}
                      className="w-full px-3 py-2 text-xs font-bold text-center text-[#DF0C88] hover:text-[#C50875] transition-colors cursor-pointer"
                    >
                      View All Phone Accessories →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Zone: Search, Cart, Sell Old Phone Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 xl:gap-3 shrink-0">
            
            {/* Search Trigger */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 hover:text-[#DF0C88] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
              title="Search website"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button 
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-slate-700 hover:text-[#DF0C88] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none flex items-center gap-1.5 cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DF0C88] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
              <span className="hidden sm:inline-block text-xs font-bold tabular-nums text-slate-800">
                £{cartSubtotal.toFixed(2)}
              </span>
            </button>

            {/* Primary Action Button: Sell Old Phone (Redirects to external website) */}
            <a 
              href={SELL_OLD_PHONE_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#DF0C88] hover:bg-[#C50875] text-white text-xs xl:text-sm font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Sell old phone</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Global Search Bar (Collapsible) */}
      {searchOpen && (
        <div className="bg-slate-50 border-t border-b border-slate-200 py-3 px-4 animate-in fade-in duration-150">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repairs (e.g. iPhone 14 screen, battery), mobile phones..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigateTo('shop');
                    setSearchOpen(false);
                  }
                }}
              />
            </div>
            <button 
              onClick={() => {
                navigateTo('shop');
                setSearchOpen(false);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Search
            </button>
            <button 
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-50 bg-white border-t border-slate-200 overflow-y-auto p-5 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-3 text-sm font-semibold">
            
            {/* Quick Mobile Action CTA */}
            <button 
              onClick={() => { startRepairBooking(); setMobileMenuOpen(false); }}
              className="text-left py-2.5 px-3.5 rounded-xl bg-[#DF0C88] text-white font-bold flex items-center justify-between shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>Book a Repair Now</span>
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Repair Mobile Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setMobileRepairOpen(!mobileRepairOpen)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
              >
                <span className="font-bold">Repair Mobile</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileRepairOpen ? 'rotate-180 text-[#DF0C88]' : 'text-slate-400'}`} />
              </button>
              {mobileRepairOpen && (
                <div className="pl-4 pr-2 py-1 space-y-2 text-xs text-slate-600">
                  <button onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'screen' }); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88] flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#DF0C88]" />
                    <span>Screen Replacement (30 Mins)</span>
                  </button>
                  <button onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'battery' }); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88] flex items-center gap-2">
                    <span className="text-emerald-500">🔋</span>
                    <span>Battery Replacement</span>
                  </button>
                  <button onClick={() => { startRepairBooking({ category: 'smartphone', issue: 'water-damage' }); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88] flex items-center gap-2">
                    <span className="text-cyan-500">💧</span>
                    <span>Water Damage Ultrasonic</span>
                  </button>
                  <button onClick={() => navigateTo('services')} className="w-full text-left py-1 text-[#DF0C88] font-bold">
                    View All Mobile Repair Services →
                  </button>
                </div>
              )}
            </div>

            {/* Laptop repair */}
            <button 
              onClick={() => { startRepairBooking({ category: 'laptop' }); setMobileMenuOpen(false); }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 border-b border-slate-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-600" />
                <span>Laptop repair</span>
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Diagnostic</span>
            </button>

            {/* Mobile Phones Mega Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setMobilePhonesOpen(!mobilePhonesOpen)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
              >
                <span className="font-bold">Mobile Phones</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobilePhonesOpen ? 'rotate-180 text-[#DF0C88]' : 'text-slate-400'}`} />
              </button>
              {mobilePhonesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-[#DF0C88] uppercase tracking-wider text-[10px] pt-1">By Brand:</div>
                  <button onClick={() => { handleSelectBrand('apple'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">Apple iPhones</button>
                  <button onClick={() => { handleSelectBrand('samsung'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">Samsung Galaxy</button>
                  <button onClick={() => { handleSelectBrand('google'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">Google Pixel</button>
                  <div className="font-bold text-emerald-600 uppercase tracking-wider text-[10px] pt-2">By Condition:</div>
                  <button onClick={() => { handleSelectCondition('refurbished'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">Grade A+ Pristine (100% Battery)</button>
                  <button onClick={() => { handleSelectCondition('refurbished'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">Grade A Excellent (1-Yr Guarantee)</button>
                  <button onClick={() => { handleSelectCondition('new'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">Brand New Sealed</button>
                </div>
              )}
            </div>

            {/* 4. Laptops Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setMobileLaptopsOpen(!mobileLaptopsOpen)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
              >
                <span className="font-bold flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <span>Laptops</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLaptopsOpen ? 'rotate-180 text-[#DF0C88]' : 'text-slate-400'}`} />
              </button>
              {mobileLaptopsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-2 text-xs text-slate-600">
                  <button onClick={() => { setShopBrandFilter('apple'); navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    Apple MacBook Air &amp; Pro (M1, M2, M3)
                  </button>
                  <button onClick={() => { setShopBrandFilter('all'); navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    Windows Business Laptops (Dell, HP, Lenovo)
                  </button>
                  <button onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 text-[#DF0C88] font-bold">
                    Browse All Certified Laptops →
                  </button>
                </div>
              )}
            </div>

            {/* 5. Accessories Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setMobileAccessoriesOpen(!mobileAccessoriesOpen)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
              >
                <span className="font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Accessories</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccessoriesOpen ? 'rotate-180 text-[#DF0C88]' : 'text-slate-400'}`} />
              </button>
              {mobileAccessoriesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-2 text-xs text-slate-600">
                  <button onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    20W PD Fast Chargers &amp; Cables
                  </button>
                  <button onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    9H Diamond Tempered Glass Protectors
                  </button>
                  <button onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    MagSafe 10,000mAh Magnetic Power Banks
                  </button>
                  <button onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }} className="w-full text-left py-1 text-[#DF0C88] font-bold">
                    View All Phone Accessories →
                  </button>
                </div>
              )}
            </div>

            {/* 6. About Us (Includes Store Locations Submenu) */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
              >
                <span className="font-bold">About Us</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180 text-[#DF0C88]' : 'text-slate-400'}`} />
              </button>
              {mobileAboutOpen && (
                <div className="pl-4 pr-2 py-1 space-y-2 text-xs text-slate-600">
                  <button onClick={() => navigateTo('locations')} className="w-full text-left py-1 hover:text-[#DF0C88] font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#DF0C88]" />
                    <span>Our 8 UK Store Locations</span>
                  </button>
                  <button onClick={() => navigateTo('about')} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    About iRepair Mobiles
                  </button>
                  <button onClick={() => navigateTo('policies')} className="w-full text-left py-1 hover:text-[#DF0C88]">
                    Warranty &amp; Policies
                  </button>
                </div>
              )}
            </div>

            {/* 7. Contact */}
            <button 
              onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-slate-50 text-slate-800 border-b border-slate-100 font-bold"
            >
              Contact Us &amp; Support
            </button>

            {/* Primary Action Button: Sell Old Phone (External Redirect) */}
            <div className="pt-2 pb-1">
              <a 
                href={SELL_OLD_PHONE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#DF0C88] hover:bg-[#C50875] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Sell old phone</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                  External
                </span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Customer Login / Account Trigger */}
            <button 
              onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
              className="text-left py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#DF0C88]" />
                <span>Customer Login / Account</span>
              </span>
              <span className="text-xs text-slate-400">Sign In</span>
            </button>

            {/* Mobile Contact Hotline & Socials */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <a 
                href="tel:+447717103365" 
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                <Phone className="w-4 h-4 text-[#DF0C88]" />
                <span>Call Hotline: +44 771 7103 365</span>
              </a>

              <div className="flex items-center justify-center gap-3 pt-1 text-slate-500">
                <a href="https://whatsapp.com/channel/0029VbBT1RAJJhzeRGdRDI1D" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-100 hover:text-[#25D366]">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <a href="https://www.threads.net/@irepair.mobiles.uk" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-100 hover:text-black">
                  <span className="sr-only">Threads</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.186 24C5.46 24 0 18.544 0 11.824 0 5.105 5.46 0 12.186 0c6.643 0 11.99 5.253 12.062 11.899v.57h-3.655c-.179-4.63-4.004-8.326-8.407-8.326-4.672 0-8.483 3.811-8.483 8.483s3.811 8.483 8.483 8.483c3.085 0 5.908-1.688 7.37-4.406l3.195 1.777C20.672 22.02 16.634 24 12.186 24zm-.008-16.732c-2.483 0-4.502 2.019-4.502 4.502 0 2.483 2.019 4.502 4.502 4.502 1.782 0 3.32-.98 4.093-2.428l-3.136-1.745c-.244.475-.724.786-1.28.786-.799 0-1.447-.648-1.447-1.447s.648-1.447 1.447-1.447c.56 0 1.042.316 1.285.798l3.136-1.746a4.506 4.506 0 00-4.098-2.475z"/></svg>
                </a>
                <a href="https://www.instagram.com/irepair.mobiles.uk/" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-100 hover:text-[#E4405F]">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://x.com/irepair_iVape?t=-GHD_k1aeWcAcTnDJIX5YQ&s=09" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-100 hover:text-black">
                  <span className="sr-only">X</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.facebook.com/irepairmobiles.uk" target="_blank" rel="noopener noreferrer" className="p-2 rounded bg-slate-100 hover:text-[#1877F2]">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. CUSTOMER LOGIN & ACCOUNT MODAL */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white relative">
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#DF0C88] flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300">Customer Portal</span>
              </div>
              
              <h3 className="text-xl font-bold text-white">
                {loginTab === 'signin' ? 'Sign In to Your Account' : 'Track Repair by Job ID'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {loginTab === 'signin' 
                  ? 'Access your repair history, warranties, and express booking profiles.' 
                  : 'Enter your ticket reference (e.g. IRM-78241) to check live technician status.'}
              </p>

              {/* Tabs */}
              <div className="flex rounded-xl bg-slate-800/80 p-1 mt-4 gap-1">
                <button
                  onClick={() => setLoginTab('signin')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    loginTab === 'signin' ? 'bg-[#DF0C88] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Customer Sign In
                </button>
                <button
                  onClick={() => setLoginTab('track')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    loginTab === 'track' ? 'bg-[#DF0C88] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quick Repair Track
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {loginTab === 'signin' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Password</label>
                      <button type="button" onClick={() => showNotification('Password reset link sent to your email', 'info')} className="text-[11px] text-[#DF0C88] hover:underline">
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88]"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-[#DF0C88] hover:bg-[#C50875] text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>

                  <div className="text-center pt-2 text-xs text-slate-500">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => {
                        showNotification('Guest checkout and instant booking are always enabled!', 'info');
                        setLoginModalOpen(false);
                      }} 
                      className="text-[#DF0C88] font-bold hover:underline"
                    >
                      Book as Guest
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleQuickTrackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Repair Job ID or Phone Number</label>
                    <input 
                      type="text"
                      value={quickTrackTicket}
                      onChange={(e) => setQuickTrackTicket(e.target.value)}
                      placeholder="e.g. IRM-78241 or 07717103365"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88]"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Found on your repair receipt or confirmation SMS.</p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 text-[#DF0C88]" />
                    <span>View Live Repair Tracker</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
