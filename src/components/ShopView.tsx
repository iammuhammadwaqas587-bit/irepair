import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Star, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal,
  Code,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const { 
    addToCart, 
    viewProductDetail, 
    setShowWooModal, 
    setWooCommercePayload,
    shopBrandFilter,
    setShopBrandFilter,
    shopConditionFilter,
    setShopConditionFilter,
    products,
    categories,
    setShowWpSyncModal,
    wpSyncStatus
  } = useApp();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>(shopConditionFilter || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(shopBrandFilter || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Sync external filters from mega menu
  React.useEffect(() => {
    if (shopBrandFilter && shopBrandFilter !== 'all') {
      setSelectedBrand(shopBrandFilter);
    }
  }, [shopBrandFilter]);

  React.useEffect(() => {
    if (shopConditionFilter && shopConditionFilter !== 'all') {
      setSelectedCondition(shopConditionFilter);
    }
  }, [shopConditionFilter]);

  // Filter logic with dynamic products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all') {
        const prodCat = (product.category || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        if (selCat === 'smartphones') {
          if (!prodCat.includes('smartphone') && !prodCat.includes('phone')) return false;
        } else if (selCat === 'laptops') {
          if (!prodCat.includes('laptop') && !prodCat.includes('macbook')) return false;
        } else if (selCat === 'accessories') {
          if (!prodCat.includes('access') && !prodCat.includes('charger') && !prodCat.includes('case') && !prodCat.includes('audio')) return false;
        } else {
          if (prodCat !== selCat && !prodCat.includes(selCat)) return false;
        }
      }

      // Condition filter
      if (selectedCondition !== 'all') {
        if (selectedCondition === 'refurbished' && !product.condition.includes('Refurbished')) return false;
        if (selectedCondition === 'new' && product.condition !== 'Brand New') return false;
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        if (product.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesSeo = product.yoastSeo?.focusKeyword?.toLowerCase().includes(query) || product.yoastSeo?.title?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesSeo) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low' || sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-high' || sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedCondition, selectedBrand, searchQuery, sortBy]);

  const handleInspectWooProducts = () => {
    const samplePayload = {
      description: "WooCommerce REST API Products Query",
      endpoint: "GET /wp-json/wc/v3/products",
      params: {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        status: "publish",
        stock_status: "instock",
      },
      sample_synced_products: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.title,
        type: "simple",
        regular_price: p.regularPrice?.toString() || p.price.toString(),
        sale_price: p.regularPrice ? p.price.toString() : "",
        stock_quantity: p.stockCount,
        categories: [{ name: p.category }],
        attributes: [
          { name: "Condition", options: [p.condition] },
          { name: "Warranty", options: [`${p.warrantyMonths} Months`] },
        ],
        yoast_seo: p.yoastSeo ? {
          title: p.yoastSeo.title,
          description: p.yoastSeo.description,
          canonical: p.yoastSeo.canonical
        } : undefined
      })),
    };
    setWooCommercePayload(samplePayload);
    setShowWooModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Top Banner / Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DF0C88]" />
            <span>Certified 12-Month Guarantee on All Devices</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white">
            Mobile Phones - Certified Refurbished Store
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Shop certified Grade-A Apple iPhones, Samsung Galaxy, and Google Pixel. Thoroughly tested with 70-point diagnostics, pristine displays, healthy batteries, and backed by a 12-month UK warranty.
          </p>
        </div>

        <div className="absolute top-6 right-6 hidden md:flex items-center gap-2.5">
          <button 
            onClick={() => setShowWpSyncModal(true)}
            className="flex items-center gap-1.5 bg-[#DF0C88] hover:bg-[#C50875] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            title="Configure WordPress & WooCommerce credentials"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>WordPress &amp; Yoast Sync</span>
          </button>
          <button 
            onClick={handleInspectWooProducts}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4 text-purple-400" />
            <span>WooCommerce REST</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 self-start">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-heading">
              <SlidersHorizontal className="w-4 h-4 text-[#DF0C88]" />
              <span>Filters</span>
            </div>
            {(selectedCategory !== 'all' || selectedCondition !== 'all' || selectedBrand !== 'all') && (
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="text-[11px] text-[#DF0C88] font-semibold hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Search Catalog</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Model, brand, keyword..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88] focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter - Dynamically populated from WordPress categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">Category</label>
              <button
                onClick={() => setShowWpSyncModal(true)}
                className="text-[10px] text-[#DF0C88] hover:underline flex items-center gap-0.5 cursor-pointer"
                title="Manage WordPress Categories"
              >
                <span>WP Categories</span>
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all' 
                    ? 'bg-pink-50 text-[#DF0C88] font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Products</span>
                <span className="text-[10px] text-slate-400 font-bold">{products.length}</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.slug.toLowerCase() 
                      ? 'bg-pink-50 text-[#DF0C88] font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="capitalize">{cat.name}</span>
                  {typeof cat.count === 'number' && (
                    <span className="text-[10px] text-slate-400 font-bold">{cat.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Condition</label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Conditions' },
                { id: 'refurbished', label: 'Pristine Refurbished (Grade A)' },
                { id: 'new', label: 'Brand New In Box' },
              ].map(cond => (
                <button
                  key={cond.id}
                  onClick={() => setSelectedCondition(cond.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCondition === cond.id 
                      ? 'bg-pink-50 text-[#DF0C88] font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cond.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Brand</label>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Apple', 'Samsung', 'iRepair Tech', 'SoundPulse'].map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedBrand === brand 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {brand === 'all' ? 'All Brands' : brand}
                </button>
              ))}
            </div>
          </div>

          {/* Trust callout */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>70-Point Diagnostics Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free Next-Day Tracked UK Delivery over £50</span>
            </div>
          </div>
        </div>

        {/* Right Side: Products Grid & Sort */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> verified items
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#DF0C88]"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">No tech items match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or search terms to browse all refurbished phones and accessories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#DF0C88] text-white text-xs font-semibold rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
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
                      <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {product.condition}
                      </div>
                      {product.regularPrice && (
                        <div className="absolute top-2.5 right-2.5 bg-[#DF0C88] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Save £{(product.regularPrice - product.price).toFixed(0)}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] font-semibold text-[#DF0C88] uppercase tracking-wider">
                        {product.brand}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#DF0C88] transition-colors">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">{product.rating}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                          £{product.price.toFixed(2)}
                        </span>
                        {product.regularPrice && (
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            £{product.regularPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-emerald-700 font-medium">
                        ✓ In Stock · {product.warrantyMonths} Months Warranty
                      </div>

                      {product.yoastSeo && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Yoast SEO</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-slate-900 hover:bg-[#DF0C88] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
