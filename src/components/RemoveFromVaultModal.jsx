import React, { useState } from 'react';
import { 
  Trash2, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Search,
  ArrowRight
} from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function RemoveFromVaultModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [recentlyRemoved, setRecentlyRemoved] = useState(null);

  if (!isOpen) return null;

  const state = webMcpAgent.getState();

  const filteredPurchases = state.purchases.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmRemove = (purchase) => {
    const result = webMcpAgent.removePurchaseFromVault(purchase.id);
    if (result.success) {
      setRecentlyRemoved(purchase.name);
      setConfirmDeleteId(null);
      setTimeout(() => setRecentlyRemoved(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] dark:bg-[#1f2028] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-6 text-[#2d2d2d] dark:text-[#f3f4f6] space-y-5 max-h-[90vh] overflow-y-auto">
        
        <div className="tape-strip" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] dark:border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ffebee] dark:bg-[#ff4d4d]/20 border-2 border-[#2d2d2d] dark:border-white/30 rounded">
              <Trash2 className="w-6 h-6 text-[#ff4d4d]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold leading-none">
                REMOVE DEVICE FROM VAULT
              </h2>
              <span className="font-body text-lg text-[#ff4d4d] font-bold">
                Select a tracked asset to permanently delete from purchase memory.
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm hover:bg-[#ff4d4d] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast / Notification */}
        {recentlyRemoved && (
          <div className="p-3 bg-[#e8f5e9] dark:bg-[#10b981]/20 border-2 border-[#10b981] wobbly-sm flex items-center gap-2 font-mono text-xs font-bold text-[#047857] dark:text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>"{recentlyRemoved}" removed from Vault & memory updated!</span>
          </div>
        )}

        {/* Search Bar for Quick Filtering */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d2d2d]/60 dark:text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search device to remove by name, brand, or serial..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-lg text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#ff4d4d]"
          />
        </div>

        {/* Device List */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredPurchases.map((item) => {
            const isConfirming = confirmDeleteId === item.id;

            return (
              <div 
                key={item.id}
                className="p-4 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-2 bg-[#fff9c4] dark:bg-black/30 border border-[#2d2d2d] dark:border-white/30 wobbly-circle shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-2xl font-bold text-[#2d2d2d] dark:text-white leading-tight">
                        {item.name}
                      </h4>
                      <span className="font-mono text-xs text-[#2d5da1] dark:text-[#ff4d4d] font-bold">
                        {item.brand}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#2d2d2d]/70 dark:text-white/70">
                      SN: {item.serialNumber} • ₹{item.price.toLocaleString()} • Status: {item.status}
                    </p>
                  </div>
                </div>

                {/* Inline Confirmation or Remove Button */}
                <div className="shrink-0">
                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#ff4d4d] font-bold">Confirm delete?</span>
                      <button
                        onClick={() => handleConfirmRemove(item)}
                        className="px-3 py-1 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-mono text-xs font-bold sketch-shadow-hover"
                      >
                        YES, REMOVE
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-white dark:bg-[#1f2028] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-mono text-xs font-bold text-[#2d2d2d] dark:text-white"
                      >
                        NO
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="px-4 py-1.5 bg-[#ffebee] dark:bg-[#ff4d4d]/20 hover:bg-[#ff4d4d] hover:text-white text-[#ff4d4d] dark:text-red-400 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}

          {filteredPurchases.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-[#282a36] border-2 border-dashed border-[#2d2d2d] dark:border-white/30 wobbly-sm font-body text-xl text-[#2d2d2d]/70 dark:text-white/70">
              No matching assets found to remove.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-dashed border-[#2d2d2d]/30 dark:border-white/20 flex items-center justify-between font-mono text-xs">
          <span className="text-[#2d2d2d]/70 dark:text-white/70">
            Total Tracked Assets: <strong>{state.purchases.length}</strong>
          </span>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
