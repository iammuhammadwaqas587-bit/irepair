import { Product, WordPressCategory, WordPressConfig, ProductCondition, YoastSeoData } from '../types';

const WP_CONFIG_STORAGE_KEY = 'irepair_wp_config_v1';
const WP_PRODUCTS_STORAGE_KEY = 'irepair_wp_products_v1';
const WP_CATEGORIES_STORAGE_KEY = 'irepair_wp_categories_v1';

export const DEFAULT_WP_CONFIG: WordPressConfig = {
  baseUrl: (import.meta as any).env?.VITE_WP_URL || 'https://irepair-mobiles.co.uk',
  consumerKey: (import.meta as any).env?.VITE_WC_CONSUMER_KEY || '',
  consumerSecret: (import.meta as any).env?.VITE_WC_CONSUMER_SECRET || '',
  useProxy: false,
  autoSync: false,
  lastSyncedAt: undefined,
};

// Retrieve stored configuration
export function getStoredWpConfig(): WordPressConfig {
  try {
    const raw = localStorage.getItem(WP_CONFIG_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_WP_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to read WordPress config from localStorage:', err);
  }
  return DEFAULT_WP_CONFIG;
}

// Save configuration to localStorage
export function saveStoredWpConfig(config: WordPressConfig): void {
  try {
    localStorage.setItem(WP_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save WordPress config to localStorage:', err);
  }
}

// Retrieve cached products
export function getStoredWpProducts(): Product[] | null {
  try {
    const raw = localStorage.getItem(WP_PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read products from localStorage:', err);
  }
  return null;
}

// Save cached products
export function saveStoredWpProducts(products: Product[]): void {
  try {
    localStorage.setItem(WP_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

// Retrieve cached categories
export function getStoredWpCategories(): WordPressCategory[] | null {
  try {
    const raw = localStorage.getItem(WP_CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read categories from localStorage:', err);
  }
  return null;
}

// Save cached categories
export function saveStoredWpCategories(categories: WordPressCategory[]): void {
  try {
    localStorage.setItem(WP_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage:', err);
  }
}

// Helper to sanitize base URL
function cleanUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

// Helper to strip HTML tags
function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

// Build URL with auth credentials
function buildWooCommerceUrl(baseUrl: string, endpoint: string, config: WordPressConfig): string {
  const cleanBase = cleanUrl(baseUrl);
  const target = `${cleanBase}/wp-json/wc/v3/${endpoint.replace(/^\/+/, '')}`;
  const url = new URL(target);

  if (config.consumerKey && config.consumerSecret) {
    url.searchParams.set('consumer_key', config.consumerKey.trim());
    url.searchParams.set('consumer_secret', config.consumerSecret.trim());
  }

  const finalUrl = url.toString();
  if (config.useProxy) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(finalUrl)}`;
  }
  return finalUrl;
}

// Parse Yoast SEO metadata from WooCommerce product payload
export function parseYoastSeo(wpProduct: any): YoastSeoData | undefined {
  const yoastHead = wpProduct.yoast_head_json || null;

  if (yoastHead) {
    return {
      title: yoastHead.title || wpProduct.name,
      description: yoastHead.description || stripHtml(wpProduct.short_description) || stripHtml(wpProduct.description)?.substring(0, 160),
      canonical: yoastHead.canonical || wpProduct.permalink,
      ogTitle: yoastHead.og_title || yoastHead.title || wpProduct.name,
      ogDescription: yoastHead.og_description || yoastHead.description,
      ogImage: yoastHead.og_image?.[0]?.url || wpProduct.images?.[0]?.src,
      twitterTitle: yoastHead.twitter_title,
      twitterDescription: yoastHead.twitter_description,
      schema: yoastHead.schema,
      focusKeyword: yoastHead.focuskw || undefined,
      metaRobots: yoastHead.robots ? Object.values(yoastHead.robots).join(', ') : 'index, follow',
    };
  }

  // Fallback if Yoast REST API output is not present
  return {
    title: `${wpProduct.name} | iRepair Mobiles`,
    description: stripHtml(wpProduct.short_description) || stripHtml(wpProduct.description)?.substring(0, 155),
    canonical: wpProduct.permalink,
    ogTitle: wpProduct.name,
    ogDescription: stripHtml(wpProduct.short_description),
    ogImage: wpProduct.images?.[0]?.src,
    metaRobots: 'index, follow',
  };
}

// Normalise WooCommerce product into frontend Product model
export function normalizeWooCommerceProduct(wp: any): Product {
  // Determine condition
  let condition: ProductCondition = 'Refurbished - Pristine (Grade A)';
  const lowerName = (wp.name || '').toLowerCase();
  const lowerDesc = ((wp.short_description || '') + ' ' + (wp.description || '')).toLowerCase();

  if (lowerName.includes('new') || lowerDesc.includes('brand new')) {
    condition = 'Brand New';
  } else if (lowerName.includes('grade b') || lowerDesc.includes('grade b') || lowerName.includes('good condition')) {
    condition = 'Refurbished - Excellent (Grade B)';
  }

  // Determine Brand
  let brand = 'iRepair';
  if (lowerName.includes('iphone') || lowerName.includes('apple') || lowerName.includes('macbook') || lowerName.includes('ipad')) {
    brand = 'Apple';
  } else if (lowerName.includes('samsung') || lowerName.includes('galaxy')) {
    brand = 'Samsung';
  } else if (lowerName.includes('pixel') || lowerName.includes('google')) {
    brand = 'Google';
  } else if (lowerName.includes('dell')) {
    brand = 'Dell';
  } else if (lowerName.includes('hp')) {
    brand = 'HP';
  } else if (lowerName.includes('lenovo')) {
    brand = 'Lenovo';
  }

  // Determine Category slug
  let categorySlug = 'smartphones';
  if (wp.categories && Array.isArray(wp.categories) && wp.categories.length > 0) {
    const primaryCat = wp.categories[0].slug.toLowerCase();
    if (primaryCat.includes('laptop') || primaryCat.includes('macbook')) {
      categorySlug = 'laptops';
    } else if (primaryCat.includes('phone') || primaryCat.includes('smartphone')) {
      categorySlug = 'smartphones';
    } else if (primaryCat.includes('access') || primaryCat.includes('charger') || primaryCat.includes('case') || primaryCat.includes('cable')) {
      categorySlug = 'accessories';
    } else if (primaryCat.includes('tablet') || primaryCat.includes('ipad')) {
      categorySlug = 'tablets';
    } else {
      categorySlug = primaryCat;
    }
  }

  // Parse images
  const images = (wp.images || []).map((img: any) => img.src).filter(Boolean);
  const defaultImage = images[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800';

  // Parse price
  const price = parseFloat(wp.price || wp.regular_price || '0') || 0;
  const regularPrice = wp.regular_price ? parseFloat(wp.regular_price) : undefined;

  // Extract storage variants if available in attributes
  let storageVariants: string[] = [];
  let colorVariants: { name: string; hex: string }[] = [];

  if (Array.isArray(wp.attributes)) {
    const storageAttr = wp.attributes.find((a: any) => a.name?.toLowerCase().includes('storage') || a.name?.toLowerCase().includes('capacity'));
    if (storageAttr && Array.isArray(storageAttr.options)) {
      storageVariants = storageAttr.options;
    }
    const colorAttr = wp.attributes.find((a: any) => a.name?.toLowerCase().includes('color') || a.name?.toLowerCase().includes('colour'));
    if (colorAttr && Array.isArray(colorAttr.options)) {
      colorVariants = colorAttr.options.map((opt: string) => ({
        name: opt,
        hex: opt.toLowerCase().includes('black') ? '#0f172a' : opt.toLowerCase().includes('white') ? '#f8fafc' : '#DF0C88',
      }));
    }
  }

  // Specifications
  const specs: Record<string, string> = {
    Warranty: '12 Months Express Warranty',
    Condition: condition,
    Delivery: 'Free Next-Day UK Tracked',
  };
  if (wp.sku) specs['SKU'] = wp.sku;
  if (wp.stock_status) specs['Availability'] = wp.stock_status === 'instock' ? 'In Stock (Ready to Ship)' : 'Out of Stock';

  return {
    id: `wp-${wp.id}`,
    wpId: wp.id,
    title: wp.name,
    slug: wp.slug || `product-${wp.id}`,
    category: categorySlug,
    brand,
    price,
    regularPrice: regularPrice && regularPrice > price ? regularPrice : undefined,
    condition,
    inStock: wp.stock_status === 'instock',
    stockCount: typeof wp.stock_quantity === 'number' ? wp.stock_quantity : (wp.stock_status === 'instock' ? 12 : 0),
    rating: parseFloat(wp.average_rating || '5.0') || 5.0,
    reviewsCount: wp.rating_count || 12,
    featured: Boolean(wp.featured),
    image: defaultImage,
    gallery: images.length > 1 ? images.slice(1) : undefined,
    description: stripHtml(wp.short_description) || stripHtml(wp.description) || 'Premium tech device verified by iRepair UK technicians.',
    specifications: specs,
    warrantyMonths: 12,
    permalink: wp.permalink,
    variants: storageVariants.length > 0 || colorVariants.length > 0 ? {
      storage: storageVariants.length > 0 ? storageVariants : undefined,
      colors: colorVariants.length > 0 ? colorVariants : undefined,
    } : undefined,
    yoastSeo: parseYoastSeo(wp),
  };
}

// Fetch Categories from WooCommerce
export async function fetchWordPressCategories(config: WordPressConfig): Promise<WordPressCategory[]> {
  const url = buildWooCommerceUrl(config.baseUrl, 'products/categories?per_page=100&hide_empty=false', config);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }

  const rawCats = await response.json();
  if (!Array.isArray(rawCats)) {
    throw new Error('Invalid categories response from WooCommerce');
  }

  const categories: WordPressCategory[] = rawCats.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent,
    description: cat.description,
    count: cat.count,
    image: cat.image?.src || undefined,
  }));

  saveStoredWpCategories(categories);
  return categories;
}

// Fetch Products from WooCommerce with Yoast SEO
export async function fetchWordPressProducts(config: WordPressConfig): Promise<{
  products: Product[];
  categories: WordPressCategory[];
  rawCount: number;
  hasYoastSeo: boolean;
}> {
  const url = buildWooCommerceUrl(config.baseUrl, 'products?per_page=100&status=publish', config);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401 Unauthorized: Check your WooCommerce Consumer Key and Consumer Secret.');
    }
    if (response.status === 403) {
      throw new Error('403 Forbidden: WooCommerce REST API key does not have permission or IP is restricted.');
    }
    throw new Error(`WordPress API returned status ${response.status}: ${response.statusText}`);
  }

  const rawList = await response.json();
  if (!Array.isArray(rawList)) {
    throw new Error('Expected an array of products from WooCommerce REST API');
  }

  const hasYoastSeo = rawList.some((item: any) => Boolean(item.yoast_head_json || item.yoast_head));
  const products: Product[] = rawList.map(normalizeWooCommerceProduct);

  // Fetch categories concurrently if possible
  let categories: WordPressCategory[] = [];
  try {
    categories = await fetchWordPressCategories(config);
  } catch (catErr) {
    console.warn('Could not fetch categories, extracting from products:', catErr);
    // Extract unique categories from products
    const catMap = new Map<string, WordPressCategory>();
    rawList.forEach((item: any) => {
      if (Array.isArray(item.categories)) {
        item.categories.forEach((c: any) => {
          if (!catMap.has(c.slug)) {
            catMap.set(c.slug, {
              id: c.id,
              name: c.name,
              slug: c.slug,
              parent: 0,
            });
          }
        });
      }
    });
    categories = Array.from(catMap.values());
  }

  // Update storage & last synced timestamp
  saveStoredWpProducts(products);
  saveStoredWpCategories(categories);
  const updatedConfig: WordPressConfig = {
    ...config,
    lastSyncedAt: new Date().toISOString(),
  };
  saveStoredWpConfig(updatedConfig);

  return {
    products,
    categories,
    rawCount: rawList.length,
    hasYoastSeo,
  };
}

// Test Connection Diagnostic
export async function testWordPressConnection(config: WordPressConfig): Promise<{
  success: boolean;
  message: string;
  hasWooCommerce: boolean;
  hasYoastSeo: boolean;
  productCount?: number;
}> {
  try {
    const url = buildWooCommerceUrl(config.baseUrl, 'products?per_page=1', config);
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}: ${response.statusText}. Please verify your domain, Consumer Key and Secret.`,
        hasWooCommerce: false,
        hasYoastSeo: false,
      };
    }

    const data = await response.json();
    const hasYoast = Array.isArray(data) && data.length > 0 && Boolean(data[0].yoast_head_json);
    const totalHeaders = response.headers.get('x-wp-total');
    const count = totalHeaders ? parseInt(totalHeaders, 10) : (Array.isArray(data) ? data.length : 0);

    return {
      success: true,
      message: 'Successfully connected to WooCommerce REST API!',
      hasWooCommerce: true,
      hasYoastSeo: hasYoast,
      productCount: count,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network connection failed (likely CORS or unreachable URL).',
      hasWooCommerce: false,
      hasYoastSeo: false,
    };
  }
}
