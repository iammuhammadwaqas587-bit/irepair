/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { BookRepairView } from './components/BookRepairView';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { ServicesView } from './components/ServicesView';
import { LocationsView } from './components/LocationsView';
import { TrackRepairView } from './components/TrackRepairView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { CheckoutView } from './components/CheckoutView';
import { PoliciesView } from './components/PoliciesView';
import { CartDrawer } from './components/CartDrawer';
import { WooCommerceModal } from './components/WooCommerceModal';
import { WordPressSyncModal } from './components/WordPressSyncModal';
import { CheckCircle2, AlertCircle, Info, Wrench, Phone } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, notification, startRepairBooking } = useApp();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'book-repair':
        return <BookRepairView />;
      case 'shop':
        return <ShopView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'services':
        return <ServicesView />;
      case 'locations':
        return <LocationsView />;
      case 'track-repair':
        return <TrackRepairView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'checkout':
        return <CheckoutView />;
      case 'warranty':
        return <PoliciesView type="warranty" />;
      case 'terms':
        return <PoliciesView type="terms" />;
      case 'privacy':
        return <PoliciesView type="privacy" />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
            notification.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : notification.type === 'info'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-emerald-900 text-white border-emerald-800'
          }`}>
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Dynamic View Body */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* WooCommerce REST API payload inspector */}
      <WooCommerceModal />

      {/* WordPress & WooCommerce Live Product Sync with Yoast SEO */}
      <WordPressSyncModal />

      {/* Floating Action Button (Quick Repair Booking on Mobile) */}
      <div className="fixed bottom-4 left-4 z-30 lg:hidden">
        <button
          onClick={() => startRepairBooking()}
          className="bg-[#DF0C88] hover:bg-[#C50875] text-white shadow-xl px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 border border-[#DF0C88]/50 active:scale-95 transition-all"
        >
          <Wrench className="w-4 h-4" />
          <span>Book Repair</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
