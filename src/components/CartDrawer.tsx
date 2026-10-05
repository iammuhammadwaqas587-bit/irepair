import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    setCurrentPage 
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 50.00;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentPage('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#DF0C88]" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Your Shopping Bag ({cart.length})
              </h2>
            </div>
            <button 
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-pink-50/70 border-b border-pink-100 p-3.5 px-5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-800 mb-1.5">
              <Truck className="w-4 h-4 text-[#DF0C88]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#DF0C88] font-semibold">£{remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE UK Tracked Delivery</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  🎉 You have unlocked FREE UK Tracked Delivery!
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-pink-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#DF0C88] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-heading">Your cart is currently empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Browse our certified refurbished iPhones, Samsung Galaxy, MacBooks, or fast chargers.
                </p>
                <button 
                  onClick={() => { setIsCartDrawerOpen(false); setCurrentPage('shop'); }}
                  className="mt-5 px-5 py-2.5 bg-[#DF0C88] hover:bg-[#C50875] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Shop Refurbished Devices & Tech
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="py-4 flex gap-4">
                  <img 
                    src={item.product.image} 
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 bg-slate-50 shrink-0" 
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-[#DF0C88] transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 mt-1">
                        {item.selectedStorage && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            {item.selectedStorage}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                            {item.selectedColor}
                          </span>
                        )}
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-700 font-medium">
                          {item.product.warrantyMonths}M Warranty
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        £{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">£{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard UK Shipping</span>
                  <span className="text-slate-900 font-medium">
                    {cartSubtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      '£4.95'
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Incl. VAT</span>
                  <span className="text-base text-[#DF0C88] tabular-nums">
                    £{(cartSubtotal + (cartSubtotal >= freeShippingThreshold ? 0 : 4.95)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Encrypted checkout · 14-day money-back guarantee</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-[#DF0C88] hover:bg-[#C50875] text-white font-semibold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => { setIsCartDrawerOpen(false); setCurrentPage('shop'); }}
                className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
