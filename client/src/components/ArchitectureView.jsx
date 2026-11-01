import React from 'react';
import { 
  Layers, Server, Database, Sparkles, ShieldCheck, 
  AlertTriangle, ArrowDown, ArrowRight, Cpu, Globe, 
  Terminal, CheckCircle2, FileText, ArrowLeft, ExternalLink 
} from 'lucide-react';

export default function ArchitectureView({ onBackToChat }) {
  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 overflow-y-auto custom-scrollbar animate-fadeIn text-slate-100">
      
      {/* Page Title & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-[#06B6D4] border border-cyan-500/30">
              System Specification
            </span>
            <span className="text-xs text-slate-400 font-mono">v1.0.0 Architecture</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            FleetCo IT Helpdesk Architecture &amp; Data Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end overview of vector retrieval, TinyFish grounding, confidence scoring, and SQLite persistence.
          </p>
        </div>

        <button
          onClick={onBackToChat}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#121A30] hover:bg-[#16213D] border border-cyan-500/30 hover:border-cyan-500 text-[#06B6D4] hover:text-white text-xs font-bold rounded-xl transition-all shadow-md self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Helpdesk Chat</span>
        </button>
      </div>

      {/* Visual Architecture Flow Diagram */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0E1528] border border-cyan-500/20 shadow-2xl shadow-black/50 mb-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-6 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#06B6D4]" />
          <span>Interactive Architectural Pipeline Flow</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          
          {/* Node 1: Frontend Client */}
          <div className="p-5 rounded-2xl bg-[#121A30] border border-slate-700 shadow-xl flex flex-col justify-between relative group hover:border-[#06B6D4] transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">LAYER 1</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#06B6D4] mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">React Client</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Modern SaaS Dark UI with Markdown rendering, pill confidence badges, citation cards, and quick prompt chips.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              Vite + React 18 + Lucide
            </div>
          </div>

          {/* Node 2: API Gateway */}
          <div className="p-5 rounded-2xl bg-[#121A30] border border-slate-700 shadow-xl flex flex-col justify-between relative group hover:border-[#06B6D4] transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">LAYER 2</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#06B6D4] mb-3">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Express API Gateway</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                REST controllers managing <code className="text-cyan-300">/ask</code>, <code className="text-cyan-300">/escalate</code>, <code className="text-cyan-300">/health</code>, and SQLite queries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              Node.js v24 + CORS
            </div>
          </div>

          {/* Node 3: TinyFish & Vector Engine */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#16213D] to-[#121A30] border border-cyan-500/40 shadow-xl shadow-cyan-950/20 flex flex-col justify-between relative group hover:border-[#06B6D4] transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-300 font-bold">LAYER 3</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-[#06B6D4] border border-cyan-500/40">
                  CORE ENGINE
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-[#06B6D4] mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">TinyFish Retrieval Layer</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                384-dimensional dense vectors + cosine search + live TinyFish API (<code className="text-cyan-300">api.search.tinyfish.ai</code>).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] font-mono text-cyan-300 font-bold">
              Grounding &amp; Confidence Scorer
            </div>
          </div>

          {/* Node 4: Persistence & Escalation */}
          <div className="p-5 rounded-2xl bg-[#121A30] border border-slate-700 shadow-xl flex flex-col justify-between relative group hover:border-[#06B6D4] transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">LAYER 4</span>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-[#F43F5E] mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">SQLite &amp; Escalation</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Atomic WAL storage for all interactions and automatic routing of queries with confidence &lt; 0.75.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
              better-sqlite3 (WAL Mode)
            </div>
          </div>

        </div>

        {/* Data Flow Legend Steps */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[#121A30] border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-[#06B6D4] font-bold flex items-center justify-center shrink-0">1</span>
            <div>
              <strong className="text-white block font-semibold">User Query Intake</strong>
              <span className="text-slate-400">Employee submits question via chat or quick prompt chip.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121A30] border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-[#06B6D4] font-bold flex items-center justify-center shrink-0">2</span>
            <div>
              <strong className="text-white block font-semibold">Vector &amp; TinyFish Search</strong>
              <span className="text-slate-400">Cosine similarity on 5 KB guides + live TinyFish search check.</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#121A30] border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-[#06B6D4] font-bold flex items-center justify-center shrink-0">3</span>
            <div>
              <strong className="text-white block font-semibold">Confidence Threshold Gate</strong>
              <span className="text-slate-400">Score &ge; 75%: Verified answer. Score &lt; 75%: Auto-escalated to human queue.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Deep Dives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Deep Dive 1: TinyFish Grounding */}
        <div className="p-6 rounded-2xl bg-[#121A30] border border-slate-700/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#06B6D4]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">TinyFish Retrieval &amp; Grounding Architecture</h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The TinyFish core service (<code className="text-cyan-300">src/services/tinyfish.js</code>) manages dual retrieval sources:
          </p>

          <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-5">
            <li>
              <strong className="text-white">Internal Vector Retrieval:</strong> Parses 5 local markdown documentation guides into semantic chunks, indexing 384-dimensional dense vectors calculated using subword n-gram hashing and inverse-document weights.
            </li>
            <li>
              <strong className="text-white">Live TinyFish Cloud API:</strong> Interrogates <code className="text-cyan-300">https://api.search.tinyfish.ai</code> with your authorized API key to verify vendor documentation in real-time.
            </li>
            <li>
              <strong className="text-white">Citation Card Generation:</strong> Pinpoints the exact document name, section header, and relevance percentage for complete transparency.
            </li>
          </ul>
        </div>

        {/* Deep Dive 2: Confidence & Guardrail Engine */}
        <div className="p-6 rounded-2xl bg-[#121A30] border border-slate-700/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">Calibrated Confidence &amp; Escalation Gate</h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            To prevent hallucinations, queries are dynamically calibrated against a composite scoring formula:
          </p>

          <div className="p-3 bg-[#0B1020] rounded-xl border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
            <div className="text-cyan-300">Score = (VectorSim &times; 0.60) + (KeywordOverlap &times; 0.25) + (HeaderMatch &times; 0.15)</div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <span className="font-bold text-emerald-300 block mb-1">&ge; 75% Confidence</span>
              <span className="text-emerald-200/80 text-[11px]">Deliver verified answer with green pill badge and citation card.</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs">
              <span className="font-bold text-rose-300 block mb-1">&lt; 75% Confidence</span>
              <span className="text-rose-200/80 text-[11px]">Auto-record in SQLite escalations table &amp; present human handoff.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Database Schema Reference */}
      <div className="p-6 rounded-2xl bg-[#121A30] border border-slate-700/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#06B6D4]" />
            <h4 className="text-sm font-bold text-white">SQLite Relational Schema (WAL Mode Enabled)</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">fleetco_helpdesk.db</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#0B1020] border border-slate-800">
            <div className="text-cyan-400 font-bold mb-2 pb-1 border-b border-slate-800">TABLE: interactions</div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div>- id (INTEGER PRIMARY KEY)</div>
              <div>- question (TEXT)</div>
              <div>- answer (TEXT)</div>
              <div>- confidence (REAL)</div>
              <div>- source (TEXT)</div>
              <div>- timestamp (DATETIME)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1020] border border-rose-950/60">
            <div className="text-[#FB7185] font-bold mb-2 pb-1 border-b border-slate-800">TABLE: escalations</div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div>- id (INTEGER PRIMARY KEY)</div>
              <div>- question (TEXT)</div>
              <div>- reason (TEXT)</div>
              <div>- timestamp (DATETIME)</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
