import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PageType, DeviceCategory, Product, CartItem, RepairBooking, WordPressCategory, WordPressConfig } from '../types';
import { PRODUCTS, DEMO_BOOKINGS } from '../data/mockData';
import { 
  getStoredWpConfig, 
  saveStoredWpConfig, 
  getStoredWpProducts, 
  getStoredWpCategories, 
  fetchWordPressProducts 
} from '../services/wordpressApi';

const DEFAULT_CATEGORIES: WordPressCategory[] = [
  { id: 1, name: 'Smartphones', slug: 'smartphones', parent: 0, count: 8 },
  { id: 2, name: 'Laptops', slug: 'laptops', parent: 0, count: 6 },
  { id: 3, name: 'Accessories', slug: 'accessories', parent: 0, count: 12 },
  { id: 4, name: 'Tablets', slug: 'tablets', parent: 0, count: 4 },
];

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedCategory: DeviceCategory;
  setSelectedCategory: (cat: DeviceCategory) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  selectedIssue: string;
  setSelectedIssue: (i: string) => void;
  preselectedStoreId: string;
  setPreselectedStoreId: (storeId: string) => void;
  
  // Products & Categories (Dynamic WordPress / WooCommerce)
  products: Product[];
  categories: WordPressCategory[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  // WordPress & Yoast Sync
  wpConfig: WordPressConfig;
  updateWpConfig: (cfg: WordPressConfig) => void;
  isSyncingWp: boolean;
  wpSyncStatus: { status: 'idle' | 'success' | 'error'; message?: string; lastSync?: string; error?: string };
  syncWordPressProducts: (overrideConfig?: WordPressConfig) => Promise<boolean>;
  showWpSyncModal: boolean;
  setShowWpSyncModal: (open: boolean) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, storage?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Product Detail
  selectedProduct: Product | null;
  viewProductDetail: (product: Product) => void;
  
  // Shop Filters from Mega Menu
  shopBrandFilter: string;
  setShopBrandFilter: (b: string) => void;
  shopConditionFilter: string;
  setShopConditionFilter: (c: string) => void;
  
  // Bookings & Tracking
  bookings: RepairBooking[];
  addBooking: (booking: {
    category: DeviceCategory;
    brand: string;
    model: string;
    issue: string;
    price: number;
    method: 'walk-in' | 'mail-in' | 'call-out';
    storeLocationId?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
  }) => RepairBooking;
  trackingQuery: string;
  setTrackingQuery: (q: string) => void;
  
  // Helper to start booking with preselected device/issue
  startRepairBooking: (options?: { category?: DeviceCategory; brand?: string; model?: string; issue?: string; storeId?: string }) => void;
  
  // Notifications
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // WooCommerce sync simulation
  showWooModal: boolean;
  setShowWooModal: (show: boolean) => void;
  wooCommercePayload: any;
  setWooCommercePayload: (payload: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory>('smartphone');
  const [selectedBrand, setSelectedBrand] = useState<string>('apple');
  const [selectedModel, setSelectedModel] = useState<string>('iphone-14-pro');
  const [selectedIssue, setSelectedIssue] = useState<string>('screen');
  const [preselectedStoreId, setPreselectedStoreId] = useState<string>('');

  // WordPress / WooCommerce Live Products & Categories
  const [products, setProducts] = useState<Product[]>(() => {
    return getStoredWpProducts() || PRODUCTS;
  });
  const [categories, setCategories] = useState<WordPressCategory[]>(() => {
    return getStoredWpCategories() || DEFAULT_CATEGORIES;
  });
  const [wpConfig, setWpConfig] = useState<WordPressConfig>(() => getStoredWpConfig());
  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [wpSyncStatus, setWpSyncStatus] = useState<{ status: 'idle' | 'success' | 'error'; message?: string; lastSync?: string; error?: string }>({
    status: getStoredWpProducts() ? 'success' : 'idle',
    lastSync: getStoredWpConfig()?.lastSyncedAt,
  });
  const [showWpSyncModal, setShowWpSyncModal] = useState(false);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const initialProd = getStoredWpProducts()?.[1] || PRODUCTS[0];
    return [
      {
        product: initialProd,
        quantity: 1,
      }
    ];
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || PRODUCTS[0]);
  const [shopBrandFilter, setShopBrandFilter] = useState<string>('all');
  const [shopConditionFilter, setShopConditionFilter] = useState<string>('all');
  const [bookings, setBookings] = useState<RepairBooking[]>(DEMO_BOOKINGS);
  const [trackingQuery, setTrackingQuery] = useState<string>('IRM-78241');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showWooModal, setShowWooModal] = useState(false);
  const [wooCommercePayload, setWooCommercePayload] = useState<any>(null);

  const updateWpConfig = (newCfg: WordPressConfig) => {
    setWpConfig(newCfg);
    saveStoredWpConfig(newCfg);
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const syncWordPressProducts = useCallback(async (overrideConfig?: WordPressConfig): Promise<boolean> => {
    const configToUse = overrideConfig || wpConfig;
    setIsSyncingWp(true);
    try {
      const res = await fetchWordPressProducts(configToUse);
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
        setWpSyncStatus({
          status: 'success',
          lastSync: new Date().toISOString(),
          message: `Synchronized ${res.products.length} products and ${res.categories.length} categories!`,
        });
        showNotification(
          `Successfully synced ${res.products.length} products from WordPress ${res.hasYoastSeo ? 'with Yoast SEO data!' : ''}`,
          'success'
        );
        return true;
      } else {
        setWpSyncStatus({
          status: 'error',
          error: 'No published products found in WooCommerce response.',
        });
        showNotification('No published products found in WooCommerce store', 'info');
        return false;
      }
    } catch (err: any) {
      console.error('Failed to sync products from WordPress:', err);
      const errMsg = err.message || 'Failed to connect to WordPress WooCommerce API';
      setWpSyncStatus({
        status: 'error',
        error: errMsg,
      });
      showNotification(errMsg, 'error');
      return false;
    } finally {
      setIsSyncingWp(false);
    }
  }, [wpConfig]);

  const addToCart = (product: Product, quantity = 1, color?: string, storage?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedStorage === storage && item.selectedColor === color);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedStorage === storage && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color, selectedStorage: storage }];
    });
    showNotification(`Added "${product.title}" to cart!`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showNotification('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const viewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const addBooking = (bookingData: {
    category: DeviceCategory;
    brand: string;
    model: string;
    issue: string;
    price: number;
    method: 'walk-in' | 'mail-in' | 'call-out';
    storeLocationId?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
  }): RepairBooking => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newId = `IRM-${randomDigits}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newBooking: RepairBooking = {
      ...bookingData,
      id: newId,
      createdAt: dateStr,
      status: 'received',
      estimatedCompletion: bookingData.method === 'walk-in' ? 'Within 30–45 mins upon arrival' : '24–48 hours after receiving',
      trackingNumber: newId,
    };

    setBookings(prev => [newBooking, ...prev]);
    setTrackingQuery(newId);
    return newBooking;
  };

  const startRepairBooking = (options?: { category?: DeviceCategory; brand?: string; model?: string; issue?: string; storeId?: string }) => {
    if (options?.category) setSelectedCategory(options.category);
    if (options?.brand) setSelectedBrand(options.brand);
    if (options?.model) setSelectedModel(options.model);
    if (options?.issue) setSelectedIssue(options.issue);
    if (options?.storeId) setPreselectedStoreId(options.storeId);
    setCurrentPage('book-repair');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        selectedModel,
        setSelectedModel,
        selectedIssue,
        setSelectedIssue,
        preselectedStoreId,
        setPreselectedStoreId,
        products,
        setProducts,
        categories,
        wpConfig,
        updateWpConfig,
        isSyncingWp,
        wpSyncStatus,
        syncWordPressProducts,
        showWpSyncModal,
        setShowWpSyncModal,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        selectedProduct,
        viewProductDetail,
        shopBrandFilter,
        setShopBrandFilter,
        shopConditionFilter,
        setShopConditionFilter,
        bookings,
        addBooking,
        trackingQuery,
        setTrackingQuery,
        startRepairBooking,
        notification,
        showNotification,
        showWooModal,
        setShowWooModal,
        wooCommercePayload,
        setWooCommercePayload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
