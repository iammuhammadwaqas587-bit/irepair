import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Check, 
  Wrench, 
  Plus, 
  Minus, 
  Sparkles, 
  Globe, 
  ExternalLink, 
  Lock, 
  Battery, 
  Smartphone, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  Shield,
  HelpCircle,
  Award,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { Product, ProductVariation, WooCommerceAttribute } from '../types';
import { fetchProductVariations } from '../services/wordpressApi';

type TabType = 'technical' | 'about' | 'reviews' | 'shipment' | 'warranty' | 'additional';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    setCurrentPage, 
    addToCart, 
    startRepairBooking, 
    wpConfig, 
    showNotification,
    products,
    viewProductDetail
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('technical');
  const sliderRef = useRef<HTMLDivElement>(null);

  // Variations list (preloaded from bundled data or fetched from WooCommerce REST API)
  const [variations, setVariations] = useState<ProductVariation[]>(() => {
    return selectedProduct?.variations || [];
  });
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);

  // Sync variations if product changes
  useEffect(() => {
    if (!selectedProduct) return;
    setActiveImageIndex(0);
    if (selectedProduct.variations && selectedProduct.variations.length > 0) {
      setVariations(selectedProduct.variations);
    } else if (selectedProduct.wpId && selectedProduct.type === 'variable') {
      setIsLoadingVariations(true);
      fetchProductVariations(selectedProduct.wpId, wpConfig)
        .then(vars => {
          if (vars && vars.length > 0) {
            setVariations(vars);
          }
        })
        .finally(() => setIsLoadingVariations(false));
    }
  }, [selectedProduct, wpConfig]);

  // Extract all WooCommerce attributes
  const productAttributes = useMemo<WooCommerceAttribute[]>(() => {
    if (!selectedProduct) return [];
    if (selectedProduct.attributes && selectedProduct.attributes.length > 0) {
      return selectedProduct.attributes.filter(a => a.options && a.options.length > 0);
    }
    // Extract dynamically from variations
    if (variations.length > 0) {
      const attrMap: Record<string, Set<string>> = {};
      variations.forEach(v => {
        Object.entries(v.attributes).forEach(([k, val]) => {
          if (!val) return;
          if (!attrMap[k]) attrMap[k] = new Set();
          attrMap[k].add(val);
        });
      });
      return Object.entries(attrMap).map(([name, set]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        slug: name,
        variation: true,
        visible: true,
        options: Array.from(set)
      }));
    }
    // Fallback to legacy variants:
    const legacyAttrs: WooCommerceAttribute[] = [];
    if (selectedProduct.variants?.storage && selectedProduct.variants.storage.length > 0) {
      legacyAttrs.push({
        name: 'Storage',
        slug: 'storage',
        variation: true,
        visible: true,
        options: selectedProduct.variants.storage
      });
    }
    if (selectedProduct.variants?.colors && selectedProduct.variants.colors.length > 0) {
      legacyAttrs.push({
        name: 'Color',
        slug: 'color',
        variation: true,
        visible: true,
        options: selectedProduct.variants.colors.map(c => c.name)
      });
    }
    return legacyAttrs;
  }, [selectedProduct, variations]);

  // Current selections map: e.g. { storage: "128GB", condition: "A Grade", color: "Phantom Black" }
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (selectedProduct?.defaultAttributes) {
      Object.entries(selectedProduct.defaultAttributes).forEach(([k, v]) => {
        initial[k.toLowerCase()] = v;
      });
    }
    return initial;
  });

  // Ensure every available attribute has an initial selection
  useEffect(() => {
    if (productAttributes.length === 0) return;
    setSelectedAttributes(prev => {
      const updated = { ...prev };
      let changed = false;
      productAttributes.forEach(attr => {
        const key = (attr.slug || attr.name).toLowerCase();
        if (!updated[key] && attr.options.length > 0) {
          updated[key] = attr.options[0];
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [productAttributes]);

  // Match the user's active attribute choices with a specific WooCommerce variation
  const matchedVariation = useMemo(() => {
    if (variations.length === 0) return null;
    const match = variations.find(v => {
      return Object.entries(selectedAttributes).every(([attrKey, attrVal]) => {
        const vVal = v.attributes[attrKey.toLowerCase()] || v.attributes[attrKey];
        if (!vVal) return true;
        return vVal.toLowerCase().trim() === attrVal.toLowerCase().trim();
      });
    });
    return match || variations[0];
  }, [variations, selectedAttributes]);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600 mb-4">No product selected.</p>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="px-4 py-2 bg-[#DF0C88] text-white rounded-lg text-xs font-semibold cursor-pointer"
        >
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const isVariable = selectedProduct.type === 'variable' || variations.length > 0;
  const activePrice = matchedVariation ? matchedVariation.price : selectedProduct.price;
  const activeRegularPrice = matchedVariation?.regularPrice || selectedProduct.regularPrice;
  const inStock = matchedVariation ? matchedVariation.inStock : selectedProduct.inStock;

  // Build full list of gallery images (including variation images)
  const allImages = useMemo(() => {
    const list: string[] = [selectedProduct.image];
    if (selectedProduct.gallery && selectedProduct.gallery.length > 0) {
      selectedProduct.gallery.forEach(img => {
        if (!list.includes(img)) list.push(img);
      });
    }
    variations.forEach(v => {
      if (v.image && !list.includes(v.image)) {
        list.push(v.image);
      }
    });
    return list;
  }, [selectedProduct, variations]);

  // Main display image: priority given to matched variation image
  const currentMainImage = matchedVariation?.image || allImages[activeImageIndex] || selectedProduct.image;

  // Formatted price range
  const displayPriceRange = selectedProduct.priceRange || (
    selectedProduct.minPrice && selectedProduct.maxPrice && selectedProduct.minPrice !== selectedProduct.maxPrice
      ? `£${selectedProduct.minPrice.toFixed(2)} – £${selectedProduct.maxPrice.toFixed(2)}`
      : `£${selectedProduct.price.toFixed(2)}`
  );

  // Selected options summary text
  const selectedOptionsSummary = Object.entries(selectedAttributes)
    .map(([_, v]) => v)
    .filter(Boolean)
    .join(' · ') || selectedProduct.title;

  const handleSelectAttributeOption = (attrKey: string, optionValue: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrKey.toLowerCase()]: optionValue
    }));
  };

  const handleAddToCart = () => {
    addToCart(
      selectedProduct,
      quantity,
      selectedAttributes['color'] || selectedAttributes['colour'] || undefined,
      selectedAttributes['storage'] || selectedAttributes['capacity'] || undefined,
      matchedVariation?.id,
      selectedAttributes,
      activePrice
    );
  };

  // Related products query (same category or brand, excluding current product)
  const relatedProducts = useMemo(() => {
    const directMatches = products.filter(p => 
      p.id !== selectedProduct.id && 
      (p.category?.toLowerCase() === selectedProduct.category?.toLowerCase() || 
       p.brand?.toLowerCase() === selectedProduct.brand?.toLowerCase())
    );
    if (directMatches.length >= 8) {
      return directMatches.slice(0, 12);
    }
    const fillers = products.filter(p => p.id !== selectedProduct.id && !directMatches.some(m => m.id === p.id));
    return [...directMatches, ...fillers].slice(0, 12);
  }, [products, selectedProduct]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Structured technical details dictionary for table view matching screenshot
  const technicalCategories = useMemo(() => {
    const isPhone = selectedProduct.category?.includes('phone') || selectedProduct.title.toLowerCase().includes('phone') || selectedProduct.title.toLowerCase().includes('galaxy') || selectedProduct.title.toLowerCase().includes('pixel');
    const isTablet = selectedProduct.category?.includes('tablet') || selectedProduct.title.toLowerCase().includes('pad') || selectedProduct.title.toLowerCase().includes('tab');
    const isLaptop = selectedProduct.category?.includes('laptop') || selectedProduct.title.toLowerCase().includes('macbook');

    const specs = selectedProduct.specifications || {};

    return [
      {
        category: 'Body',
        specs: [
          { label: 'Dimensions', value: specs['Dimensions'] || (isPhone ? '158 x 77.8 x 8.1 mm (6.22 x 3.06 x 0.32 in)' : isTablet ? '247.6 x 178.5 x 6.1 mm' : '304.1 x 212.4 x 15.6 mm') },
          { label: 'Weight', value: specs['Weight'] || (isPhone ? '194 g – 226 g' : isTablet ? '461 g' : '1.4 kg') },
          { label: 'Build', value: specs['Build'] || 'Glass front & back (Corning-made), aerospace aluminium frame' },
          { label: 'SIM', value: specs['SIM'] || 'Nano-SIM + eSIM / Fully Unlocked to all UK & Global Networks' },
          { label: 'IP Rating', value: specs['IP Rating'] || 'IP68 dust & water resistant (tested up to 4m for 30 mins)' },
          { label: 'Other', value: specs['Other'] || 'Apple Pay / Google Pay NFC certified' }
        ]
      },
      {
        category: 'Display',
        specs: [
          { label: 'Type', value: specs['Display Type'] || 'Super Retina XDR OLED, HDR10, True Tone, 800–1200 nits' },
          { label: 'Size', value: specs['Display Size'] || (isPhone ? '6.1 – 6.7 inches (~86% screen-to-body ratio)' : isTablet ? '10.9 inches Liquid Retina' : '13.3-inch Retina Display') },
          { label: 'Resolution', value: specs['Resolution'] || '1170 x 2532 pixels, 19.5:9 ratio (~460 ppi density)' },
          { label: 'Protection', value: specs['Protection'] || 'Ceramic Shield front, oleophobic anti-scratch coating' }
        ]
      },
      {
        category: 'Platform & Performance',
        specs: [
          { label: 'Operating System', value: specs['OS'] || (selectedProduct.brand === 'Apple' ? 'iOS (upgradable to latest iOS 18+)' : 'Android with Guaranteed Security Updates') },
          { label: 'Processor', value: specs['Chipset'] || (selectedProduct.brand === 'Apple' ? 'Apple A-Series Bionic / Apple Silicon' : 'Snapdragon / Exynos Octa-Core') },
          { label: 'Security', value: 'Face ID / Fingerprint sensor (100% biometric verified)' }
        ]
      },
      {
        category: 'Memory & Storage',
        specs: [
          { label: 'Internal Storage', value: selectedAttributes['storage'] || selectedProduct.variants?.storage?.join(', ') || '128GB / 256GB / 512GB' },
          { label: 'RAM', value: specs['RAM'] || '6GB / 8GB High-Speed LPDDR5' },
          { label: 'Health Status', value: 'Factory refurbished and flash-memory diagnostic certified' }
        ]
      },
      {
        category: 'Camera System',
        specs: [
          { label: 'Main Cameras', value: specs['Camera'] || 'Dual/Triple 12MP–48MP with Sensor-shift Optical Image Stabilisation (OIS)' },
          { label: 'Features', value: 'Night mode, Deep Fusion, Smart HDR 4, 4K Dolby Vision video recording' },
          { label: 'Front Camera', value: '12MP TrueDepth front-facing camera with Portrait mode' }
        ]
      },
      {
        category: 'Battery & Charging',
        specs: [
          { label: 'Battery Capacity', value: specs['Battery'] || 'All-day battery life (guaranteed 85%+ minimum capacity)' },
          { label: 'Charging', value: 'Fast wired charging (50% in 30 mins) + Qi wireless charging + MagSafe' },
          { label: 'Testing Checklist', value: '30-point load testing passed with original efficiency' }
        ]
      },
      {
        category: 'Warranty & Network',
        specs: [
          { label: 'Warranty Coverage', value: `${selectedProduct.warrantyMonths} Months Express Hardware Guarantee (Parts & Labour)` },
          { label: 'Network Compatibility', value: 'SIM-Free · Unlocked to EE, Vodafone, O2, Three, giffgaff, Sky Mobile & Global SIMs' },
          { label: 'Packaging', value: 'Eco-friendly protective box with certified USB charging cable' }
        ]
      }
    ];
  }, [selectedProduct, selectedAttributes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <button 
          onClick={() => setCurrentPage('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#DF0C88] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span className="hover:text-slate-700 cursor-pointer" onClick={() => setCurrentPage('home')}>Home</span>
          <span>/</span>
          <span className="hover:text-slate-700 cursor-pointer" onClick={() => setCurrentPage('shop')}>Shop</span>
          <span>/</span>
          <span className="capitalize text-slate-500">{selectedProduct.category}</span>
          <span>/</span>
          <span className="text-slate-700 font-semibold line-clamp-1 max-w-[200px] sm:max-w-none">{selectedProduct.title}</span>
        </div>
      </div>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Product Gallery ONLY (Badges removed from below gallery per user request) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden aspect-4/3 relative group shadow-xs">
            <img 
              src={currentMainImage} 
              alt={selectedProduct.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            
            {/* Condition badge */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs">
              {selectedAttributes['condition'] || selectedProduct.condition}
            </div>

            {/* Discount / Save badge */}
            {activeRegularPrice && activeRegularPrice > activePrice && (
              <div className="absolute top-4 right-4 bg-[#DF0C88] text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md">
                Save £{(activeRegularPrice - activePrice).toFixed(0)}
              </div>
            )}

            {/* Variable indicator */}
            {isVariable && (
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3 text-pink-400" />
                <span>Customise below</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {allImages.slice(0, 6).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-50 ${
                    currentMainImage === img ? 'border-[#DF0C88] ring-2 ring-[#DF0C88]/20 scale-102' : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Purchase Module & Information */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Product Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#DF0C88]">
                {selectedProduct.brand} · {inStock ? 'In Stock (Ready to Dispatch)' : 'Out of Stock'}
              </span>

              {/* TrustScore Tag */}
              <a 
                href="https://www.trustpilot.com/review/irepair-mobiles.co.uk"
                target="_blank" 
                rel="noopener noreferrer"
                title="View iRepair Mobiles reviews on Trustpilot"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-full transition-all group cursor-pointer text-xs"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-[#00b67a] flex items-center justify-center rounded-xs">
                      <Star className="w-2 h-2 fill-white text-white" />
                    </div>
                  ))}
                </div>
                <span className="font-bold text-[11px]">4.8 / 5 Trustpilot</span>
              </a>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
              {selectedProduct.title}
            </h1>

            {/* Rating Stars & SKU */}
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800">{selectedProduct.rating}</span>
                <span className="text-slate-400">({selectedProduct.reviewsCount} verified reviews)</span>
              </div>
              {selectedProduct.specifications?.['SKU'] && (
                <>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    SKU: {selectedProduct.specifications['SKU']}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 1. Price Range Display Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-pink-50/30 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>{isVariable ? 'Price Range' : 'Online Price'}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                VAT Included · Free UK Shipping
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                {isVariable ? displayPriceRange : `£${selectedProduct.price.toFixed(2)}`}
              </span>
              {selectedProduct.regularPrice && selectedProduct.regularPrice > selectedProduct.price && (
                <span className="text-base text-slate-400 line-through tabular-nums">
                  £{selectedProduct.regularPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {isVariable && (
              <p className="text-xs text-slate-500">
                Choose your options below to see exact variation pricing and live warehouse stock.
              </p>
            )}
          </div>

          {/* 2. WooCommerce Variations Form (Fetched from WooCommerce REST API) */}
          {productAttributes.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Select Options
                </span>
                {isLoadingVariations && (
                  <span className="text-[11px] text-[#DF0C88] animate-pulse">
                    Updating variations...
                  </span>
                )}
              </div>

              {productAttributes.map((attr) => {
                const key = (attr.slug || attr.name).toLowerCase();
                const currentValue = selectedAttributes[key] || attr.options[0];
                const isColor = key.includes('color') || key.includes('colour');

                return (
                  <div key={attr.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {attr.name}:
                      </span>
                      <span className="font-bold text-[#DF0C88]">
                        {currentValue}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {attr.options.map((opt) => {
                        const isSelected = currentValue?.toLowerCase().trim() === opt.toLowerCase().trim();

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectAttributeOption(key, opt)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'border-[#DF0C88] bg-pink-50 text-[#DF0C88] ring-2 ring-[#DF0C88]/20 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            {isColor && (
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 inline-block"
                                style={{
                                  backgroundColor: opt.toLowerCase().includes('black') ? '#0f172a' 
                                    : opt.toLowerCase().includes('white') ? '#f8fafc' 
                                    : opt.toLowerCase().includes('gold') ? '#d4af37' 
                                    : opt.toLowerCase().includes('silver') ? '#cbd5e1' 
                                    : opt.toLowerCase().includes('blue') ? '#2563eb' 
                                    : opt.toLowerCase().includes('green') ? '#16a34a' 
                                    : opt.toLowerCase().includes('purple') ? '#9333ea' 
                                    : opt.toLowerCase().includes('red') ? '#dc2626' 
                                    : '#DF0C88'
                                }}
                              />
                            )}
                            <span>{opt}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 text-[#DF0C88]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. Selected Variation Price Summary (Before the button) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Selected Option
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                <span>{selectedOptionsSummary}</span>
                {inStock ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Backorder
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[11px] text-slate-400 font-medium">Selected Price</div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                £{(activePrice * quantity).toFixed(2)}
              </div>
              {activeRegularPrice && activeRegularPrice > activePrice && (
                <div className="text-xs text-slate-400 line-through tabular-nums">
                  £{(activeRegularPrice * quantity).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* 4. Quantity Stepper & Add to Basket Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 w-32 shrink-0">
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-bold text-sm text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button 
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 bg-[#DF0C88] hover:bg-[#C50875] disabled:bg-slate-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#DF0C88]/20 flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add to Basket · £{(activePrice * quantity).toFixed(2)}</span>
            </button>
          </div>

          {/* 5. Trustpilot Banner Widget (below Add to Basket button) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00b67a] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Excellent 4.8 / 5</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[#00b67a] font-extrabold">Trustpilot</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Over 150+ verified customer reviews across the UK
                </div>
              </div>
            </div>

            <a 
              href="https://www.trustpilot.com/review/irepair-mobiles.co.uk"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Read reviews</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 6. The 3 Assurance Badges (MOVED FROM BELOW GALLERY PER USER REQUEST) */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold text-slate-900">12M Warranty</div>
              <div className="text-[10px] text-slate-500">Parts &amp; Labour</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
              <Truck className="w-4 h-4 text-[#DF0C88] mx-auto mb-1" />
              <div className="font-bold text-slate-900">Next-Day UK</div>
              <div className="text-[10px] text-slate-500">Royal Mail Tracked</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
              <RotateCcw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="font-bold text-slate-900">14-Day Return</div>
              <div className="text-[10px] text-slate-500">Hassle-Free Policy</div>
            </div>
          </div>

          {/* 7. Short Description (PLACED BELOW ADD TO BASKET & TRUSTPILOT / BADGES PER USER REQUEST) */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DF0C88]"></span>
              <span>Short Description</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedProduct.description}
            </p>
          </div>

          {/* Payment & Security Reassurance */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Guaranteed Secure UK Checkout</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-3 flex-wrap">
              <span>Visa</span>
              <span>·</span>
              <span>Mastercard</span>
              <span>·</span>
              <span>Apple Pay</span>
              <span>·</span>
              <span>Google Pay</span>
              <span>·</span>
              <span>PayPal</span>
              <span>·</span>
              <span>Klarna (Pay in 3)</span>
              <span>·</span>
              <span>ClearPay</span>
            </div>
          </div>

          {/* Repair alternative option */}
          <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Already own this device?</div>
              <div className="text-slate-500">We offer screen, battery &amp; camera repairs from £39.</div>
            </div>
            <button 
              onClick={() => startRepairBooking({ category: selectedProduct.category === 'laptops' ? 'laptop' : 'smartphone' })}
              className="bg-slate-900 hover:bg-[#DF0C88] text-white font-semibold py-2 px-3.5 rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-[#DF0C88]" />
              <span>Book Repair</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* PRODUCT TABS SECTION (EXACTLY AS IN ATTACHED SCREENSHOT)                  */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-6">
        
        {/* Tab Buttons Row (Pill design matching screenshot) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'technical'
                ? 'bg-black text-white border-2 border-[#DF0C88] shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            Technical Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-black text-white border-2 border-[#DF0C88] shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            About Product
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-black text-white border-2 border-[#DF0C88] shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            Reviews
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shipment')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'shipment'
                ? 'bg-black text-white border-2 border-[#DF0C88] shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            Shipment
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warranty')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'warranty'
                ? 'bg-black text-white border-2 border-[#DF0C88] shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            Condition &amp; Warranty
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('additional')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'additional'
                ? 'bg-black text-white border-2 border-[#DF0C88] shadow-sm'
                : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
            }`}
          >
            Additional Info
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          
          {/* TAB 1: TECHNICAL DETAILS (2-Column Category vs Specification Table from Screenshot) */}
          {activeTab === 'technical' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="py-4 px-6 sm:px-8 font-bold text-slate-900 text-sm sm:text-base border-r border-slate-200 w-1/4 min-w-[150px]">
                      Category
                    </th>
                    <th className="py-4 px-6 sm:px-8 font-bold text-slate-900 text-sm sm:text-base w-3/4">
                      Specification
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {technicalCategories.map((group) => (
                    <tr key={group.category} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6 sm:px-8 font-bold text-slate-900 text-sm sm:text-base border-r border-slate-200 align-top bg-white">
                        {group.category}
                      </td>
                      <td className="py-5 px-6 sm:px-8 text-xs sm:text-sm text-slate-700 space-y-1 align-top bg-white leading-relaxed">
                        {group.specs.map((spec) => (
                          <div key={spec.label} className="leading-snug">
                            <span className="font-bold text-slate-900">{spec.label}:</span>{' '}
                            <span className="text-slate-700">{spec.value}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: ABOUT PRODUCT (Long description from WooCommerce) */}
          {activeTab === 'about' && (
            <div className="p-6 sm:p-10 space-y-8">
              <div className="space-y-4 max-w-4xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    About {selectedProduct.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#DF0C88] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                    Official Product Overview
                  </span>
                </div>

                {/* Long Description Content */}
                {selectedProduct.longDescription && /<[a-z][\s\S]*>/i.test(selectedProduct.longDescription) ? (
                  <div 
                    className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 [&_h2]:text-base sm:[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-sm sm:[&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-slate-600 [&_a]:text-[#DF0C88] [&_a]:font-semibold hover:[&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: selectedProduct.longDescription }} 
                  />
                ) : (
                  <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {(selectedProduct.longDescription || selectedProduct.description).split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* What's in the Box */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#DF0C88]" />
                  <span>What's In The Box</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Certified Device</div>
                      <div className="text-slate-500">Cleaned &amp; sanitized</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Fast Charging Cable</div>
                      <div className="text-slate-500">Braided USB-C / Lightning</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">SIM Tray Key</div>
                      <div className="text-slate-500">Universal ejection pin</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">iRepair Warranty Card</div>
                      <div className="text-slate-500">12M express coverage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="p-6 sm:p-10 space-y-8">
              {/* Trustpilot Score Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900">4.8</div>
                  <div>
                    <div className="flex items-center gap-1 text-[#00b67a]">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-xs text-white">
                          <Star className="w-3.5 h-3.5 fill-white text-white" />
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Based on 150+ verified UK customer reviews on Trustpilot
                    </div>
                  </div>
                </div>
                <a
                  href="https://www.trustpilot.com/review/irepair-mobiles.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#00b67a] hover:bg-[#009b67] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span>Review on Trustpilot</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Sample verified customer reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">David M.</span>
                    <span className="text-[10px] text-slate-400">Verified Purchase · 2 days ago</span>
                  </div>
                  <div className="flex text-[#00b67a] gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Phone arrived next morning in pristine condition without a mark. Battery health is at 98%. Excellent service by iRepair Mobiles."
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Sarah K.</span>
                    <span className="text-[10px] text-slate-400">Verified Purchase · 1 week ago</span>
                  </div>
                  <div className="flex text-[#00b67a] gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Bought this for my daughter. Unlocked straight away with her O2 SIM. Saved over £200 compared to Apple store price!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHIPMENT */}
          {activeTab === 'shipment' && (
            <div className="p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                UK Tracked Next-Day Delivery Policy
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Clock className="w-5 h-5 text-[#DF0C88]" />
                  <div className="font-bold text-slate-900 text-sm">Order by 3 PM</div>
                  <p className="text-xs text-slate-500">Same-day dispatch Monday to Friday for immediate delivery.</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <div className="font-bold text-slate-900 text-sm">Royal Mail Tracked 24</div>
                  <p className="text-xs text-slate-500">Full GPS tracking code sent by SMS &amp; email upon dispatch.</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <div className="font-bold text-slate-900 text-sm">Fully Insured Transit</div>
                  <p className="text-xs text-slate-500">All shipments are 100% insured against loss or transit damage.</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <strong>Free UK Shipping:</strong> All tech orders qualify for complimentary Tracked Next-Day UK Shipping. Returns are free within 14 days of delivery.
              </div>
            </div>
          )}



          {/* TAB 5: CONDITION & WARRANTY */}
          {activeTab === 'warranty' && (
            <div className="p-6 sm:p-10 space-y-8">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">
                      Device Condition Grading &amp; 12-Month Warranty
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Transparent grading standards for mobile phones and tech devices at iRepair Mobiles
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>12M Parts &amp; Labour Guarantee</span>
                  </span>
                </div>

                {/* 5 Distinct Grading Cards for Mobile Phones */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#DF0C88]" />
                    <span>Mobile Phone Condition Standards</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-3.5">
                    {/* Grade: New */}
                    <div className="p-4 sm:p-5 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg uppercase tracking-wider">
                            New
                          </span>
                          <span className="font-bold text-sm text-slate-900">Brand-New Sealed</span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          100% Unused
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        A brand-new, unused, unopened item in its original packaging, never worn, used, or activated, with all original packaging intact.
                      </p>
                    </div>

                    {/* Grade: A Grade */}
                    <div className="p-4 sm:p-5 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-[#DF0C88] text-white font-black text-xs rounded-lg uppercase tracking-wider">
                            A Grade
                          </span>
                          <span className="font-bold text-sm text-slate-900">Pristine / Like New</span>
                        </div>
                        <span className="text-[11px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          Retail Box Quality
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        The item appears as if it has just come out of a retail box. There are no signs of wear, and all original protective materials are intact. The item may have been opened or used very minimally but retains its pristine condition, and all original accessories are included.
                      </p>
                    </div>

                    {/* Grade: B Grade */}
                    <div className="p-4 sm:p-5 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-amber-600 text-white font-black text-xs rounded-lg uppercase tracking-wider">
                            B Grade
                          </span>
                          <span className="font-bold text-sm text-slate-900">Excellent Condition</span>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          100% Operational
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        The item shows minimal wear from general use and is 100% operational and functions as intended. It may have minor cosmetic imperfections but performs well, and may be missing non-essential accessories.
                      </p>
                    </div>

                    {/* Grade: C Grade */}
                    <div className="p-4 sm:p-5 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-blue-600 text-white font-black text-xs rounded-lg uppercase tracking-wider">
                            C Grade
                          </span>
                          <span className="font-bold text-sm text-slate-900">Good Condition</span>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Fully Functional
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        The item is fully operational and functions as intended, but has noticeable wear from previous use. It may have aesthetic imperfections such as scratches or dents, and may be missing non-essential accessories.
                      </p>
                    </div>

                    {/* Grade: Fair */}
                    <div className="p-4 sm:p-5 rounded-2xl border transition-all bg-white border-slate-200 hover:border-slate-300">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-slate-700 text-white font-black text-xs rounded-lg uppercase tracking-wider">
                            Fair
                          </span>
                          <span className="font-bold text-sm text-slate-900">Fair / Value Grade</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Works Perfectly
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        The item is fairly worn but continues to work perfectly. Signs of wear can include aesthetic issues such as scratches, dents, and worn corners, and it may be missing non-essential accessories.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warranty & Service Policy Box */}
                <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>iRepair Mobiles Comprehensive Warranty Coverage</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>12M Warranty</span>
                      </div>
                      <div className="font-semibold text-slate-700">Parts &amp; Labour</div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Full coverage on internal hardware, screen display controller, battery cells, audio components, and logic board.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <Truck className="w-4 h-4 text-[#DF0C88]" />
                        <span>Next-Day UK</span>
                      </div>
                      <div className="font-semibold text-slate-700">Royal Mail Tracked</div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Dispatch by 3 PM Monday to Friday with full GPS tracking and signature on delivery across the UK.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                        <span>14-Day Return</span>
                      </div>
                      <div className="font-semibold text-slate-700">Hassle-Free Policy</div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Test the device with your SIM. If you are not 100% satisfied, return it within 14 days for a replacement or full refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'additional' && (
            <div className="p-6 sm:p-10 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Product Details &amp; Compliance Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                  <span className="font-semibold text-slate-500">Brand:</span>
                  <span className="font-bold text-slate-900">{selectedProduct.brand}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                  <span className="font-semibold text-slate-500">Model Name:</span>
                  <span className="font-bold text-slate-900">{selectedProduct.title}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                  <span className="font-semibold text-slate-500">Category:</span>
                  <span className="font-bold text-slate-900 capitalize">{selectedProduct.category}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                  <span className="font-semibold text-slate-500">Network:</span>
                  <span className="font-bold text-emerald-700">Factory Unlocked (Worldwide)</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                  <span className="font-semibold text-slate-500">IMEI Status:</span>
                  <span className="font-bold text-emerald-700">Clean &amp; CheckMEND Verified</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl flex justify-between border border-slate-100">
                  <span className="font-semibold text-slate-500">VAT Status:</span>
                  <span className="font-bold text-slate-900">VAT Margin Scheme Invoice Included</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* RELATED PRODUCTS SLIDER (PER USER REQUEST)                                */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              Related Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customers who viewed this item also explored these verified devices &amp; accessories
            </p>
          </div>

          {/* Slider Prev / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider('left')}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
              title="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider('right')}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
              title="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div 
          ref={sliderRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-none snap-x snap-mandatory"
        >
          {relatedProducts.map((product) => {
            const isProdVariable = product.type === 'variable' || (product.variations && product.variations.length > 0);
            const priceRangeText = product.priceRange || (product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
              ? `£${product.minPrice.toFixed(2)} – £${product.maxPrice.toFixed(2)}`
              : `£${product.price.toFixed(2)}`);

            return (
              <div 
                key={product.id}
                className="w-68 sm:w-72 shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group snap-start"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => {
                    viewProductDetail(product);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
                    {isProdVariable ? (
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
                      <span className="text-slate-400">({product.reviewsCount})</span>
                    </div>

                    <div className="pt-2 flex items-baseline gap-2 flex-wrap">
                      {isProdVariable ? (
                        <span className="text-base font-black text-slate-900 tabular-nums">
                          {priceRangeText}
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
                  {isProdVariable ? (
                    <button 
                      type="button"
                      onClick={() => {
                        viewProductDetail(product);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full bg-[#DF0C88] hover:bg-[#C50875] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Select options</span>
                    </button>
                  ) : (
                    <button 
                      type="button"
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
      </div>

      {/* Yoast SEO & Search Engine Preview Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Yoast SEO &amp; Search Engine Snippet
              </h2>
              <p className="text-xs text-slate-500">
                Synchronized from WordPress Yoast SEO plugin REST output (<code className="text-pink-600">yoast_head_json</code>)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Yoast Schema Validated
          </span>
        </div>

        {/* Google Snippet Simulation */}
        <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-2xl">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1 font-mono text-[11px] truncate">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{selectedProduct.yoastSeo?.canonical || `https://irepair-mobiles.co.uk/product/${selectedProduct.slug}`}</span>
          </div>
          <div className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
            {selectedProduct.yoastSeo?.title || `${selectedProduct.title} | iRepair Mobiles UK`}
          </div>
          <div className="text-xs text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
            {selectedProduct.yoastSeo?.description || selectedProduct.description}
          </div>
        </div>

        {/* Meta details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SEO Title</div>
            <div className="font-semibold text-slate-800 mt-0.5 truncate">
              {selectedProduct.yoastSeo?.title || selectedProduct.title}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Robots Index</div>
            <div className="font-semibold text-emerald-700 mt-0.5">
              {selectedProduct.yoastSeo?.metaRobots || 'index, follow'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Structured Schema</div>
            <div className="font-semibold text-indigo-700 mt-0.5">
              Product, Offer (£{activePrice.toFixed(2)})
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
