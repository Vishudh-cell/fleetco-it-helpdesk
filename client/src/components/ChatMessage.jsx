import React from 'react';
import { Bot, User, AlertOctagon, Sparkles, AlertTriangle } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import CitationCard from './CitationCard';
import MarkdownView from './MarkdownView';

export default function ChatMessage({ message, onOpenEscalateModal }) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-3 my-5 animate-slideUp">
        <div className="max-w-[85%] md:max-w-[72%] bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white px-5 py-3.5 rounded-2xl rounded-br-sm shadow-lg shadow-cyan-950/30 text-sm font-medium leading-relaxed">
          <p className="whitespace-pre-wrap">{message.text}</p>
          <div className="text-[10px] text-cyan-200/80 mt-1.5 text-right font-mono">
            {message.timestamp || 'Just now'}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#16213D] border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-md">
          <User className="w-4 h-4 text-[#06B6D4]" />
        </div>
      </div>
    );
  }

  const { answer, confidence, source, retrievedChunks, autoEscalated, escalationId } = message;
  const isLowConfidence = typeof confidence === 'number' && confidence < 0.75;

  return (
    <div className="flex items-start gap-3.5 my-5 animate-slideUp">
      {/* Bot Icon with TinyFish Cyan glow */}
      <div className="w-9 h-9 rounded-xl bg-[#121A30] border border-cyan-500/40 flex items-center justify-center text-[#06B6D4] shrink-0 shadow-lg shadow-cyan-950/20 mt-1">
        <Bot className="w-5 h-5 text-[#06B6D4]" />
      </div>

      <div className="flex-1 max-w-[94%] md:max-w-[86%] rounded-2xl bg-[#121A30] border border-slate-700/60 p-5 shadow-xl shadow-black/30 text-slate-100 transition-all">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-[#06B6D4] border border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-[#06B6D4]" />
              TinyFish Agent
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">|</span>
            <span className="text-slate-400 text-xs hidden sm:inline">FleetCo Support</span>
          </div>

          <div className="flex items-center gap-2">
            {typeof confidence === 'number' && (
              <ConfidenceBadge confidence={confidence} />
            )}
          </div>
        </div>

        {/* Rendered Answer Body with Markdown */}
        <div className="text-sm text-slate-200">
          <MarkdownView content={answer} />
        </div>

        {/* Source Citation Card */}
        {source && (
          <CitationCard source={source} retrievedChunks={retrievedChunks} />
        )}

        {/* Pink/Red Escalation Badge & Button for Confidence < 0.75 */}
        {isLowConfidence && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-[#1F1322] to-rose-950/30 border border-rose-500/40 shadow-lg shadow-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-[#F43F5E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-[#FB7185] border border-rose-500/30">
                    Escalation Required
                  </span>
                  <span className="text-xs font-semibold text-rose-200">
                    Confidence Below 75%
                  </span>
                </div>
                <p className="text-xs text-rose-200/80 mt-1">
                  {autoEscalated
                    ? `Confidence (${(confidence * 100).toFixed(0)}%) is under threshold. Ticket #${escalationId || 'Pending'} automatically queued for Human IT Support.`
                    : 'Information may be incomplete. You can escalate directly to a human IT specialist.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenEscalateModal(message.originalQuestion || answer)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F43F5E] to-[#E11D48] hover:from-[#FB7185] hover:to-[#F43F5E] text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/40 transition-all transform active:scale-95 shrink-0"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Escalate to Human Support</span>
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-3 text-[10px] text-slate-500 text-right font-mono">
          {message.timestamp || 'Just now'}
        </div>
      </div>
    </div>
  );
}
