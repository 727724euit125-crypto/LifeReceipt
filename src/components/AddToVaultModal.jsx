import React, { useState } from 'react';
import { 
  Plus, 
  Scan, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Edit3, 
  Loader2,
  Calendar,
  DollarSign,
  Tag,
  Store,
  Layers
} from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';
import { DEMO_DATE } from '../data/mockData';

export function AddToVaultModal({ isOpen, onClose, onSelectPurchase }) {
  const [step, setStep] = useState('CHOICE'); // CHOICE | SCANNING | FORM | SUCCESS
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  
  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    purchaseDate: '2026-08-15',
    price: '',
    store: '',
    warrantyMonths: 12,
    serialNumber: '',
    receiptId: '',
    notes: '',
    source: 'manual'
  });

  const [createdPurchase, setCreatedPurchase] = useState(null);

  if (!isOpen) return null;

  const categories = [
    'Electronics',
    'Computer',
    'Phone',
    'Audio',
    'Home',
    'Appliances',
    'Accessories',
    'Other'
  ];

  const warrantyOptions = [
    { label: 'No Warranty', months: 0 },
    { label: '3 Months', months: 3 },
    { label: '6 Months', months: 6 },
    { label: '1 Year (12m)', months: 12 },
    { label: '2 Years (24m)', months: 24 },
    { label: '3 Years (36m)', months: 36 }
  ];

  // Calculated Preview metrics
  const calculatePreview = () => {
    if (!formData.purchaseDate) return { expiry: 'N/A', days: 0, status: 'PROTECTED' };
    const pDate = new Date(formData.purchaseDate);
    const months = parseInt(formData.warrantyMonths) || 0;
    pDate.setMonth(pDate.getMonth() + months);
    const expiry = pDate.toISOString().slice(0, 10);

    const demoAnchor = new Date(DEMO_DATE); // 2026-09-03
    const diffDays = Math.ceil((pDate - demoAnchor) / (1000 * 60 * 60 * 24));
    let status = 'PROTECTED';
    if (diffDays <= 30 && diffDays > 0) status = 'EXPIRING';
    if (diffDays <= 0) status = 'AT_RISK';

    return { expiry, days: Math.max(0, diffDays), status };
  };

  const previewMetrics = calculatePreview();

  // Simulated Receipt Scan Pipeline
  const handleStartScan = async () => {
    setStep('SCANNING');
    setScanProgress(10);
    setScanStatusText('RECEIPT DETECTED');

    await new Promise((r) => setTimeout(r, 600));
    setScanProgress(35);
    setScanStatusText('READING PURCHASE DETAILS');

    await new Promise((r) => setTimeout(r, 700));
    setScanProgress(65);
    setScanStatusText('PRODUCT IDENTIFIED: Apple iPad Pro 11"');

    await new Promise((r) => setTimeout(r, 600));
    setScanProgress(90);
    setScanStatusText('WARRANTY DETECTED: 12 Months AppleCare');

    await new Promise((r) => setTimeout(r, 500));
    setScanProgress(100);
    setScanStatusText('READY TO ADD');

    await new Promise((r) => setTimeout(r, 400));

    // Populate extracted demo data
    setFormData({
      name: 'Apple iPad Pro 11" M4',
      brand: 'Apple',
      category: 'Computer',
      purchaseDate: '2026-08-20',
      price: '81900',
      store: 'Apple Store Saket, Delhi',
      warrantyMonths: 12,
      serialNumber: 'DL-IPAD11-99481X',
      receiptId: 'RCP-APL-88201',
      notes: 'Extracted via LifeReceipt Simulated Optical Parser.',
      source: 'receipt_upload'
    });

    setStep('FORM');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.purchaseDate) return;

    const newPurch = webMcpAgent.addPurchaseToVault(formData);
    setCreatedPurchase(newPurch);
    setStep('SUCCESS');
  };

  const handleResetAndClose = () => {
    setStep('CHOICE');
    setScanProgress(0);
    setFormData({
      name: '',
      brand: '',
      category: 'Electronics',
      purchaseDate: '2026-08-15',
      price: '',
      store: '',
      warrantyMonths: 12,
      serialNumber: '',
      receiptId: '',
      notes: '',
      source: 'manual'
    });
    setCreatedPurchase(null);
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.price && formData.purchaseDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#fdfbf7] dark:bg-[#1f2028] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-6 text-[#2d2d2d] dark:text-[#f3f4f6] space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div className="tape-strip" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] dark:border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#fff9c4] dark:bg-[#2d5da1] border-2 border-[#2d2d2d] dark:border-white/30 rounded">
              <Plus className="w-6 h-6 text-[#2d2d2d] dark:text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold leading-none">
                ADD PURCHASE TO VAULT
              </h2>
              <span className="font-body text-lg text-[#2d5da1] dark:text-[#ff4d4d] font-bold">
                Turn a receipt into a living purchase asset.
              </span>
            </div>
          </div>

          <button 
            onClick={handleResetAndClose}
            className="p-1.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm hover:bg-[#ff4d4d] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CHOICE SCREEN */}
        {step === 'CHOICE' && (
          <div className="grid md:grid-cols-2 gap-4 py-2">
            {/* Option A: SCAN RECEIPT */}
            <button
              onClick={handleStartScan}
              className="p-6 bg-white dark:bg-[#282a36] hover:bg-[#fff9c4] dark:hover:bg-[#2d5da1] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-hover text-left flex flex-col justify-between space-y-4 group relative"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#e3f2fd] dark:bg-white/10 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-circle">
                  <Scan className="w-8 h-8 text-[#2d5da1] dark:text-[#ff4d4d]" strokeWidth={2.5} />
                </div>
                <span className="font-mono text-xs bg-[#10b981] text-white px-2.5 py-0.5 rounded-full font-bold">
                  FASTEST
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-[#2d2d2d] dark:text-white group-hover:text-[#2d2d2d]">
                  SCAN RECEIPT
                </h3>
                <p className="font-body text-lg text-[#2d2d2d]/80 dark:text-white/80 mt-1 leading-snug">
                  Upload a receipt image/PDF and let LifeReceipt extract the purchase details automatically.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2d5da1] dark:text-[#ff4d4d] group-hover:text-[#2d2d2d] pt-2">
                <span>Upload & Extract</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option B: ADD MANUALLY */}
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, source: 'manual' }));
                setStep('FORM');
              }}
              className="p-6 bg-white dark:bg-[#282a36] hover:bg-[#ffebee] dark:hover:bg-[#ff4d4d]/30 border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-hover text-left flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#fff9c4] dark:bg-white/10 border-2 border-[#2d2d2d] dark:border-white/30 wobbly-circle">
                  <Edit3 className="w-8 h-8 text-[#ff4d4d]" strokeWidth={2.5} />
                </div>
                <span className="font-mono text-xs bg-[#2d2d2d] text-white px-2 py-0.5 rounded font-bold">
                  MANUAL
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-[#2d2d2d] dark:text-white group-hover:text-[#ff4d4d]">
                  ADD MANUALLY
                </h3>
                <p className="font-body text-lg text-[#2d2d2d]/80 dark:text-white/80 mt-1 leading-snug">
                  Enter the purchase name, date, price, warranty duration, and serial number yourself.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#ff4d4d] group-hover:text-[#ff4d4d] pt-2">
                <span>Fill Form Fields</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* STEP 2: SIMULATED SCANNING PROGRESS */}
        {step === 'SCANNING' && (
          <div className="py-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto bg-[#fff9c4] dark:bg-[#282a36] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-circle flex items-center justify-center sketch-shadow animate-pulse">
              <Loader2 className="w-10 h-10 text-[#ff4d4d] animate-spin" strokeWidth={2.5} />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="font-mono text-xs bg-[#2d5da1] text-white px-3 py-1 rounded font-bold uppercase tracking-wider">
                SIMULATED OCR PARSER
              </span>
              <h3 className="font-heading text-3xl font-bold text-[#2d2d2d] dark:text-white">
                {scanStatusText}
              </h3>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-[#e5e0d8] dark:bg-white/20 border-2 border-[#2d2d2d] dark:border-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#10b981] transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <p className="font-mono text-xs text-[#2d2d2d]/60 dark:text-white/60 pt-2">
                Note: Demonstrating simulated extraction pipeline without external cloud OCR dependency.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: PURCHASE FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleSave} className="space-y-4">
            
            {formData.source === 'receipt_upload' && (
              <div className="p-3 bg-[#e8f5e9] dark:bg-[#10b981]/20 border-2 border-[#10b981] wobbly-sm flex items-center justify-between font-mono text-xs font-bold text-[#047857] dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> REVIEW EXTRACTED RECEIPT DETAILS
                </span>
                <span>Edit any field before adding</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Product Name */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Product / Device Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apple iPad Pro 11"
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g., Apple, Sony, LG"
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Purchase Price */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Purchase Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 81900"
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-lg font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                />
              </div>

              {/* Warranty Duration */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Warranty Duration
                </label>
                <select
                  value={formData.warrantyMonths}
                  onChange={(e) => setFormData({ ...formData, warrantyMonths: parseInt(e.target.value) })}
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                >
                  {warrantyOptions.map((opt, idx) => (
                    <option key={idx} value={opt.months}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Store / Seller */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Store / Seller
                </label>
                <input
                  type="text"
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  placeholder="e.g., Croma, Amazon, Apple BKC"
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                />
              </div>

              {/* Serial Number (Optional) */}
              <div>
                <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1 uppercase">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="e.g., SN-IPAD-991823"
                  className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#2d5da1]"
                />
              </div>

            </div>

            {/* Live Calculated Warranty Preview Strip */}
            <div className="p-3 bg-[#fff9c4] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[#2d2d2d] dark:text-white">
                AUTO-CALCULATED EXPIRY (DEMO ANCHOR 2026-09-03):
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#2d5da1] dark:text-[#ff4d4d]">
                  Expires: {previewMetrics.expiry}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold text-white ${
                  previewMetrics.status === 'PROTECTED' ? 'bg-[#10b981]' : previewMetrics.status === 'EXPIRING' ? 'bg-[#f59e0b]' : 'bg-[#ff4d4d]'
                }`}>
                  {previewMetrics.days} days remaining ({previewMetrics.status})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t-2 border-dashed border-[#2d2d2d]/30 dark:border-white/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('CHOICE')}
                className="px-4 py-2 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={!isFormValid}
                className="px-8 py-3 bg-[#ff4d4d] text-white border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-2xl font-bold sketch-shadow-hover flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 fill-white" />
                <span>ADD TO VAULT</span>
              </button>
            </div>

          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION & AGENT MEMORY CONFIRMATION */}
        {step === 'SUCCESS' && createdPurchase && (
          <div className="space-y-6 py-2 text-center animate-in zoom-in-95 duration-200">
            
            {/* Success Icon */}
            <div className="w-16 h-16 bg-[#e8f5e9] border-[3px] border-[#2d2d2d] wobbly-card mx-auto flex items-center justify-center sketch-shadow">
              <CheckCircle2 className="w-10 h-10 text-[#10b981]" strokeWidth={2.5} />
            </div>

            <div>
              <span className="font-mono text-xs bg-[#10b981] text-white px-3 py-1 rounded font-bold uppercase">
                VAULT UPDATED
              </span>
              <h3 className="font-heading text-4xl font-bold text-[#2d2d2d] dark:text-white mt-1">
                {createdPurchase.name}
              </h3>
              <p className="font-body text-2xl text-[#10b981] font-bold">
                is now part of your purchase memory.
              </p>
            </div>

            {/* AGENT MEMORY CONFIRMATION STRIP */}
            <div className="p-4 bg-[#fff9c4] dark:bg-[#282a36] border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow text-left space-y-2 font-mono">
              <div className="flex items-center justify-between border-b border-[#2d2d2d]/30 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-[#2d5da1] dark:text-[#ff4d4d]">
                  <Sparkles className="w-4 h-4" /> PURCHASE ADDED TO MEMORY
                </span>
                <span className="text-xs bg-white dark:bg-black/30 border px-2 py-0.5 rounded font-bold text-[#2d2d2d] dark:text-white">
                  ID: {createdPurchase.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[#2d2d2d]/60 dark:text-white/60 block font-bold">VALUE</span>
                  <span className="font-bold text-base text-[#2d2d2d] dark:text-white">₹{createdPurchase.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#2d2d2d]/60 dark:text-white/60 block font-bold">WARRANTY PROTECTION</span>
                  <span className="font-bold text-base text-[#10b981]">{createdPurchase.daysRemaining} days remaining</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-[#2d2d2d]/30 text-xs font-bold text-[#10b981] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Available to your LifeReceipt agent & WebMCP tools</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  onSelectPurchase(createdPurchase);
                  handleResetAndClose();
                }}
                className="px-6 py-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold text-[#2d2d2d] dark:text-white hover:bg-[#fff9c4] transition-colors"
              >
                VIEW PURCHASE
              </button>

              <button
                onClick={handleResetAndClose}
                className="px-8 py-3 bg-[#2d5da1] text-white border-[3px] border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-2xl font-bold sketch-shadow-hover"
              >
                DONE
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
