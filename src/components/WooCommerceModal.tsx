import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Copy, Code, ExternalLink } from 'lucide-react';

export const WooCommerceModal: React.FC = () => {
  const { showWooModal, setShowWooModal, wooCommercePayload } = useApp();
  const [copied, setCopied] = useState(false);

  if (!showWooModal || !wooCommercePayload) return null;

  const jsonString = JSON.stringify(wooCommercePayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setShowWooModal(false)}
      />

      <div className="relative bg-slate-900 text-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-700 z-10 animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                WordPress WooCommerce Integration Ready
              </h3>
              <p className="text-xs text-slate-400">
                Compatible with WooCommerce REST API v3 (<code className="text-purple-300">/wp-json/wc/v3/orders</code>)
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowWooModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto font-mono text-xs flex-1">
          <div className="mb-3 flex items-center justify-between text-slate-400">
            <span>JSON Payload Body for WordPress Hook:</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors text-[11px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON Payload</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
            {jsonString}
          </pre>
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Includes line items, billing, shipping, and custom repair metadata</span>
          </div>
          <button 
            onClick={() => setShowWooModal(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
