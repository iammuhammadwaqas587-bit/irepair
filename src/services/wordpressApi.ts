import { Product, WordPressCategory, WordPressConfig, ProductCondition, YoastSeoData, ProductVariation, WooCommerceAttribute } from '../types';
import { LIVE_WP_PRODUCTS, LIVE_WP_CATEGORIES } from '../data/liveWordPressCatalog';
import bundledVariationsRaw from '../data/bundledVariations.json';

const bundledVariations = bundledVariationsRaw as Record<string, ProductVariation[]>;

const WP_CONFIG_STORAGE_KEY = 'irepair_wp_config_v1';
const WP_PRODUCTS_STORAGE_KEY = 'irepair_wp_products_v1';
const WP_CATEGORIES_STORAGE_KEY = 'irepair_wp_categories_v1';

export const DEFAULT_WP_CONFIG: WordPressConfig = {
  baseUrl: 'https://irepair-mobiles.co.uk',
  consumerKey: 'ck_ecb1d1380225b6f4775c5e0e8222f77178abe71d',
  consumerSecret: 'cs_7dd127f2db5a2a215dd024fe3f9b618b9e5e3e2b',
  useProxy: false,
  autoSync: true,
  lastSyncedAt: new Date().toISOString(),
};

// Retrieve stored configuration
export function getStoredWpConfig(): WordPressConfig {
  try {
    const raw = localStorage.getItem(WP_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure the user's live keys are populated if storage has empty keys
      if (!parsed.consumerKey || !parsed.consumerSecret) {
        return { ...DEFAULT_WP_CONFIG, ...parsed, consumerKey: DEFAULT_WP_CONFIG.consumerKey, consumerSecret: DEFAULT_WP_CONFIG.consumerSecret };
      }
      return { ...DEFAULT_WP_CONFIG, ...parsed };
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

// Retrieve cached products (defaults to full 174 live catalog)
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
  return LIVE_WP_PRODUCTS;
}

// Save cached products
export function saveStoredWpProducts(products: Product[]): void {
  try {
    localStorage.setItem(WP_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

// Retrieve cached categories (defaults to full 100 live categories)
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
  return LIVE_WP_CATEGORIES;
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
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&pound;/g, '£')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function extractMeta(metaArray: any[], key: string): string | undefined {
  if (!Array.isArray(metaArray)) return undefined;
  const item = metaArray.find((m: any) => m.key === key);
  return item ? item.value : undefined;
}

// Build URL with auth credentials, routing through Vite dev proxy if on same host
function buildWooCommerceUrl(baseUrl: string, endpoint: string, config: WordPressConfig): string {
  const cleanBase = cleanUrl(baseUrl);
  const endpointClean = endpoint.replace(/^\/+/, '');

  let fullUrl: string;
  if (typeof window !== 'undefined' && cleanBase.includes('irepair-mobiles.co.uk') && !config.useProxy) {
    fullUrl = `${window.location.origin}/api/wp/wp-json/wc/v3/${endpointClean}`;
  } else {
    fullUrl = `${cleanBase}/wp-json/wc/v3/${endpointClean}`;
  }

  const url = new URL(fullUrl);

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

// Parse Yoast SEO / Rank Math metadata from WooCommerce product payload
export function parseYoastSeo(wpProduct: any): YoastSeoData | undefined {
  const meta = wpProduct.meta_data || [];
  const yoastHead = wpProduct.yoast_head_json || null;

  const seoTitle = 
    extractMeta(meta, 'rank_math_title') || 
    extractMeta(meta, '_yoast_wpseo_title') || 
    yoastHead?.title || 
    `${stripHtml(wpProduct.name)} | iRepair Mobiles UK`;

  const seoDesc = 
    extractMeta(meta, 'rank_math_description') || 
    extractMeta(meta, '_yoast_wpseo_metadesc') || 
    yoastHead?.description || 
    stripHtml(wpProduct.short_description) || 
    stripHtml(wpProduct.description)?.substring(0, 160);

  const focusKw = 
    extractMeta(meta, 'rank_math_focus_keyword') || 
    extractMeta(meta, '_yoast_wpseo_focuskw') || 
    yoastHead?.focuskw;

  return {
    title: stripHtml(seoTitle),
    description: stripHtml(seoDesc),
    canonical: yoastHead?.canonical || wpProduct.permalink,
    ogTitle: yoastHead?.og_title || stripHtml(seoTitle),
    ogDescription: yoastHead?.og_description || stripHtml(seoDesc),
    ogImage: yoastHead?.og_image?.[0]?.url || wpProduct.images?.[0]?.src,
    twitterTitle: yoastHead?.twitter_title,
    twitterDescription: yoastHead?.twitter_description,
    schema: yoastHead?.schema,
    focusKeyword: focusKw ? stripHtml(focusKw) : undefined,
    metaRobots: yoastHead?.robots ? Object.values(yoastHead.robots).join(', ') : 'index, follow',
  };
}

// Helper to parse price ranges from WooCommerce price_html
export function parseWooPriceRange(priceHtml: string | undefined, basePrice: number): {
  priceRange?: string;
  minPrice: number;
  maxPrice: number;
  parsedRegularPrice?: number;
} {
  let minPrice = basePrice || 0;
  let maxPrice = basePrice || 0;
  let parsedRegularPrice: number | undefined;

  if (!priceHtml) {
    return {
      priceRange: minPrice > 0 ? `£${minPrice.toFixed(2)}` : undefined,
      minPrice,
      maxPrice,
    };
  }

  const clean = priceHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/&pound;/g, '£')
    .replace(/&#8211;/g, '–')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();

  // Pattern: £209.00 – £269.00
  const rangeMatch = clean.match(/£\s*(\d+(?:\.\d+)?)\s*–\s*£\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    minPrice = parseFloat(rangeMatch[1]);
    maxPrice = parseFloat(rangeMatch[2]);
    return {
      priceRange: `£${minPrice.toFixed(2)} – £${maxPrice.toFixed(2)}`,
      minPrice,
      maxPrice,
    };
  }

  // Original price was / Current price is
  const origMatch = clean.match(/Original price was:\s*£\s*(\d+(?:\.\d+)?)/i);
  if (origMatch) {
    parsedRegularPrice = parseFloat(origMatch[1]);
  }
  const currMatch = clean.match(/Current price is:\s*£\s*(\d+(?:\.\d+)?)/i) || clean.match(/£\s*(\d+(?:\.\d+)?)/);
  if (currMatch) {
    minPrice = parseFloat(currMatch[1]);
    maxPrice = minPrice;
  }

  return {
    priceRange: minPrice > 0 ? `£${minPrice.toFixed(2)}` : undefined,
    minPrice,
    maxPrice,
    parsedRegularPrice,
  };
}

// Normalise WooCommerce product into frontend Product model
export function normalizeWooCommerceProduct(wp: any): Product {
  const meta = wp.meta_data || [];
  const warrantyText = extractMeta(meta, 'warranty_text') || '12 Months Express Warranty';
  const deliveryText = extractMeta(meta, 'delivery_text') || 'Free Next-Day UK Tracked';

  // Determine condition
  let condition: ProductCondition = 'Refurbished - Pristine (Grade A)';
  const lowerName = (wp.name || '').toLowerCase();
  const lowerDesc = ((wp.short_description || '') + ' ' + (wp.description || '')).toLowerCase();

  if (lowerName.includes('new') && !lowerName.includes('used')) {
    condition = 'Brand New';
  } else if (lowerName.includes('used') || lowerName.includes('grade b') || lowerDesc.includes('grade b') || lowerName.includes('good condition')) {
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
  } else if (lowerName.includes('budi')) {
    brand = 'BUDI';
  } else if (lowerName.includes('veger')) {
    brand = 'Veger';
  } else if (lowerName.includes('alcatel')) {
    brand = 'Alcatel';
  } else if (lowerName.includes('dell')) {
    brand = 'Dell';
  } else if (lowerName.includes('hp')) {
    brand = 'HP';
  } else if (lowerName.includes('lenovo')) {
    brand = 'Lenovo';
  }

  // Determine Category slug
  let categorySlug = 'accessories';
  if (wp.categories && Array.isArray(wp.categories) && wp.categories.length > 0) {
    categorySlug = wp.categories[0].slug;
  }

  // Parse images
  const images = (wp.images || []).map((img: any) => img.src).filter(Boolean);
  const defaultImage = images[0] || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=800';

  // Check if variable
  const isVariable = wp.type === 'variable' || (Array.isArray(wp.variations) && wp.variations.length > 0);

  // Parse price
  const basePrice = parseFloat(wp.price || wp.regular_price || '0') || 0;
  const parsedPriceData = parseWooPriceRange(wp.price_html, basePrice);
  let finalPrice = parsedPriceData.minPrice || basePrice;
  let regularPrice = wp.regular_price && parseFloat(wp.regular_price) > finalPrice 
    ? parseFloat(wp.regular_price) 
    : (parsedPriceData.parsedRegularPrice && parsedPriceData.parsedRegularPrice > finalPrice ? parsedPriceData.parsedRegularPrice : undefined);

  // Extract attributes
  const attributes: WooCommerceAttribute[] = Array.isArray(wp.attributes)
    ? wp.attributes.map((a: any) => ({
        id: a.id,
        name: a.name,
        slug: a.slug || a.name?.toLowerCase(),
        position: a.position,
        visible: a.visible !== false,
        variation: Boolean(a.variation),
        options: Array.isArray(a.options) ? a.options : [],
      }))
    : [];

  // Extract default attributes
  const defaultAttributes: Record<string, string> = {};
  if (Array.isArray(wp.default_attributes)) {
    wp.default_attributes.forEach((def: any) => {
      if (def.name && def.option) {
        defaultAttributes[def.name.toLowerCase().trim()] = def.option;
      }
    });
  }

  // Check bundled or cached variations
  let variations: ProductVariation[] | undefined = wp.wpId && bundledVariations[wp.wpId]
    ? bundledVariations[wp.wpId]
    : (bundledVariations[wp.id] || undefined);

  if (variations && variations.length > 0) {
    const validPrices = variations.map(v => v.price).filter(p => p > 0);
    if (validPrices.length > 0) {
      const vMin = Math.min(...validPrices);
      const vMax = Math.max(...validPrices);
      finalPrice = vMin;
      if (vMin !== vMax) {
        parsedPriceData.priceRange = `£${vMin.toFixed(2)} – £${vMax.toFixed(2)}`;
        parsedPriceData.minPrice = vMin;
        parsedPriceData.maxPrice = vMax;
      }
    }
  }

  // Extract storage variants if available in attributes
  let storageVariants: string[] = [];
  let colorVariants: { name: string; hex: string }[] = [];

  const storageAttr = attributes.find(a => a.name?.toLowerCase().includes('storage') || a.name?.toLowerCase().includes('capacity'));
  if (storageAttr && Array.isArray(storageAttr.options)) {
    storageVariants = storageAttr.options;
  }
  const colorAttr = attributes.find(a => a.name?.toLowerCase().includes('color') || a.name?.toLowerCase().includes('colour'));
  if (colorAttr && Array.isArray(colorAttr.options)) {
    colorVariants = colorAttr.options.map(opt => ({
      name: opt,
      hex: opt.toLowerCase().includes('black') ? '#0f172a' : opt.toLowerCase().includes('white') ? '#f8fafc' : '#DF0C88',
    }));
  }

  // Specifications
  const specs: Record<string, string> = {
    Warranty: warrantyText,
    Condition: condition,
    Delivery: deliveryText,
    Network: 'Unlocked to all UK Networks',
  };
  if (wp.sku) specs['SKU'] = wp.sku;
  if (wp.stock_status) specs['Availability'] = wp.stock_status === 'instock' ? 'In Stock (Ready to Ship)' : 'Out of Stock';

  const rawDetails = extractMeta(meta, 'technical_details');
  if (rawDetails && typeof rawDetails === 'string') {
    const rowMatches = rawDetails.matchAll(/<tr>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/gi);
    for (const match of rowMatches) {
      const k = stripHtml(match[1]);
      const v = stripHtml(match[2]);
      if (k && v && Object.keys(specs).length < 12) {
        specs[k] = v;
      }
    }
  }

  return {
    id: `wp-${wp.id}`,
    wpId: wp.id,
    title: stripHtml(wp.name),
    slug: wp.slug || `product-${wp.id}`,
    category: categorySlug,
    brand,
    price: finalPrice,
    regularPrice,
    type: isVariable ? 'variable' : 'simple',
    priceHtml: wp.price_html,
    priceRange: parsedPriceData.priceRange,
    minPrice: parsedPriceData.minPrice,
    maxPrice: parsedPriceData.maxPrice,
    attributes: attributes.length > 0 ? attributes : undefined,
    defaultAttributes: Object.keys(defaultAttributes).length > 0 ? defaultAttributes : undefined,
    variations,
    condition,
    inStock: wp.stock_status === 'instock',
    stockCount: typeof wp.stock_quantity === 'number' ? wp.stock_quantity : (wp.stock_status === 'instock' ? 12 : 0),
    rating: parseFloat(wp.average_rating || '5.0') || 5.0,
    reviewsCount: wp.rating_count || 12,
    featured: Boolean(wp.featured),
    image: defaultImage,
    gallery: images.length > 1 ? images.slice(1) : undefined,
    description: stripHtml(wp.short_description) || stripHtml(wp.description) || 'Premium device verified by iRepair UK technicians.',
    shortDescription: stripHtml(wp.short_description) || stripHtml(wp.description) || '',
    longDescription: wp.description || wp.short_description || '',
    specifications: specs,
    warrantyMonths: warrantyText.includes('6') ? 6 : 12,
    permalink: wp.permalink,
    variants: storageVariants.length > 0 || colorVariants.length > 0 ? {
      storage: storageVariants.length > 0 ? storageVariants : undefined,
      colors: colorVariants.length > 0 ? colorVariants : undefined,
    } : undefined,
    yoastSeo: parseYoastSeo(wp),
  };
}

// Fetch Variations for a Variable Product
export async function fetchProductVariations(productId: number, config: WordPressConfig): Promise<ProductVariation[]> {
  // Check local cache
  try {
    const raw = localStorage.getItem(`irepair_vars_${productId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // Check bundled data
  if (bundledVariations[productId]) {
    return bundledVariations[productId];
  }

  try {
    const url = buildWooCommerceUrl(config.baseUrl, `products/${productId}/variations?per_page=50`, config);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.warn(`Could not fetch variations for ${productId}: HTTP ${response.status}`);
      return [];
    }

    const rawVars = await response.json();
    if (!Array.isArray(rawVars)) return [];

    const variations: ProductVariation[] = rawVars.map((v: any) => {
      const attrMap: Record<string, string> = {};
      (v.attributes || []).forEach((a: any) => {
        const key = (a.name || a.slug || '').toLowerCase().trim();
        attrMap[key] = a.option;
      });

      return {
        id: v.id,
        price: parseFloat(v.price || '0'),
        regularPrice: v.regular_price ? parseFloat(v.regular_price) : undefined,
        salePrice: v.sale_price ? parseFloat(v.sale_price) : undefined,
        attributes: attrMap,
        rawAttributes: v.attributes,
        image: v.image?.src,
        inStock: v.stock_status === 'instock',
        stockQuantity: v.stock_quantity,
        sku: v.sku,
      };
    });

    try {
      localStorage.setItem(`irepair_vars_${productId}`, JSON.stringify(variations));
    } catch {}

    return variations;
  } catch (err) {
    console.error(`Failed to fetch variations for ${productId}:`, err);
    return [];
  }
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
