import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Receipt, ShieldCheck, AlertTriangle, ArrowUpRight, Plus, Trash2, Sparkles } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function PurchaseExplorer({ onSelectPurchase, onOpenAddToVault, onOpenRemoveFromVault }) {
  const [agentState, setAgentState] = useState(webMcpAgent.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('EXPIRY'); // 'EXPIRY', 'PRICE', 'DATE'

  useEffect(() => {
    return webMcpAgent.subscribe((state) => setAgentState(state));
  }, []);

  const categories = ['ALL', 'Audio', 'Displays', 'Computers', 'Peripherals', 'Storage', 'Electronics', 'Phone', 'Accessories'];

  // Filter & Sort Logic
  const filteredPurchases = agentState.purchases.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'EXPIRY') return a.daysRemaining - b.daysRemaining;
    if (sortBy === 'PRICE') return b.price - a.price;
    if (sortBy === 'DATE') return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    return 0;
  });

  return (
    <div className="py-6 px-4 md:px-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#2d2d2d] dark:border-white/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-[#2d5da1] text-white px-2 py-0.5 wobbly-badge font-bold">
              ASSET VAULT
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#2d2d2d] dark:text-white">
              Purchase Intelligence Explorer
            </h1>
          </div>
          <p className="font-body text-xl text-[#2d2d2d]/70 dark:text-white/70 mt-1">
            Browse, search, and verify all tracked assets in your living vault.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PRIMARY ENTRY POINT: + ADD TO VAULT */}
          <button
            onClick={onOpenAddToVault}
            className="px-4 py-2 bg-[#fff9c4] dark:bg-[#2d5da1] text-[#2d2d2d] dark:text-white border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center gap-1.5 transition-transform"
          >
            <Plus className="w-5 h-5 text-[#ff4d4d] dark:text-white" strokeWidth={2.5} />
            <span>+ ADD TO VAULT</span>
          </button>

          {/* SECONDARY ENTRY POINT: - REMOVE DEVICE */}
          <button
            onClick={onOpenRemoveFromVault}
            className="px-4 py-2 bg-[#ffebee] dark:bg-[#ff4d4d]/20 text-[#ff4d4d] dark:text-red-300 border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center gap-1.5 transition-transform"
          >
            <Trash2 className="w-5 h-5 text-[#ff4d4d]" strokeWidth={2.5} />
            <span>- REMOVE DEVICE</span>
          </button>

          <button
            onClick={() => {
              const query = prompt("Search purchase by keyword:") || "";
              if (query) webMcpAgent.executeTool('search_purchases', { query });
            }}
            className="px-3.5 py-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white sketch-shadow-hover flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" />
            <span className="hidden sm:inline">Agent Search</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 bg-white dark:bg-[#1f2028] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow space-y-4">
        
        {/* Search Input + Sorting dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d2d2d]/60 dark:text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, brand, or serial number..."
              className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-lg text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-[#2d5da1] dark:text-[#ff4d4d]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-mono text-sm font-bold text-[#2d2d2d] dark:text-white"
            >
              <option value="EXPIRY">Sort by: Expiration</option>
              <option value="PRICE">Sort by: Price High-Low</option>
              <option value="DATE">Sort by: Purchase Date</option>
            </select>
          </div>
        </div>

        {/* Category & Status Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-dashed border-[#2d2d2d]/30 dark:border-white/20">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-[#2d2d2d]/60 dark:text-white/60 font-bold mr-1">CATEGORY:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 font-body text-base font-bold border-2 border-[#2d2d2d] dark:border-white/30 wobbly-badge transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2d5da1] dark:bg-[#ff4d4d] text-white shadow-sm'
                    : 'bg-white dark:bg-[#282a36] text-[#2d2d2d] dark:text-white hover:bg-[#e5e0d8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-[#2d2d2d]/60 dark:text-white/60 font-bold mr-1">STATUS:</span>
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-0.5 font-mono text-xs font-bold border border-[#2d2d2d] rounded ${
                selectedStatus === 'ALL' ? 'bg-[#2d2d2d] text-white' : 'bg-white dark:bg-[#282a36] text-[#2d2d2d] dark:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedStatus('EXPIRING')}
              className={`px-2.5 py-0.5 font-mono text-xs font-bold border border-[#2d2d2d] rounded ${
                selectedStatus === 'EXPIRING' ? 'bg-[#fff9c4] text-[#b45309]' : 'bg-white dark:bg-[#282a36] text-[#2d2d2d] dark:text-white'
              }`}
            >
              🟡 EXPIRING
            </button>
            <button
              onClick={() => setSelectedStatus('PROTECTED')}
              className={`px-2.5 py-0.5 font-mono text-xs font-bold border border-[#2d2d2d] rounded ${
                selectedStatus === 'PROTECTED' ? 'bg-[#e8f5e9] text-[#047857]' : 'bg-white dark:bg-[#282a36] text-[#2d2d2d] dark:text-white'
              }`}
            >
              🟢 PROTECTED
            </button>
          </div>
        </div>
      </div>

      {/* PURCHASES GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPurchases.map((item) => {
          const isExpiring = item.status === 'EXPIRING';

          return (
            <div
              key={item.id}
              onClick={() => onSelectPurchase(item)}
              className="p-5 bg-white dark:bg-[#1f2028] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-hover cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group relative"
            >
              {/* Top Badge & Price */}
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs px-2.5 py-0.5 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-badge font-bold ${
                  isExpiring ? 'bg-[#fff9c4] text-[#b45309]' : 'bg-[#e8f5e9] text-[#047857]'
                }`}>
                  {isExpiring ? `🟡 Expires in ${item.daysRemaining}d` : `🟢 Protected (${item.daysRemaining}d)`}
                </span>

                <span className="font-mono text-base font-bold text-[#2d2d2d] dark:text-white">
                  ₹{item.price.toLocaleString()}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-3">
                <div className="text-4xl p-2 bg-[#fff9c4] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-circle group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <span className="font-mono text-xs text-[#2d5da1] dark:text-[#ff4d4d] font-bold">{item.brand}</span>
                  <h3 className="font-heading text-2xl text-[#2d2d2d] dark:text-white font-bold leading-tight group-hover:text-[#2d5da1] transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-mono text-xs text-[#2d2d2d]/60 dark:text-white/60 block mt-0.5">
                    Store: {item.store}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t-2 border-dashed border-[#2d2d2d]/40 dark:border-white/20 flex items-center justify-between text-xs font-mono">
                <span className="text-[#2d2d2d]/70 dark:text-white/70">Date: {item.purchaseDate}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    webMcpAgent.executeTool('get_receipt', { purchaseId: item.id });
                  }}
                  className="flex items-center gap-1 text-[#2d5da1] dark:text-[#ff4d4d] font-bold hover:underline"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredPurchases.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-[#1f2028] border-2 border-dashed border-[#2d2d2d] dark:border-white/30 wobbly-card">
            <h3 className="font-heading text-3xl text-[#2d2d2d] dark:text-white">No Purchases Found</h3>
            <p className="font-body text-xl text-[#2d2d2d]/70 dark:text-white/70 mt-1">
              Try adjusting your search query or add a new purchase to your vault.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
