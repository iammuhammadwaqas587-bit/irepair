import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Smartphone, 
  Laptop, 
  BatteryCharging, 
  Droplets, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Star, 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag,
  Coins,
  ExternalLink,
  Shield,
  Layers,
  Award,
  Check,
  X,
  Tag,
  CreditCard,
  RefreshCw,
  Gift,
  SlidersHorizontal
} from 'lucide-react';
import { 
  ASSET_IMAGES, 
  REPAIR_ISSUES, 
  PRODUCTS, 
  STORE_LOCATIONS, 
  TESTIMONIALS, 
  BLOG_POSTS, 
  FAQS,
  
} from '../data/mockData';
import { DeviceCategory, Product } from '../types';

const SELL_OLD_PHONE_URL = 'https://sell.irepair-mobiles.co.uk';

export const HomeView: React.FC = () => {
  const { 
    setCurrentPage, 
    startRepairBooking, 
    addToCart, 
    viewProductDetail,
    setShopBrandFilter,
    setShopConditionFilter,
    setIsCartDrawerOpen,
    showNotification,
    products,
    categories,
    setShowWpSyncModal,
    wpSyncStatus
  } = useApp();

  // Hero Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const TOTAL_SLIDES = 4;

  // Auto-play slider with pause on hover
  useEffect(() => {
    if (isSliderPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    }, 6500);
    return () => clearInterval(interval);
  }, [isSliderPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  // Quick Hero Selector state (Slide 1)
  const [heroCategory, setHeroCategory] = useState<DeviceCategory>('smartphone');
  const [heroBrand, setHeroBrand] = useState('apple');
  const [heroIssue, setHeroIssue] = useState('screen');

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Shopping Section Interactive Filter State
  const [shoppingTab, setShoppingTab] = useState<'all' | 'apple' | 'samsung' | 'budget' | 'accessories'>('all');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startRepairBooking({
      category: heroCategory,
      brand: heroBrand,
      issue: heroIssue,
    });
  };

  // Filter products for the Shopping Showcase (Dynamically sourced from WordPress WooCommerce)
  const displayedProducts = products.filter((p) => {
    if (shoppingTab === 'all') return true;
    if (shoppingTab === 'apple') return p.brand?.toLowerCase() === 'apple' && (p.category === 'smartphones' || p.category.includes('phone'));
    if (shoppingTab === 'samsung') return p.brand?.toLowerCase() === 'samsung' && (p.category === 'smartphones' || p.category.includes('phone'));
    if (shoppingTab === 'budget') return p.price <= 300;
    if (shoppingTab === 'accessories') return p.category === 'accessories' || p.category === 'chargers' || p.category === 'audio' || p.category.includes('access');
    return true;
  });

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SLIDER SECTION (BACKGROUND IMAGE WITH LIGHT GRADIENT OVERLAY & SIDE NAVIGATION ARROWS) */}
      <section 
        className="relative overflow-hidden border-b border-slate-200/80 select-none bg-slate-50"
        onMouseEnter={() => setIsSliderPaused(true)}
        onMouseLeave={() => setIsSliderPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrow: Previous Slide */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-[#DF0C88] shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-[#DF0C88]"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Navigation Arrow: Next Slide */}
        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-[#DF0C88] shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-[#DF0C88]"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Slider Container with Full Background Image */}
        <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
          
          {/* SLIDE 0: FIND YOUR PERFECT CASE (REPLICA OF STORE INTERIOR BANNER) */}
          {currentSlide === 0 && (
            <div className="absolute inset-0 animate-in fade-in duration-500">
              {/* Background Image: Store interior with phone cases display */}
              <img 
                src={ASSET_IMAGES.storeCasesBanner} 
                alt="iRepair Mobiles store interior with phone cases and accessories" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center sm:object-right"
              />

              {/* Light Gradient Overlay (Fades from crisp white on the left to transparent on the right) */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% to-white/40 sm:to-transparent" />
              
              {/* Soft pink glow on top-left (matching screenshot) */}
              <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#DF0C88]/15 blur-[90px] pointer-events-none rounded-full" />

              {/* Slide Content Layer */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex items-center py-12 sm:py-16">
                <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#DF0C88] text-xs font-semibold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#DF0C88]" />
                    <span>New Arrivals In-Store & Online</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 font-heading leading-tight">
                    Find Your Perfect Case <br className="hidden sm:inline" />
                    <span className="text-slate-900">New Arrivals In-Store!</span>
                  </h1>

                  <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
                    Premium Protection &amp; Stylish Designs - Buy Now &amp; Get Discount!
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {/* Exact replica pill button from user's screenshot */}
                    <button
                      onClick={() => setCurrentPage('shop')}
                      className="bg-gradient-to-r from-[#800050] to-[#DF0C88] hover:from-[#6b0042] hover:to-[#C50875] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-900/20 text-sm inline-flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <span>Buy Now!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startRepairBooking()}
                      className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-6 py-3.5 rounded-full border border-slate-300 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <Wrench className="w-4 h-4 text-[#DF0C88]" />
                      <span>Need a Repair Instead?</span>
                    </button>
                  </div>

                  {/* Micro Trust Strip */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Shockproof 9H Protection
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#DF0C88]" />
                      MagSafe &amp; Wireless Compatible
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      In Stock at All 8 UK Stores
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: EXPRESS 30-MINUTE TECH REPAIRS */}
          {currentSlide === 1 && (
            <div className="absolute inset-0 animate-in fade-in duration-500">
              {/* Background Image: Lab technician */}
              <img 
                src={ASSET_IMAGES.heroTech} 
                alt="Certified repair technician in modern ESD tech lab" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center sm:object-right"
              />

              {/* Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-50% to-white/40 sm:to-transparent" />
              <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#DF0C88]/15 blur-[90px] pointer-events-none rounded-full" />

              {/* Slide Content Layer */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex items-center py-12 sm:py-16">
                <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#DF0C88] text-xs font-semibold shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-[#DF0C88]" />
                    <span>30-Minute Turnaround · Est. 2014</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 font-heading leading-tight">
                    Fast, Reliable <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF0C88] via-[#E82596] to-pink-600">Phone &amp; Laptop</span> Repairs
                  </h1>

                  <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
                    Cracked screen? Dead battery? Water damage? Certified technicians restore over 90% of smartphones and laptops in <strong>under 30 minutes</strong> with a full <strong>6-month warranty</strong>.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => startRepairBooking()}
                      className="bg-gradient-to-r from-[#800050] to-[#DF0C88] hover:from-[#6b0042] hover:to-[#C50875] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-900/20 text-sm inline-flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Book a Repair Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentPage('locations')}
                      className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-6 py-3.5 rounded-full border border-slate-300 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <MapPin className="w-4 h-4 text-[#DF0C88]" />
                      <span>Find 8 UK Store Locations</span>
                    </button>
                  </div>

                  {/* Micro Trust Strip */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#DF0C88]" />
                      30-Min Walk-in Fix
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      6-Month Full Guarantee
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-amber-500" />
                      No Fix, No Fee Policy
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: REFURBISHED TECH STORE */}
          {currentSlide === 2 && (
            <div className="absolute inset-0 animate-in fade-in duration-500">
              {/* Background Image: Refurbished phones */}
              <img 
                src={ASSET_IMAGES.shopPhones} 
                alt="Refurbished Apple iPhones and Samsung Galaxy phones" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center sm:object-right"
              />

              {/* Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-50% to-white/40 sm:to-transparent" />
              <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#DF0C88]/15 blur-[90px] pointer-events-none rounded-full" />

              {/* Slide Content Layer */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex items-center py-12 sm:py-16">
                <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Grade-A Hardware · 12-Month Guarantee</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 font-heading leading-tight">
                    Refurbished iPhones, <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF0C88] via-[#E82596] to-pink-600">Galaxy &amp; MacBooks</span>
                  </h1>

                  <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
                    Save up to <strong>40% off retail prices</strong>. Certified Grade-A hardware with <strong>70-point quality diagnostics</strong>, pristine glass, 100% battery health, and free next-day UK delivery.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentPage('shop')}
                      className="bg-gradient-to-r from-[#800050] to-[#DF0C88] hover:from-[#6b0042] hover:to-[#C50875] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-900/20 text-sm inline-flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Shop Refurbished Tech</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentPage('shop')}
                      className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-6 py-3.5 rounded-full border border-slate-300 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>iPhone 14 Pro from £529</span>
                    </button>
                  </div>

                  {/* Micro Trust Strip */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      12-Month Warranty
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#DF0C88]" />
                      Free Next-Day UK Delivery
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-amber-500" />
                      14-Day Free Returns
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: FREE POSTAL MAIL-IN REPAIRS */}
          {currentSlide === 3 && (
            <div className="absolute inset-0 animate-in fade-in duration-500">
              {/* Background Image: Precision Screen Replacement */}
              <img 
                src={ASSET_IMAGES.repairScreen} 
                alt="Screen replacement and precision micro tools" 
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center sm:object-right"
              />

              {/* Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-50% to-white/40 sm:to-transparent" />
              <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#DF0C88]/15 blur-[90px] pointer-events-none rounded-full" />

              {/* Slide Content Layer */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-full flex items-center py-12 sm:py-16">
                <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-5">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Nationwide Royal Mail Service</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950 font-heading leading-tight">
                    Free Tracked <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DF0C88] via-[#E82596] to-pink-600">Postal Mail-In</span> Repairs
                  </h1>

                  <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed max-w-lg">
                    Can't visit our stores? Book online and we'll instantly email you a <strong>prepaid Royal Mail tracked label</strong>. Repaired the same day upon arrival and dispatched back with signature tracking.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => startRepairBooking({ category: 'smartphone' })}
                      className="bg-gradient-to-r from-[#800050] to-[#DF0C88] hover:from-[#6b0042] hover:to-[#C50875] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-900/20 text-sm inline-flex items-center gap-2 active:scale-95 transition-all"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Start Free Mail-In Repair</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setCurrentPage('track-repair')}
                      className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-6 py-3.5 rounded-full border border-slate-300 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Track Existing Repair</span>
                    </button>
                  </div>

                  {/* Micro Trust Strip */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#DF0C88]" />
                      Royal Mail Special Delivery
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Same-Day Lab Turnaround
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      6-Month Warranty
                    </span>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Bar: Slide Pagination Dots & Category Pills */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 bg-white/70 backdrop-blur-xs">
          {/* Quick jump category pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { idx: 0, label: '01. Phone Cases & Accessories' },
              { idx: 1, label: '02. Express 30-Min Repairs' },
              { idx: 2, label: '03. Refurbished Tech Store' },
              { idx: 3, label: '04. Free Postal Mail-In' },
            ].map((tab) => (
              <button
                key={tab.idx}
                onClick={() => setCurrentSlide(tab.idx)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  currentSlide === tab.idx
                    ? 'bg-[#DF0C88] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dots Indicator & Slide Counter */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-500 font-semibold">
              0{currentSlide + 1} / 0{TOTAL_SLIDES}
            </span>
            <div className="flex items-center gap-1.5">
              {[...Array(TOTAL_SLIDES)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === i 
                      ? 'w-7 h-2 bg-[#DF0C88]' 
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* 2. TRUST VALUE PROPOSITIONS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200/80">
          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">30-Minute Turnaround</h3>
              <p className="text-xs text-slate-500 mt-0.5">Most screen, battery, and port repairs completed while you wait.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">6-Month Warranty</h3>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive guarantee on all OEM-grade parts and certified labor.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">No Fix, No Fee</h3>
              <p className="text-xs text-slate-500 mt-0.5">If our technicians cannot restore your device, you pay absolutely £0.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Free Return Delivery</h3>
              <p className="text-xs text-slate-500 mt-0.5">Prepaid Royal Mail shipping labels for convenient postal repairs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SELL OLD PHONES / BUYBACK OPTION SECTION (EXTERNAL REDIRECTION) */}
      <section id="buyback-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          
          {/* Subtle Pink Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DF0C88]/15 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/10 blur-3xl pointer-events-none rounded-full" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Coins className="w-3.5 h-3.5 text-[#DF0C88]" />
                <span>iRepair Buyback &amp; Trade-In Service</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white tracking-tight">
                Sell Your Old Phone for Instant Cash
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                iRepair offers top cash trade-in and buyback values for your old, cracked, or working mobile phones. Get an instant quote on our dedicated sell portal with guaranteed price match, fast bank transfer, or instant walk-in cash at any of our 8 UK branches.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                14-Day Price Lock
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Military GDPR Data Wipe
              </span>
            </div>
          </div>

          {/* Features & Redirection Content Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 7 Columns: Process steps */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-pink-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-[#DF0C88] flex items-center justify-center font-bold text-sm mb-3">
                  1
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Instant Online Valuation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Visit our dedicated sell portal to select your device model, capacity, and condition for a guaranteed real-time cash quote.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-pink-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-[#DF0C88] flex items-center justify-center font-bold text-sm mb-3">
                  2
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Free Insured Post or Store Drop</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send your phone free via prepaid Royal Mail 24 tracked pack, or walk into any of our 8 high-street UK branches.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-pink-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-[#DF0C88] flex items-center justify-center font-bold text-sm mb-3">
                  3
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Certified Data Erasure</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  100% GDPR-compliant sanitization wipe removes all personal data, photos, and accounts with complete privacy.
                </p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-pink-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                  4
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Same-Day Cash Payout</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Get paid cash in hand in 15 minutes at our stores, or same-day Faster Payments directly to your bank account.
                </p>
              </div>
            </div>

            {/* Right 5 Columns: Call To Action Card linking to external website */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-800/90 to-slate-850 border border-pink-500/30 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DF0C88] to-[#C50875] text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-900/40">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Ready to Sell Your Device?
                </h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Click below to visit our specialized sell site and get your instant valuation now.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a 
                  href={SELL_OLD_PHONE_URL}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#DF0C88] hover:bg-[#C50875] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-pink-900/40 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2.5 text-sm cursor-pointer group"
                >
                  <span>Sell Old Phone on our Portal</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span>Or drop by any of our</span>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('stores-preview');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#DF0C88] font-bold hover:underline cursor-pointer"
                  >
                    8 UK Store Locations
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  All Brands Accepted
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Working or Broken
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SHOPPING SECTION 1: SHOP BY BRAND & ECOSYSTEM QUICK TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Refurbished Tech Store</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-heading mt-1">
            Shop Mobile Phones by Brand
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All devices are Grade-A tested, 100% SIM-unlocked, supplied with a 12-month UK warranty and free next-day tracked delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Apple iPhone Card */}
          <div 
            onClick={() => {
              setShopBrandFilter('apple');
              setShopConditionFilter('all');
              setCurrentPage('shop');
            }}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#DF0C88] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🍎</span>
                <span className="text-[11px] font-bold text-[#DF0C88] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                  From £189
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#DF0C88] transition-colors">
                Apple iPhone
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                iPhone 15 Pro, 14, 13, 12, 11 series certified Grade A with pristine Super Retina OLED.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#DF0C88]">
              <span>Browse 24+ iPhones</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Samsung Galaxy Card */}
          <div 
            onClick={() => {
              setShopBrandFilter('samsung');
              setShopConditionFilter('all');
              setCurrentPage('shop');
            }}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#DF0C88] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📱</span>
                <span className="text-[11px] font-bold text-[#DF0C88] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                  From £179
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#DF0C88] transition-colors">
                Samsung Galaxy
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Galaxy S24 Ultra, S23, S22, and Z Flip series with 120Hz Dynamic AMOLED displays.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#DF0C88]">
              <span>Browse 18+ Galaxies</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Google Pixel Card */}
          <div 
            onClick={() => {
              setShopBrandFilter('google');
              setShopConditionFilter('all');
              setCurrentPage('shop');
            }}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#DF0C88] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🔷</span>
                <span className="text-[11px] font-bold text-[#DF0C88] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                  From £169
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#DF0C88] transition-colors">
                Google Pixel
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pixel 8 Pro, 8, 7a with pro AI computational photography and pure Android experience.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#DF0C88]">
              <span>Browse 12+ Pixels</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Essential Accessories Card */}
          <div 
            onClick={() => {
              setShopBrandFilter('all');
              setShopConditionFilter('all');
              setCurrentPage('shop');
            }}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#DF0C88] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">⚡</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  From £12.99
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#DF0C88] transition-colors">
                Tech Accessories
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                20W PD Fast Chargers, 9H Diamond Tempered Glass, MagSafe power banks and earbuds.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#DF0C88]">
              <span>View All Accessories</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOPPING SECTION 2: FEATURED PHONES & TRENDING DEALS (TABBED SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Popular In Store</span>
              <span className="text-[11px] bg-pink-100 text-[#DF0C88] font-bold px-2 py-0.5 rounded">
                12-Month UK Warranty
              </span>
              <button
                onClick={() => setShowWpSyncModal(true)}
                className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                title="Connect WordPress & WooCommerce Catalog"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>WP Catalog ({products.length})</span>
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-heading mt-1">
              Featured Refurbished Phones &amp; Hot Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Thoroughly tested through our 70-point diagnostic lab. Unlocked to all UK networks with clean IMEI and guaranteed battery health.
            </p>
          </div>

          <button 
            onClick={() => setCurrentPage('shop')}
            className="text-xs font-bold text-[#DF0C88] hover:text-[#C50875] flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>View All Store Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
          {[
            { id: 'all', label: 'All Refurbished Devices' },
            { id: 'apple', label: 'Apple iPhones' },
            { id: 'samsung', label: 'Samsung Galaxy' },
            { id: 'budget', label: 'Under £300 Budget Flagships' },
            { id: 'accessories', label: 'Essential Accessories' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setShoppingTab(tab.id as any)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                shoppingTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid (Displays up to 8 products) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.slice(0, 8).map((product) => {
            const isVariable = product.type === 'variable' || (product.variations && product.variations.length > 0);
            const displayPriceRange = product.priceRange || (product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice 
              ? `£${product.minPrice.toFixed(2)} – £${product.maxPrice.toFixed(2)}` 
              : `£${product.price.toFixed(2)}`);

            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => viewProductDetail(product)}
                >
                  <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {product.condition}
                    </div>
                    {isVariable ? (
                      <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Multiple Options
                      </div>
                    ) : product.regularPrice && (
                      <div className="absolute top-2.5 right-2.5 bg-[#DF0C88] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        Save £{(product.regularPrice - product.price).toFixed(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#DF0C88] uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        12M Warranty
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#DF0C88] transition-colors">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-700">{product.rating}</span>
                      <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                    </div>

                    {/* Highlights / Specs pill */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        SIM-Free Unlocked
                      </span>
                      <span>·</span>
                      <span>Battery 90%+</span>
                    </div>

                    <div className="pt-2 flex items-baseline gap-2 flex-wrap">
                      {isVariable ? (
                        <span className="text-base font-black text-slate-900 tabular-nums">
                          {displayPriceRange}
                        </span>
                      ) : (
                        <>
                          <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                            £{product.price.toFixed(2)}
                          </span>
                          {product.regularPrice && (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              £{product.regularPrice.toFixed(2)}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {isVariable ? (
                    <button 
                      onClick={() => viewProductDetail(product)}
                      className="w-full bg-[#DF0C88] hover:bg-[#C50875] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Select options</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        addToCart(product);
                        showNotification(`Added ${product.title} to cart!`, 'success');
                      }}
                      className="w-full bg-slate-900 hover:bg-[#DF0C88] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SHOPPING SECTION 3: THE iREPAIR CERTIFIED REFURBISHED STANDARD (ASSURANCE BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/90 rounded-3xl p-6 sm:p-10 border border-slate-200/90">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Our Promise</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-1">
              The iRepair Certified Refurbished Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every phone we sell is rigorously refurbished by certified technicians in the UK, ensuring unmatched reliability and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#DF0C88] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">
                70-Point Diagnostic Check
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                OLED touch accuracy, cameras, Face ID / Touch ID, speakers, and microphone calibrated by technicians.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">
                Battery Health Guarantee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guaranteed minimum 85% to 100% original capacity. Any degraded cells are replaced with high-capacity cells.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">
                12-Month Free Warranty
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comprehensive hardware protection. If any internal part fails, we fix or replace it free of charge.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">
                14-Day Money-Back Guarantee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Change your mind? Return your purchased device within 14 days in original condition for a no-hassle full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SHOPPING SECTION 4: MUST-HAVE MOBILE ACCESSORIES (1-CLICK QUICK ADD) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Essential Add-Ons</span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-1">
              Must-Have Accessories for Your Phone
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Power Delivery fast plugs, shatterproof diamond glass, and MagSafe wireless power banks in stock across all 8 stores.
            </p>
          </div>
          <button 
            onClick={() => {
              setShopBrandFilter('all');
              setCurrentPage('shop');
            }}
            className="text-xs font-bold text-[#DF0C88] hover:text-[#C50875] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All Accessories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(p => p.category === 'accessories' || p.category === 'chargers' || p.category === 'audio' || p.category.includes('access')).slice(0, 4).map((acc) => (
            <div 
              key={acc.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div 
                  className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 cursor-pointer"
                  onClick={() => viewProductDetail(acc)}
                >
                  <img 
                    src={acc.image} 
                    alt={acc.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-[10px] font-bold text-[#DF0C88] uppercase tracking-wider mb-1">
                  {acc.brand}
                </div>
                <h4 
                  onClick={() => viewProductDetail(acc)}
                  className="text-xs font-bold text-slate-900 line-clamp-2 cursor-pointer group-hover:text-[#DF0C88] transition-colors"
                >
                  {acc.title}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">{acc.rating}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-slate-900">£{acc.price.toFixed(2)}</span>
                  {acc.regularPrice && (
                    <span className="text-[11px] text-slate-400 line-through ml-1.5">
                      £{acc.regularPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(acc);
                    showNotification(`Added ${acc.title} to cart!`, 'success');
                  }}
                  className="bg-slate-900 hover:bg-[#DF0C88] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. POPULAR REPAIR SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Expert Solutions</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-heading mt-1">
              Common Repairs We Fix Daily
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              From iPhone and Samsung OLED screens to MacBook logic board repairs. Select an issue to see transparent prices and book immediately.
            </p>
          </div>
          <button 
            onClick={() => setCurrentPage('services')}
            className="text-xs font-semibold text-[#DF0C88] hover:text-[#C50875] flex items-center gap-1 self-start md:self-auto"
          >
            <span>View All Repair Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPAIR_ISSUES.slice(0, 6).map((issue) => (
            <div 
              key={issue.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-pink-300 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-pink-50 text-slate-700 group-hover:text-[#DF0C88] flex items-center justify-center transition-colors">
                    {issue.id === 'screen' && <Smartphone className="w-6 h-6" />}
                    {issue.id === 'battery' && <BatteryCharging className="w-6 h-6" />}
                    {issue.id === 'charging-port' && <Zap className="w-6 h-6" />}
                    {issue.id === 'water-damage' && <Droplets className="w-6 h-6" />}
                    {issue.id === 'back-glass' && <ShieldCheck className="w-6 h-6" />}
                    {issue.id === 'camera' && <Wrench className="w-6 h-6" />}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">From</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">£{issue.basePrice}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-[#DF0C88] transition-colors">
                  {issue.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {issue.description}
                </p>

                <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-[#DF0C88]" />
                    ~{issue.durationMinutes} mins
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 font-semibold">6-Mo Guarantee</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button 
                  onClick={() => startRepairBooking({ issue: issue.id })}
                  className="flex-1 bg-slate-900 group-hover:bg-[#DF0C88] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Book This Repair</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (3-STEP REPAIR PROCESS) */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Simple & Stress-Free</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-heading mt-1">
              How iRepair Mobiles Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Getting your broken device fixed has never been easier. Choose the service method that suits your schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#DF0C88] text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Book Online or Walk In
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your device, model, and fault to get an upfront transparent quote. Choose a walk-in visit to any of our 8 UK stores or use our free Royal Mail post-in service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#DF0C88] text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Expert 30-Minute Repair
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our certified technicians disassemble your phone in an ESD-safe workspace, replacing broken glass, battery, or logic boards using factory-calibrated tools and OEM parts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-[#DF0C88] text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                Tested & 6-Month Warranty
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every repair completes a rigorous 70-point quality check (touch, camera, sensors, audio). Pick it up in store or receive it back via tracked Special Delivery.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={() => startRepairBooking()}
              className="bg-[#DF0C88] hover:bg-[#C50875] text-white text-sm font-semibold py-3 px-8 rounded-xl shadow-md transition-all active:scale-[0.98] inline-flex items-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Start Your Repair Booking</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. STORE LOCATIONS PREVIEW */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Visit Us In Person</span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-heading mt-1">
                8 Convenient UK High Street Outlets
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Walk-ins are always warmly welcomed. Drop your phone off while doing your shopping and collect it fixed in 30 minutes.
              </p>
            </div>
            <button 
              onClick={() => setCurrentPage('locations')}
              className="text-xs font-semibold text-[#DF0C88] hover:text-white flex items-center gap-1 self-start md:self-auto"
            >
              <span>Explore Interactive Map & All Stores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STORE_LOCATIONS.slice(0, 4).map((store) => (
              <div 
                key={store.id}
                className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 hover:border-[#DF0C88] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#DF0C88] bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                      {store.city}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">Open Today</span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-heading">{store.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#DF0C88] shrink-0 mt-0.5" />
                    <span>{store.address} ({store.postcode})</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    📞 <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="hover:text-white">{store.phone}</a>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{store.openingHours.weekdays}</span>
                  <button 
                    onClick={() => startRepairBooking({ storeId: store.id })}
                    className="text-[#DF0C88] font-semibold hover:text-pink-300 flex items-center gap-1"
                  >
                    <span>Book Store Visit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 text-amber-500 text-sm font-bold mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-800 ml-1">4.9 / 5.0 on Trustpilot & Google</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-heading">
            Trusted by Thousands Across the UK
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Read real feedback from customers who visited our branches or mailed their broken devices in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div 
              key={t.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{t.review}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">{t.author}</div>
                <div className="text-[11px] text-[#DF0C88] font-medium">{t.deviceRepaired}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.location} · {t.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">Got Questions?</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:text-[#DF0C88] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-[#DF0C88] shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM REPAIR CTA BANNER WITH #DF0C88 GRADIENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#DF0C88] via-[#E82596] to-[#C50875] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-100">Get Back Up & Running</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading text-white">
              Ready to restore your device?
            </h2>
            <p className="text-xs sm:text-sm text-pink-50 leading-relaxed">
              Book online now in under 2 minutes for priority bench service at any iRepair branch, or request a free prepaid Royal Mail shipping label.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <button 
              onClick={() => startRepairBooking()}
              className="bg-white hover:bg-slate-100 text-[#DF0C88] font-bold py-3.5 px-6 rounded-xl shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Wrench className="w-4 h-4 text-[#DF0C88]" />
              <span>Book a Repair Now</span>
            </button>
            <a 
              href="tel:+447717103365"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold py-3.5 px-6 rounded-xl border border-white/30 text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors backdrop-blur-xs"
            >
              <span>Call +44 771 7103 365</span>
            </a>
          </div>
        </div>
      </section>

      </div>
  );
};
