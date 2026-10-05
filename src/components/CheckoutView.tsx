import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  Code,
  Lock,
  ShoppingBag
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    clearCart, 
    setCurrentPage, 
    showNotification,
    setShowWooModal,
    setWooCommercePayload
  } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'klarna' | 'collection'>('card');
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const shippingCost = cartSubtotal >= 50 ? 0 : deliveryMethod === 'express' ? 6.95 : 4.95;
  const totalAmount = cartSubtotal + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !address1 || !postcode) {
      showNotification('Please fill in required checkout fields', 'error');
      return;
    }

    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const wcOrderPayload = {
      id: orderNumber,
      status: "processing",
      currency: "GBP",
      total: totalAmount.toFixed(2),
      payment_method: paymentMethod,
      payment_method_title: paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'collection' ? 'Pay upon Collection' : 'Klarna',
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        city: city,
        postcode: postcode,
        country: "GB",
        email: email,
        phone: phone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address1,
        city: city,
        postcode: postcode,
        country: "GB",
      },
      line_items: cart.map(item => ({
        product_id: item.product.id,
        name: item.product.title,
        quantity: item.quantity,
        subtotal: (item.product.price * item.quantity).toFixed(2),
        total: (item.product.price * item.quantity).toFixed(2),
        variation_id: 0,
        meta_data: [
          ...(item.selectedStorage ? [{ key: "Storage", value: item.selectedStorage }] : []),
          ...(item.selectedColor ? [{ key: "Color", value: item.selectedColor }] : []),
          { key: "Warranty", value: `${item.product.warrantyMonths} Months` },
        ],
      })),
      shipping_lines: [
        {
          method_id: deliveryMethod,
          method_title: deliveryMethod === 'express' ? 'Royal Mail Tracked 24' : 'Royal Mail Tracked 48',
          total: shippingCost.toFixed(2),
        }
      ]
    };

    setWooCommercePayload(wcOrderPayload);
    setOrderComplete({
      orderNumber,
      total: totalAmount,
      email,
      date: new Date().toLocaleDateString('en-GB'),
      items: [...cart],
    });
    clearCart();
    showNotification(`Order #${orderNumber} placed successfully!`);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Confirmed!
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Thank You, {firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Order <strong>#{orderComplete.orderNumber}</strong> has been received and is being prepared for dispatch. Confirmation sent to <strong>{orderComplete.email}</strong>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-4 text-xs shadow-sm">
          <div className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-200">
            Order Summary
          </div>
          {orderComplete.items.map((it: any, idx: number) => (
            <div key={idx} className="flex justify-between py-1">
              <div>
                <span className="font-semibold text-slate-800">{it.product.title}</span>
                <span className="text-slate-400 ml-2">x{it.quantity}</span>
              </div>
              <span className="font-bold text-slate-900 tabular-nums">
                £{((it.unitPrice ?? it.product.price) * it.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
            <span>Total Paid</span>
            <span className="text-[#DF0C88] tabular-nums">£{orderComplete.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => setShowWooModal(true)}
            className="px-6 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Code className="w-4 h-4 text-purple-600" />
            <span>View WooCommerce Order JSON</span>
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setCurrentPage('shop')}
          className="px-5 py-2.5 bg-[#DF0C88] hover:bg-[#C50875] text-white rounded-xl text-xs font-semibold"
        >
          Browse Refurbished Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      <button 
        onClick={() => setCurrentPage('shop')}
        className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shop</span>
      </button>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Secure Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            WooCommerce Compatible Order Processing
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Billing, Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          
          {/* Customer / Billing Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              1. Customer & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                <input 
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                <input 
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.smith@example.co.uk"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input 
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 07712 345678"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
                <input 
                  type="text"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  placeholder="House number & street name"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Town / City *</label>
                <input 
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Reading"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postcode *</label>
                <input 
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. RG1 2AA"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#DF0C88] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              2. Delivery Speed
            </h3>

            <div className="space-y-2">
              <label 
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer text-xs ${
                  deliveryMethod === 'standard' ? 'border-[#DF0C88] bg-pink-50/40 ring-1 ring-[#DF0C88]/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === 'standard'} 
                    onChange={() => setDeliveryMethod('standard')}
                    className="text-[#DF0C88] focus:ring-[#DF0C88]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Royal Mail Tracked 48 (2-3 Business Days)</div>
                    <div className="text-slate-500 text-[11px]">Free on orders over £50</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums">
                  {cartSubtotal >= 50 ? 'FREE' : '£4.95'}
                </span>
              </label>

              <label 
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer text-xs ${
                  deliveryMethod === 'express' ? 'border-[#DF0C88] bg-pink-50/40 ring-1 ring-[#DF0C88]/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="delivery" 
                    checked={deliveryMethod === 'express'} 
                    onChange={() => setDeliveryMethod('express')}
                    className="text-[#DF0C88] focus:ring-[#DF0C88]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Royal Mail Tracked 24 (Next Business Day)</div>
                    <div className="text-slate-500 text-[11px]">Fastest priority handling</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums">
                  {cartSubtotal >= 50 ? 'FREE' : '£6.95'}
                </span>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              3. Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'card', label: 'Credit Card', sub: 'Visa / MC' },
                { id: 'paypal', label: 'PayPal', sub: 'Instant' },
                { id: 'klarna', label: 'Klarna', sub: 'Pay in 3' },
                { id: 'collection', label: 'In Store', sub: 'Pay on Pick Up' },
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`p-3 rounded-xl border text-center text-xs transition-colors ${
                    paymentMethod === p.id 
                      ? 'border-[#DF0C88] bg-pink-50/60 font-bold text-pink-900 ring-2 ring-[#DF0C88]/20' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{p.sub}</div>
                </button>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="4532 •••• •••• 8921" 
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#DF0C88]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#DF0C88]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVC / CVV</label>
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#DF0C88]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#DF0C88] hover:bg-[#C50875] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[#DF0C88]/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>Place Order · £{totalAmount.toFixed(2)}</span>
            </button>
          </div>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold font-heading text-white">
              Order Summary ({cart.length} items)
            </h3>
          </div>

          <div className="space-y-4 divide-y divide-slate-800/80 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, index) => (
              <div key={index} className="pt-3 first:pt-0 flex gap-3 text-xs">
                <img 
                  src={item.product.image} 
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700 shrink-0" 
                />
                <div className="flex-1">
                  <div className="font-semibold text-white line-clamp-1">{item.product.title}</div>
                  <div className="text-slate-400 text-[11px]">
                    Qty: {item.quantity} · {item.selectedStorage || item.product.condition}
                  </div>
                  <div className="text-emerald-400 text-[10px]">
                    {item.product.warrantyMonths} Months Guarantee
                  </div>
                </div>
                <div className="font-bold text-white tabular-nums">
                  £{((item.unitPrice ?? item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-semibold tabular-nums">£{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-white font-semibold tabular-nums">
                {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between font-extrabold text-base text-white">
              <span>Total Incl. VAT</span>
              <span className="text-[#DF0C88] tabular-nums">£{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>12-Month Hardware Warranty Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#DF0C88] shrink-0" />
              <span>Tracked UK Royal Mail Dispatched in 24 Hours</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
