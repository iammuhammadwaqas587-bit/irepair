import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Key, 
  Lock, 
  Database, 
  Search, 
  ExternalLink, 
  HelpCircle, 
  Layers, 
  Check, 
  Copy,
  Sparkles
} from 'lucide-react';
import { testWordPressConnection } from '../services/wordpressApi';

export const WordPressSyncModal: React.FC = () => {
  const { 
    showWpSyncModal, 
    setShowWpSyncModal, 
    wpConfig, 
    updateWpConfig, 
    syncWordPressProducts, 
    isSyncingWp, 
    wpSyncStatus,
    products,
    categories
  } = useApp();

  const [baseUrl, setBaseUrl] = useState(wpConfig.baseUrl || 'https://irepair-mobiles.co.uk');
  const [consumerKey, setConsumerKey] = useState(wpConfig.consumerKey || '');
  const [consumerSecret, setConsumerSecret] = useState(wpConfig.consumerSecret || '');
  const [useProxy, setUseProxy] = useState(wpConfig.useProxy || false);

  const [activeTab, setActiveTab] = useState<'config' | 'guide' | 'yoast-preview'>('config');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    hasWooCommerce?: boolean;
    hasYoastSeo?: boolean;
    productCount?: number;
  } | null>(null);

  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!showWpSyncModal) return null;

  const handleSaveAndSync = async () => {
    const newConfig = {
      ...wpConfig,
      baseUrl: baseUrl.trim(),
      consumerKey: consumerKey.trim(),
      consumerSecret: consumerSecret.trim(),
      useProxy,
    };
    updateWpConfig(newConfig);
    await syncWordPressProducts(newConfig);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testWordPressConnection({
        baseUrl: baseUrl.trim(),
        consumerKey: consumerKey.trim(),
        consumerSecret: consumerSecret.trim(),
        useProxy,
        autoSync: false,
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const copyCorsSnippet = () => {
    const snippet = `// Add this to your WordPress theme functions.php or a snippet plugin:
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Total, X-WP-TotalPages");
});`;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const sampleYoastProduct = products.find(p => Boolean(p.yoastSeo)) || products[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setShowWpSyncModal(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 duration-150 overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DF0C88] to-[#9b0b60] flex items-center justify-center text-white shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  WordPress &amp; WooCommerce Sync
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Yoast SEO Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connect your WordPress catalog to auto-populate products &amp; categories with Yoast metadata
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowWpSyncModal(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-5 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'border-[#DF0C88] text-[#DF0C88]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            API Credentials &amp; Sync
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-[#DF0C88] text-[#DF0C88]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            What is Required from You?
          </button>
          <button
            onClick={() => setActiveTab('yoast-preview')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'yoast-preview'
                ? 'border-[#DF0C88] text-[#DF0C88]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Yoast SEO Live Preview
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm">
          
          {/* TAB 1: CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              
              {/* Status Banner */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${
                    wpSyncStatus.status === 'success' 
                      ? 'bg-emerald-500 ring-4 ring-emerald-100' 
                      : wpSyncStatus.status === 'error'
                        ? 'bg-rose-500 ring-4 ring-rose-100'
                        : 'bg-amber-500'
                  }`} />
                  <div>
                    <div className="font-bold text-slate-800">
                      Catalog Status: {wpSyncStatus.status === 'success' ? 'Live Synchronized' : wpSyncStatus.status === 'error' ? 'Connection Issue' : 'Default Catalog Active'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {products.length} Products · {categories.length} Categories · {wpSyncStatus.lastSync ? `Last synced: ${new Date(wpSyncStatus.lastSync).toLocaleTimeString()}` : 'Ready for WordPress sync'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveAndSync}
                  disabled={isSyncingWp}
                  className="px-3 py-1.5 bg-[#DF0C88] hover:bg-[#C50875] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWp ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWp ? 'Fetching...' : 'Sync Now'}</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                
                {/* 1. Base URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#DF0C88]" />
                    <span>WordPress Site URL</span>
                  </label>
                  <input 
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://irepair-mobiles.co.uk"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88] outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your WordPress homepage URL where WooCommerce and Yoast SEO are installed.
                  </p>
                </div>

                {/* 2. Consumer Key */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-600" />
                    <span>WooCommerce Consumer Key</span>
                  </label>
                  <input 
                    type="text"
                    value={consumerKey}
                    onChange={(e) => setConsumerKey(e.target.value)}
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88] outline-none transition-all"
                  />
                </div>

                {/* 3. Consumer Secret */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    <span>WooCommerce Consumer Secret</span>
                  </label>
                  <input 
                    type="password"
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#DF0C88] focus:border-[#DF0C88] outline-none transition-all"
                  />
                </div>

                {/* CORS Proxy Toggle */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Use CORS Proxy (For Preview / Cross-Domain)</div>
                    <div className="text-[11px] text-slate-500">Enable if your WordPress server blocks cross-origin requests.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useProxy} 
                      onChange={(e) => setUseProxy(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#DF0C88]"></div>
                  </label>
                </div>
              </div>

              {/* Test Diagnostics Box */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{testResult.message}</div>
                      {testResult.success && (
                        <div className="mt-1.5 space-y-1 text-[11px] text-emerald-800">
                          <div>• WooCommerce REST API: <strong>Active</strong></div>
                          <div>• Yoast SEO Metadata: <strong>{testResult.hasYoastSeo ? 'Detected (Titles, Descriptions & Schema ready)' : 'Standard Fallback'}</strong></div>
                          {typeof testResult.productCount === 'number' && (
                            <div>• Live Products Found: <strong>{testResult.productCount}</strong></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>{testingConnection ? 'Testing Connection...' : 'Test Connection'}</span>
                </button>

                <button
                  onClick={handleSaveAndSync}
                  disabled={isSyncingWp}
                  className="w-full sm:flex-1 px-5 py-2.5 bg-[#DF0C88] hover:bg-[#C50875] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWp ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWp ? 'Synchronizing Catalog...' : 'Save & Fetch Products Now'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: DETAILED GUIDE & REQUIREMENTS */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-pink-50/70 border border-pink-100 rounded-xl p-4 text-xs text-slate-700">
                <h4 className="font-bold text-[#DF0C88] mb-1 flex items-center gap-1.5 text-sm">
                  <Database className="w-4 h-4" />
                  What is Required to Connect Your WordPress Site
                </h4>
                <p>
                  To display your products, categories, and Yoast SEO information directly in this application, you only need 3 things from your WordPress installation:
                </p>
              </div>

              {/* 3 Step Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-[#DF0C88] text-white font-bold text-xs flex items-center justify-center mb-2">
                    1
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs mb-1">WordPress Site URL</h5>
                  <p className="text-[11px] text-slate-500">
                    Your public domain (e.g. <code className="text-[#DF0C88]">https://irepair-mobiles.co.uk</code>) with SSL (HTTPS).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-[#DF0C88] text-white font-bold text-xs flex items-center justify-center mb-2">
                    2
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs mb-1">WooCommerce REST Keys</h5>
                  <p className="text-[11px] text-slate-500">
                    Go to <strong>WooCommerce → Settings → Advanced → REST API</strong>. Create a key with <strong>Read</strong> permissions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-[#DF0C88] text-white font-bold text-xs flex items-center justify-center mb-2">
                    3
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs mb-1">Yoast SEO Plugin</h5>
                  <p className="text-[11px] text-slate-500">
                    Keep Yoast SEO active. It automatically embeds <code className="text-emerald-700">yoast_head_json</code> in product responses.
                  </p>
                </div>

              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  How to generate your REST API Keys in WordPress:
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <li>Log in to your <strong>WordPress Admin Dashboard</strong>.</li>
                  <li>In the sidebar, navigate to <strong>WooCommerce</strong> → <strong>Settings</strong>.</li>
                  <li>Click on the <strong>Advanced</strong> tab at the top, then click <strong>REST API</strong>.</li>
                  <li>Click the <strong>Add Key</strong> button.</li>
                  <li>Enter Description: <code className="bg-white px-1.5 py-0.5 rounded border text-[#DF0C88]">iRepair Storefront</code>.</li>
                  <li>Select Permissions: <strong>Read</strong> (or Read/Write if you also want order placement).</li>
                  <li>Click <strong>Generate API Key</strong>. Copy the <strong>Consumer Key</strong> and <strong>Consumer Secret</strong> and paste them in the settings tab.</li>
                </ol>
              </div>

              {/* CORS explanation & snippet */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-slate-900">
                    CORS (Cross-Origin Resource Sharing) Note:
                  </h5>
                  <button
                    onClick={copyCorsSnippet}
                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-md text-[11px] font-semibold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy PHP Snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  By default, some WordPress hosting blocks client-side JavaScript requests from external domains. If you experience a CORS error during direct connection, simply toggle <strong>Use CORS Proxy</strong> above, or add this 3-line snippet to your theme's <code className="font-mono text-pink-700">functions.php</code>:
                </p>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10px] font-mono overflow-x-auto leading-relaxed">
{`add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Total, X-WP-TotalPages");
});`}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 3: YOAST SEO PREVIEW */}
          {activeTab === 'yoast-preview' && (
            <div className="space-y-4">
              
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Yoast SEO Integration is Fully Active!</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    When products are fetched from your WordPress WooCommerce store, their Yoast SEO meta title, meta description, canonical URL, OpenGraph social card, and Schema.org rich snippet are automatically extracted and utilized.
                  </p>
                </div>
              </div>

              {sampleYoastProduct && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Google Search Result Snippet Preview</span>
                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      Yoast SEO Output
                    </span>
                  </div>

                  {/* Google Snippet Simulation */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs max-w-xl">
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] text-slate-500 font-mono truncate">
                        {sampleYoastProduct.yoastSeo?.canonical || `https://irepair-mobiles.co.uk/product/${sampleYoastProduct.slug}`}
                      </span>
                    </div>
                    <div className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
                      {sampleYoastProduct.yoastSeo?.title || `${sampleYoastProduct.title} | iRepair Mobiles UK`}
                    </div>
                    <div className="text-xs text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
                      {sampleYoastProduct.yoastSeo?.description || sampleYoastProduct.description}
                    </div>
                  </div>

                  {/* Metadata Key-Value Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-2">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Meta Title</div>
                      <div className="font-semibold text-slate-800 truncate">
                        {sampleYoastProduct.yoastSeo?.title || sampleYoastProduct.title}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Canonical URL</div>
                      <div className="font-semibold text-slate-800 truncate font-mono text-[11px]">
                        {sampleYoastProduct.yoastSeo?.canonical || `/product/${sampleYoastProduct.slug}`}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Robots Meta</div>
                      <div className="font-semibold text-emerald-700">
                        {sampleYoastProduct.yoastSeo?.metaRobots || 'index, follow'}
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Schema.org Rich Snippet</div>
                      <div className="font-semibold text-indigo-700">
                        Product, AggregateOffer, InStock
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Layers className="w-3.5 h-3.5 text-[#DF0C88]" />
            <span>Syncs to all product sections &amp; shop categories</span>
          </div>
          <button 
            onClick={() => setShowWpSyncModal(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
