import React, { useState } from 'react';
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
  Search,
  CheckCircle2
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProduct, 
    setCurrentPage, 
    addToCart, 
    startRepairBooking 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState<string>(
    selectedProduct?.variants?.storage?.[0] || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedProduct?.variants?.colors?.[0]?.name || ''
  );

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600 mb-4">No product selected.</p>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="px-4 py-2 bg-[#DF0C88] text-white rounded-lg text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedColor, selectedStorage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      
      {/* Breadcrumb / Back button */}
      <button 
        onClick={() => setCurrentPage('shop')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tech & Accessories</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden aspect-4/3 relative">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-lg">
              {selectedProduct.condition}
            </div>
            {selectedProduct.regularPrice && (
              <div className="absolute top-4 right-4 bg-[#DF0C88] text-white text-xs font-bold px-3 py-1 rounded-lg">
                Save £{(selectedProduct.regularPrice - selectedProduct.price).toFixed(0)}
              </div>
            )}
          </div>
        </div>

        {/* Right: Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#DF0C88]">
              {selectedProduct.brand} · In Stock
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {selectedProduct.title}
            </h1>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{selectedProduct.rating}</span>
              <span className="text-xs text-slate-400">({selectedProduct.reviewsCount} verified reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              £{selectedProduct.price.toFixed(2)}
            </span>
            {selectedProduct.regularPrice && (
              <span className="text-sm text-slate-400 line-through tabular-nums">
                £{selectedProduct.regularPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-slate-500">VAT Included</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Variants: Storage */}
          {selectedProduct.variants?.storage && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Storage Capacity: <span className="text-[#DF0C88]">{selectedStorage}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variants.storage.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedStorage(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedStorage === size
                        ? 'border-[#DF0C88] bg-pink-50 text-pink-900 ring-2 ring-[#DF0C88]/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variants: Colors */}
          {selectedProduct.variants?.colors && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Colour Finish: <span className="text-slate-600">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {selectedProduct.variants.colors.map(col => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === col.name ? 'border-[#DF0C88] scale-110 shadow-sm' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor === col.name && (
                      <Check className={`w-4 h-4 ${col.hex === '#1e1e20' || col.hex === '#1a1a1a' ? 'text-white' : 'text-slate-900'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 w-32 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-bold text-sm text-slate-900 tabular-nums">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#DF0C88] hover:bg-[#C50875] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#DF0C88]/20 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart · £{(selectedProduct.price * quantity).toFixed(2)}</span>
            </button>
          </div>

          {/* Quick Repair Alternative Action */}
          <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">Already own this device?</div>
              <div className="text-slate-500">We offer screen, battery & camera repairs from £39.</div>
            </div>
            <button 
              onClick={() => startRepairBooking({ category: selectedProduct.category === 'laptops' ? 'laptop' : 'smartphone' })}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3.5 rounded-lg shrink-0 flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5 text-[#DF0C88]" />
              <span>Book Repair</span>
            </button>
          </div>

          {/* Guarantees Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{selectedProduct.warrantyMonths} Months Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#DF0C88] shrink-0" />
              <span>Free Next-Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>14-Day Free Returns</span>
            </div>
          </div>
        </div>

      </div>

      {/* Technical Specifications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Technical Specifications & Testing Checklist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {Object.entries(selectedProduct.specifications).map(([key, val]) => (
            <div key={key} className="p-3 bg-slate-50 rounded-xl flex justify-between gap-4 border border-slate-100">
              <span className="font-semibold text-slate-500">{key}:</span>
              <span className="font-medium text-slate-900 text-right">{val}</span>
            </div>
          ))}
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
              Product, Offer (£{selectedProduct.price})
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
