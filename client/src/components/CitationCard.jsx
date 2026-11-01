import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Layers, FileText } from 'lucide-react';
import MarkdownView from './MarkdownView';

export default function CitationCard({ source, retrievedChunks = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!source || source === 'None') return null;

  return (
    <div className="mt-4 rounded-xl border border-cyan-500/20 bg-[#121A30]/90 shadow-lg shadow-black/20 overflow-hidden transition-all duration-200">
      {/* Header clickable card */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-[#16213D]/80 hover:bg-[#1A284A] cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-[#06B6D4]" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Source Citation:
            </span>
            <span className="text-xs font-semibold text-cyan-300 truncate">
              {source}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          {retrievedChunks && retrievedChunks.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#0B1020] text-cyan-300 border border-cyan-500/30">
              <Layers className="w-3 h-3 text-[#06B6D4]" />
              <span>{retrievedChunks.length} Chunks</span>
            </span>
          )}
          <div className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Context Chunks */}
      {isExpanded && (
        <div className="p-4 space-y-3 bg-[#0E1528] border-t border-cyan-500/10 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="uppercase tracking-wider">Indexed Vector Retrieval Context:</span>
            <span className="text-cyan-400 font-mono text-[10px]">TinyFish Embedding Engine</span>
          </div>

          <div className="space-y-2.5">
            {retrievedChunks.map((chunk, idx) => (
              <div
                key={chunk.id || idx}
                className="p-3.5 rounded-lg bg-[#141E38] border border-slate-700/60 shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/50 text-[11px]">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-medium truncate">
                    <FileText className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
                    <span className="truncate">{chunk.docName} › {chunk.section}</span>
                  </div>
                  {chunk.score && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0 ml-2">
                      Score: {(chunk.score * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                <div className="text-slate-300 text-xs">
                  <MarkdownView content={chunk.preview || chunk.content} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
