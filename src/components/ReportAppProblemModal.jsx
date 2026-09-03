import React, { useState } from 'react';
import { AlertTriangle, Paperclip, CheckCircle2, X, Send, Sparkles } from 'lucide-react';
import { webMcpAgent } from '../services/webMcpAgent';

export function ReportAppProblemModal({ isOpen, onClose }) {
  const [category, setCategory] = useState('Bug / Something is broken');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);

  if (!isOpen) return null;

  const categories = [
    "Bug / Something is broken",
    "Incorrect purchase information",
    "Incorrect warranty information",
    "Receipt issue",
    "Agent / WebMCP issue",
    "UI / Performance issue",
    "Other"
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Create real issue object in application state & log to agent history
    const issueObj = webMcpAgent.reportAppIssue({
      category,
      description,
      attachmentName: attachment
    });

    setSubmittedReport(issueObj);
  };

  const handleResetAndClose = () => {
    setSubmittedReport(null);
    setDescription('');
    setAttachment(null);
    setCategory('Bug / Something is broken');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2d2d2d]/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#fdfbf7] dark:bg-[#1f2028] border-[4px] border-[#2d2d2d] dark:border-white/30 wobbly-card sketch-shadow-lg p-6 text-[#2d2d2d] dark:text-[#f3f4f6] space-y-5">
        
        <div className="tape-strip" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] dark:border-white/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#ffebee] dark:bg-[#ff4d4d]/30 border-2 border-[#2d2d2d] dark:border-white/30 rounded">
              <AlertTriangle className="w-6 h-6 text-[#ff4d4d]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold leading-none">
                Something not working?
              </h2>
              <span className="font-mono text-xs text-[#ff4d4d] font-bold">
                REPORT AN ISSUE WITH LIFERECEIPT APPLICATION
              </span>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="p-1.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submittedReport ? (
          /* Report Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category Select */}
            <div>
              <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1.5 uppercase">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-xl font-bold text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#ff4d4d]"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1.5 uppercase">
                Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe what went wrong with the LifeReceipt app or WebMCP agent workflow..."
                className="w-full p-3 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-input font-body text-lg text-[#2d2d2d] dark:text-white placeholder-[#2d2d2d]/40 focus:outline-none focus:border-[#ff4d4d]"
              />
            </div>

            {/* Optional Attachment UI */}
            <div>
              <label className="font-mono text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70 block mb-1.5 uppercase">
                Optional Screenshot / Evidence Attachment:
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-white dark:bg-[#282a36] hover:bg-[#fff9c4] dark:hover:bg-[#2d5da1] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-lg font-bold text-[#2d2d2d] dark:text-white flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#2d5da1]" />
                  <span>{attachment ? 'Change File' : 'Attach File'}</span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>

                {attachment && (
                  <span className="font-mono text-xs bg-[#fff9c4] dark:bg-white/10 px-2 py-1 border border-[#2d2d2d] rounded font-bold">
                    📎 {attachment}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t-2 border-dashed border-[#2d2d2d]/30 dark:border-white/20 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 bg-white dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold text-[#2d2d2d] dark:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!description.trim()}
                className="px-6 py-2.5 bg-[#ff4d4d] text-white border-2 border-[#2d2d2d] dark:border-white/30 wobbly-btn font-body text-xl font-bold sketch-shadow-hover flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Submit Report</span>
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation Screen */
          <div className="space-y-5 text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#e8f5e9] border-[3px] border-[#2d2d2d] wobbly-card mx-auto flex items-center justify-center sketch-shadow">
              <CheckCircle2 className="w-10 h-10 text-[#10b981]" strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="font-heading text-4xl font-bold text-[#2d2d2d] dark:text-white">
                Report received
              </h3>
              <p className="font-body text-2xl text-[#10b981] font-bold mt-1">
                Thanks — LifeReceipt has logged your issue.
              </p>
            </div>

            <div className="p-4 bg-[#fff9c4] dark:bg-[#282a36] border-2 border-[#2d2d2d] dark:border-white/30 wobbly-sm text-left font-mono space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70">
                <span>REPORT ID:</span>
                <span className="text-[#ff4d4d] font-bold">{submittedReport.issueId}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70">
                <span>CATEGORY:</span>
                <span>{submittedReport.category}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-[#2d2d2d]/70 dark:text-white/70">
                <span>STATUS:</span>
                <span className="bg-[#10b981] text-white px-1.5 py-0.2 rounded text-[10px]">
                  {submittedReport.status}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-8 py-3 bg-[#2d5da1] text-white border-2 border-[#2d2d2d] wobbly-btn font-body text-xl font-bold sketch-shadow-hover"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
