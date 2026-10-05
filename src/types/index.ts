export type PageType = 
  | 'home' 
  | 'book-repair' 
  | 'shop' 
  | 'product-detail' 
  | 'services' 
  | 'locations' 
  | 'track-repair' 
  | 'about' 
  | 'contact' 
  | 'checkout' 
  | 'terms'
  | 'privacy'
  | 'warranty';

export type DeviceCategory = 'smartphone' | 'tablet' | 'laptop' | 'smartwatch' | 'console';

export interface DeviceBrand {
  id: string;
  name: string;
  logo?: string;
  category: DeviceCategory;
}

export interface DeviceModel {
  id: string;
  brandId: string;
  name: string;
  category: DeviceCategory;
  image?: string;
  popular?: boolean;
}

export interface RepairIssue {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  iconName: string;
  popular?: boolean;
}

export type RepairMethod = 'walk-in' | 'mail-in' | 'call-out';

export interface StoreLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  features: string[];
  isExpressHub: boolean;
}

export interface RepairBooking {
  id: string; // IRM-XXXXX
  createdAt: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  issue: string;
  price: number;
  method: RepairMethod;
  storeLocationId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  passcodeProvided?: boolean;
  status: 'received' | 'diagnosing' | 'in-progress' | 'testing' | 'ready' | 'collected';
  estimatedCompletion: string;
  trackingNumber?: string;
}

export type ProductCondition = 'Brand New' | 'Refurbished - Pristine (Grade A)' | 'Refurbished - Excellent (Grade B)';

export interface YoastSeoData {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  schema?: Record<string, any>;
  focusKeyword?: string;
  metaRobots?: string;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
  count?: number;
  image?: string;
}

export interface WordPressConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  useProxy: boolean;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  regularPrice?: number;
  condition: ProductCondition;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  image: string;
  gallery?: string[];
  description: string;
  specifications: Record<string, string>;
  warrantyMonths: number;
  variants?: {
    storage?: string[];
    colors?: { name: string; hex: string }[];
  };
  wpId?: number;
  permalink?: string;
  yoastSeo?: YoastSeoData;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  deviceRepaired: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}
