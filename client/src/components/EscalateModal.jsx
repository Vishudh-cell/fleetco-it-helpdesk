import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function EscalateModal({ isOpen, onClose, question, onConfirmEscalation }) {
  const [reason, setReason] = useState('Confidence score below 0.75 threshold or unresolved by automated KB.');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmEscalation({ question, reason });
      setSuccessMsg('Escalation ticket successfully registered in SQLite database!');
      setTimeout(() => {
        setSuccessMsg('');
        setSubmitting(false);
        onClose();
      }, 1500);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#121A30] border border-rose-500/30 rounded-2xl shadow-2xl shadow-black/60 p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[#F43F5E]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-[#FB7185] border border-rose-500/30">
                Tier-2 IT Desk
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">Escalate to Human Support</h3>
            <p className="text-xs text-slate-400">Directly route this inquiry to FleetCo on-call specialists</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm flex items-center gap-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Support Inquiry:
              </label>
              <div className="p-3.5 bg-[#0B1020] border border-slate-700/80 rounded-xl text-xs text-slate-200 font-mono leading-relaxed">
                {question}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Escalation Details &amp; Notes:
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide additional details or context for the IT team..."
                className="w-full px-3.5 py-2.5 bg-[#0B1020] border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F43F5E] to-[#E11D48] hover:from-[#FB7185] hover:to-[#F43F5E] text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
              >
                {submitting ? 'Escalating...' : 'Submit Escalation Ticket'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
