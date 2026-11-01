import React, { useState, useEffect } from 'react';
import { 
  X, Database, BookOpen, AlertTriangle, FileText, 
  RefreshCw, Clock, ChevronRight, CheckCircle2 
} from 'lucide-react';
import MarkdownView from './MarkdownView';

export default function KnowledgeDrawer({ isOpen, onClose, activeTab = 'kb' }) {
  const [tab, setTab] = useState(activeTab);
  const [documents, setDocuments] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'kb') {
        const res = await fetch('/kb');
        const data = await res.json();
        setDocuments(data.documents || []);
        if (data.documents && data.documents.length > 0 && !selectedDoc) {
          setSelectedDoc(data.documents[0]);
        }
      } else if (tab === 'interactions') {
        const res = await fetch('/interactions');
        const data = await res.json();
        setInteractions(data.interactions || []);
      } else if (tab === 'escalations') {
        const res = await fetch('/escalations');
        const data = await res.json();
        setEscalations(data.escalations || []);
      }
    } catch (err) {
      console.error('Failed to load drawer data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl h-full bg-[#0B1020] border-l border-cyan-500/20 shadow-2xl flex flex-col text-slate-200">
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 bg-[#0E1528] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Database className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">FleetCo IT Control Center</h2>
              <p className="text-[11px] text-slate-400">Knowledge Base &amp; SQLite Audit Records</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh Records"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#06B6D4]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-[#0E1528]/80 text-xs font-semibold px-6 pt-2 gap-2">
          <button
            onClick={() => setTab('kb')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              tab === 'kb'
                ? 'border-[#06B6D4] text-[#06B6D4]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Base ({documents.length || 5})</span>
          </button>

          <button
            onClick={() => setTab('interactions')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              tab === 'interactions'
                ? 'border-[#06B6D4] text-[#06B6D4]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Interactions</span>
          </button>

          <button
            onClick={() => setTab('escalations')}
            className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all ${
              tab === 'escalations'
                ? 'border-[#F43F5E] text-[#FB7185]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#F43F5E]" />
            <span>Escalations Queue</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {tab === 'kb' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {documents.map((doc) => (
                  <button
                    key={doc.fileName}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3.5 text-left rounded-xl border transition-all text-xs ${
                      selectedDoc?.fileName === doc.fileName
                        ? 'bg-[#16213D] border-[#06B6D4] text-cyan-200 shadow-md shadow-cyan-950/20'
                        : 'bg-[#121A30] border-slate-800 text-slate-300 hover:bg-[#152038]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText className="w-4 h-4 text-[#06B6D4] shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 pl-6">
                      {doc.sections?.length || 0} indexed sections
                    </div>
                  </button>
                ))}
              </div>

              {selectedDoc && (
                <div className="p-5 bg-[#121A30] border border-cyan-500/20 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <h3 className="text-sm font-bold text-white">{selectedDoc.title}</h3>
                    <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                      {selectedDoc.fileName}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedDoc.sections?.map((sec, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#0E1528] border border-slate-800 text-xs">
                        <div className="font-semibold text-cyan-300 mb-1.5 flex items-center gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-[#06B6D4]" />
                          {sec.section}
                        </div>
                        <div className="text-slate-300 text-xs">
                          <MarkdownView content={sec.preview} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'interactions' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                <span>SQLite Interactions History</span>
                <span className="text-[#06B6D4] font-mono text-[11px]">{interactions.length} records</span>
              </div>
              {interactions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  No interactions recorded yet. Ask a question in chat to log one!
                </div>
              ) : (
                interactions.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-[#121A30] border border-slate-800 rounded-xl text-xs space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-bold text-cyan-400">Interaction #{item.id}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-cyan-300">Q: </span>
                      <span className="text-slate-200">{item.question}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[11px] text-slate-400 truncate max-w-[260px]">
                        {item.source}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.confidence >= 0.75 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {(item.confidence * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'escalations' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                <span>Human Support Escalation Queue</span>
                <span className="text-[#FB7185] font-mono text-[11px] font-bold">{escalations.length} tickets</span>
              </div>
              {escalations.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  No active escalations. Questions with &lt; 75% confidence will appear here.
                </div>
              ) : (
                escalations.map((esc) => (
                  <div 
                    key={esc.id} 
                    className="p-4 bg-[#1F1322]/80 border border-rose-500/30 rounded-xl text-xs space-y-2.5 shadow-md shadow-rose-950/20"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-rose-400 border-b border-rose-900/40 pb-2">
                      <span className="font-bold flex items-center gap-1.5 text-[#FB7185]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F43F5E]" />
                        Ticket #{esc.id}
                      </span>
                      <span>{new Date(esc.timestamp).toLocaleString()}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-rose-300">Question: </span>
                      <p className="text-slate-200 mt-1">{esc.question}</p>
                    </div>

                    <div className="bg-[#121A30] p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                      <span className="text-slate-400 font-medium">Reason: </span>
                      {esc.reason}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
