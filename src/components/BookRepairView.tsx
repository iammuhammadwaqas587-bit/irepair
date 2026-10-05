import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DeviceCategory, 
  RepairMethod, 
  RepairBooking 
} from '../types';
import { 
  DEVICE_BRANDS, 
  DEVICE_MODELS, 
  REPAIR_ISSUES, 
  STORE_LOCATIONS 
} from '../data/mockData';
import { 
  Wrench, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  UserCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Code 
} from 'lucide-react';

export const BookRepairView: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    selectedBrand, 
    setSelectedBrand, 
    selectedModel, 
    setSelectedModel, 
    selectedIssue, 
    setSelectedIssue,
    preselectedStoreId,
    addBooking,
    setCurrentPage,
    setTrackingQuery,
    setShowWooModal,
    setWooCommercePayload,
    showNotification
  } = useApp();

  // Wizard Step: 1 = Category, 2 = Model, 3 = Issue, 4 = Method & Store, 5 = Customer Details, 6 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [repairMethod, setRepairMethod] = useState<RepairMethod>('walk-in');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(preselectedStoreId || 'reading');
  const [appointmentDate, setAppointmentDate] = useState<string>('2026-10-02');
  const [appointmentTime, setAppointmentTime] = useState<string>('11:00 AM');
  
  // Customer details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [passcode, setPasscode] = useState('');
  const [notes, setNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Completed booking state
  const [completedBooking, setCompletedBooking] = useState<RepairBooking | null>(null);

  // Derived filtered models
  const availableBrands = DEVICE_BRANDS.filter(b => b.category === selectedCategory);
  const availableModels = DEVICE_MODELS.filter(m => m.category === selectedCategory && (selectedBrand ? m.brandId === selectedBrand : true));
  const activeIssueObj = REPAIR_ISSUES.find(i => i.id === selectedIssue) || REPAIR_ISSUES[0];
  const activeModelObj = DEVICE_MODELS.find(m => m.id === selectedModel) || availableModels[0];
  const activeStoreObj = STORE_LOCATIONS.find(s => s.id === selectedStoreId) || STORE_LOCATIONS[0];

  // Dynamic pricing calculation based on model tiers
  const getCalculatedPrice = (): number => {
    let price = activeIssueObj.basePrice;
    if (activeModelObj?.id.includes('pro-max') || activeModelObj?.id.includes('ultra')) {
      price += 40;
    } else if (activeModelObj?.id.includes('pro') || activeModelObj?.id.includes('plus')) {
      price += 25;
    } else if (activeModelObj?.category === 'laptop') {
      price += 35;
    }
    return price;
  };

  const currentPrice = getCalculatedPrice();

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      showNotification('Please fill in your name, email, and phone number', 'error');
      return;
    }

    const booking = addBooking({
      category: selectedCategory,
      brand: selectedBrand.toUpperCase(),
      model: activeModelObj?.name || 'Selected Model',
      issue: activeIssueObj.name,
      price: currentPrice,
      method: repairMethod,
      storeLocationId: repairMethod === 'walk-in' ? selectedStoreId : undefined,
      scheduledDate: repairMethod === 'walk-in' ? appointmentDate : undefined,
      scheduledTime: repairMethod === 'walk-in' ? appointmentTime : undefined,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      notes: `${notes} ${passcode ? `| Device Passcode for testing: ${passcode}` : ''}`,
    });

    // Create WooCommerce order payload representation
    const wcPayload = {
      payment_method: repairMethod === 'walk-in' ? 'cod' : 'bacs',
      payment_method_title: repairMethod === 'walk-in' ? 'Pay at Store on Collection' : 'Online Card Payment / Invoice',
      set_paid: false,
      billing: {
        first_name: fullName.split(' ')[0] || fullName,
        last_name: fullName.split(' ').slice(1).join(' ') || '',
        address_1: streetAddress || 'In-store Walk-in',
        postcode: postcode || activeStoreObj?.postcode,
        country: 'GB',
        email: email,
        phone: phone,
      },
      shipping: {
        first_name: fullName.split(' ')[0] || fullName,
        last_name: fullName.split(' ').slice(1).join(' ') || '',
        address_1: streetAddress || activeStoreObj?.address,
        postcode: postcode || activeStoreObj?.postcode,
        country: 'GB',
      },
      line_items: [
        {
          name: `Repair: ${activeModelObj?.name} - ${activeIssueObj.name}`,
          product_id: 9901,
          quantity: 1,
          subtotal: currentPrice.toString(),
          total: currentPrice.toString(),
          meta_data: [
            { key: 'Device Category', value: selectedCategory },
            { key: 'Device Model', value: activeModelObj?.name },
            { key: 'Fault Description', value: activeIssueObj.name },
            { key: 'Service Method', value: repairMethod },
            { key: 'Store Location', value: activeStoreObj?.name },
            { key: 'Scheduled Slot', value: `${appointmentDate} at ${appointmentTime}` },
            { key: 'Job Reference', value: booking.id },
          ],
        },
      ],
    };

    setWooCommercePayload(wcPayload);
    setCompletedBooking(booking);
    setCurrentStep(6);
    showNotification(`Booking ${booking.id} confirmed successfully!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#DF0C88] text-xs font-semibold mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>Express UK Repair Booking System</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 font-heading">
          Book Your Device Repair
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Select your device, see transparent live pricing, and choose between walk-in branch visit, free postal mail-in, or call-out service.
        </p>
      </div>

      {/* Progress Steps Header (Hidden on final success step) */}
      {currentStep < 6 && (
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#DF0C88] transition-all duration-300 -z-10"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />

            {[
              { num: 1, label: 'Device' },
              { num: 2, label: 'Model' },
              { num: 3, label: 'Fault' },
              { num: 4, label: 'Method' },
              { num: 5, label: 'Details' },
            ].map(step => (
              <button
                key={step.num}
                onClick={() => { if (currentStep > step.num) setCurrentStep(step.num); }}
                disabled={currentStep < step.num}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                    currentStep === step.num 
                      ? 'bg-[#DF0C88] text-white ring-4 ring-pink-100' 
                      : currentStep > step.num 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <span className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                  currentStep === step.num ? 'text-[#DF0C88] font-bold' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Form Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Wizard Steps */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          {/* STEP 1: Select Device Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  1. What device needs repair?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your equipment type to view available models and repair options.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'smartphone', label: 'Smartphones', sub: 'iPhone, Samsung, Pixel', icon: Smartphone },
                  { id: 'tablet', label: 'Tablets / iPads', sub: 'iPad Pro, Air, Mini, Tab', icon: Tablet },
                  { id: 'laptop', label: 'Laptops / MacBooks', sub: 'Apple, Dell, HP, Lenovo', icon: Laptop },
                  { id: 'smartwatch', label: 'Smartwatches', sub: 'Apple Watch, Galaxy', icon: Clock },
                  { id: 'console', label: 'Gaming Consoles', sub: 'PS5, Xbox, Switch', icon: Wrench },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(item.id as DeviceCategory);
                        // Auto reset brand default for category
                        const firstBrand = DEVICE_BRANDS.find(b => b.category === item.id);
                        if (firstBrand) setSelectedBrand(firstBrand.id);
                      }}
                      className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between h-36 ${
                        isSelected 
                          ? 'border-[#DF0C88] bg-pink-50/50 ring-2 ring-[#DF0C88]/20 text-pink-900' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#DF0C88] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{item.label}</div>
                        <div className="text-[11px] text-slate-500">{item.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Select Model</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Brand and Model */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  2. Select Brand & Exact Model
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We stock genuine and OEM-grade parts for all popular editions.
                </p>
              </div>

              {/* Brand Selector tabs */}
              <div className="flex flex-wrap gap-2">
                {availableBrands.map(brand => (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setSelectedBrand(brand.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      selectedBrand === brand.id 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>

              {/* Models Grid */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Model ({availableModels.length} available)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                  {availableModels.map(model => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModel(model.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        selectedModel === model.id 
                          ? 'border-[#DF0C88] bg-pink-50 text-pink-900 font-bold ring-2 ring-[#DF0C88]/20' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-xs">{model.name}</div>
                      {model.popular && (
                        <span className="text-[10px] text-[#DF0C88] font-medium">★ Most Popular</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Select Fault / Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Fault / Issue */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  3. What is the issue with your {activeModelObj?.name}?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All repairs include complete diagnostics and our comprehensive 6-month warranty.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {REPAIR_ISSUES.map(issue => {
                  const isSelected = selectedIssue === issue.id;
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => setSelectedIssue(issue.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#DF0C88] bg-pink-50/50 ring-2 ring-[#DF0C88]/20' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-xs text-slate-900">{issue.name}</div>
                        <div className="text-xs font-bold text-[#DF0C88] tabular-nums">
                          ~£{issue.basePrice}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3 text-[#DF0C88]" />
                        <span>Approx. {issue.durationMinutes} mins</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Choose Service Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Choose Service Method (Walk-in vs Mail-in vs Call-out) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  4. How would you like us to repair it?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose between visiting one of our 8 UK branches, free Royal Mail postage, or an on-site callout.
                </p>
              </div>

              {/* Service Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRepairMethod('walk-in')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    repairMethod === 'walk-in'
                      ? 'border-[#DF0C88] bg-pink-50/60 ring-2 ring-[#DF0C88]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-[#DF0C88] mb-2" />
                  <div className="font-bold text-xs text-slate-900">Walk In to Store</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Drop off at any of our 8 UK branches. Most repairs ready in 30 mins.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRepairMethod('mail-in')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    repairMethod === 'mail-in'
                      ? 'border-[#DF0C88] bg-pink-50/60 ring-2 ring-[#DF0C88]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#DF0C88] mb-2" />
                  <div className="font-bold text-xs text-slate-900">Free Postal Mail-In</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    We email a prepaid Royal Mail tracked label. Free return courier.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRepairMethod('call-out')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    repairMethod === 'call-out'
                      ? 'border-[#DF0C88] bg-pink-50/60 ring-2 ring-[#DF0C88]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-[#DF0C88] mb-2" />
                  <div className="font-bold text-xs text-slate-900">Call-Out Van Service</div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Our certified technician comes to your home or office in our mobile lab.
                  </p>
                </button>
              </div>

              {/* Conditional: Store & Appointment Picker if Walk-in */}
              {repairMethod === 'walk-in' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="font-bold text-xs text-slate-800">
                    Select Your Nearest iRepair Branch:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STORE_LOCATIONS.map(store => (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => setSelectedStoreId(store.id)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                          selectedStoreId === store.id
                            ? 'border-[#DF0C88] bg-white font-semibold text-pink-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{store.city} Store</div>
                        <div className="text-[11px] text-slate-500 truncate">{store.address}</div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Preferred Date:
                      </label>
                      <input 
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Preferred Time Slot:
                      </label>
                      <select
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:outline-none"
                      >
                        <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="01:00 PM">01:00 PM (Lunchtime Slot)</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:30 PM">04:30 PM (Late Afternoon)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional: Mail-in info */}
              {repairMethod === 'mail-in' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free Tracked Royal Mail Special Delivery Label Included</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Once submitted, our system generates an instant postage barcode. Drop it off at any UK Post Office. Devices are repaired same-day upon arrival and posted back with tracking.
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Enter Contact Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Customer Details & Confirmation Form */}
          {currentStep === 5 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  5. Customer & Contact Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We'll send your repair tracking code and completion SMS updates here.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 07712 345678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john.smith@example.co.uk"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                {repairMethod !== 'walk-in' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Street Address *
                      </label>
                      <input 
                        type="text"
                        required
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="House number & street name"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        UK Postcode *
                      </label>
                      <input 
                        type="text"
                        required
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="e.g. RG1 2AA"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Screen Lock Passcode (Optional)
                  </label>
                  <input 
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Allows technician to test touch & cameras"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Fault Notes
                  </label>
                  <input 
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. dropped on concrete, speaker faint"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="rounded text-[#DF0C88] focus:ring-[#DF0C88]"
                />
                <label htmlFor="terms" className="text-xs text-slate-600">
                  I agree to the iRepair Mobiles No Fix No Fee terms and 6-Month Warranty terms.
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={!agreedTerms}
                  className="bg-[#DF0C88] hover:bg-[#C50875] disabled:bg-slate-300 text-white font-bold py-3 px-8 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Book Repair</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: Booking Confirmation & Job Reference */}
          {currentStep === 6 && completedBooking && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Repair Order Received!
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  Job Reference: <span className="text-[#DF0C88]">{completedBooking.id}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  A confirmation SMS & email have been dispatched to <strong>{completedBooking.customerEmail}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Device:</span>
                  <span className="font-semibold text-slate-900">{completedBooking.model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Fault:</span>
                  <span className="font-semibold text-slate-900">{completedBooking.issue}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Service Method:</span>
                  <span className="font-semibold capitalize text-slate-900">{completedBooking.method}</span>
                </div>
                {completedBooking.method === 'walk-in' && (
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Appointment:</span>
                    <span className="font-semibold text-slate-900">
                      {completedBooking.scheduledDate} at {completedBooking.scheduledTime} ({activeStoreObj?.city})
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                  <span>Estimated Total:</span>
                  <span className="text-[#DF0C88] tabular-nums">£{completedBooking.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTrackingQuery(completedBooking.id);
                    setCurrentPage('track-repair');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Track This Repair Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowWooModal(true)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Code className="w-4 h-4 text-purple-600" />
                  <span>Inspect WooCommerce API Hook</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Repair Order Live Summary Sticky Card */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#DF0C88] font-heading">
              Repair Summary
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live quote based on selected fault & model
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Device:</span>
              <span className="font-bold text-white text-right">{activeModelObj?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Selected Fault:</span>
              <span className="font-semibold text-pink-300 text-right">{activeIssueObj.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Duration:</span>
              <span className="font-semibold text-slate-200">~{activeIssueObj.durationMinutes} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Warranty Coverage:</span>
              <span className="text-emerald-400 font-semibold">6 Months Full Guarantee</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Method:</span>
              <span className="capitalize font-semibold text-slate-200">{repairMethod}</span>
            </div>
            {repairMethod === 'walk-in' && (
              <div className="flex justify-between">
                <span className="text-slate-400">Store Branch:</span>
                <span className="font-semibold text-slate-200">{activeStoreObj?.city}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-4 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Est. Price</span>
              <span className="text-[10px] text-slate-500">Includes VAT, Parts & Labour</span>
            </div>
            <span className="text-2xl font-extrabold text-white tabular-nums">
              £{currentPrice.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Genuine OEM-Grade Replacement Display & Parts</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>No Fix, No Fee Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#DF0C88] shrink-0" />
              <span>Free Return Delivery on Postal Repairs</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
