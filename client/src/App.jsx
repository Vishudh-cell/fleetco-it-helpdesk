import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Database, BookOpen, AlertTriangle, Sparkles, 
  Cpu, Layers, ShieldCheck, CheckCircle2, MessageSquare 
} from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import EscalateModal from './components/EscalateModal';
import KnowledgeDrawer from './components/KnowledgeDrawer';
import ArchitectureView from './components/ArchitectureView';
import './App.css';

const SAMPLE_PROMPTS = [
  { label: 'Reset VPN & Duo MFA', query: 'How do I reset my FleetCo VPN connection and sync Duo MFA?' },
  { label: 'Password Rules & SSPR', query: 'What are the password complexity requirements and SSPR portal link?' },
  { label: 'Mobile Outlook Setup', query: 'How do I configure FleetCo Outlook email on iOS or Android?' },
  { label: 'Laptop Power Issue', query: 'My Lenovo ThinkPad will not power on. How do I reset it?' },
  { label: 'Slack Access & Channels', query: 'How do I join the FleetCo Slack workspace and request private channels?' },
  { label: '🍕 Low Confidence Demo (<75%)', query: 'Can I bring my pet iguana and order catering pizza for the conference room?' }
];

export default function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'architecture'
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      answer: "### Welcome to FleetCo IT Helpdesk\n\nI am your automated AI support assistant powered by **vector embeddings** and the **TinyFish** retrieval layer.\n\nAsk me any question regarding FleetCo IT systems, including:\n* **VPN Access & Gateways** (Cisco AnyConnect, WireGuard, Duo MFA)\n* **Password Resets** (SSPR, Okta SSO, complexity guidelines)\n* **Email Configuration** (Outlook Desktop & Intune Mobile)\n* **Hardware Troubleshooting** (Lenovo ThinkPad & MacBook resets)\n* **Slack Workspace** (Channels, guest permissions, SSO)\n\n> **Safety Notice:** If my retrieval confidence is under **75%**, I will immediately flag human escalation options.",
      confidence: 0.96,
      source: 'FleetCo IT Knowledge Base',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ interactionCount: 0, escalationCount: 0, avgConfidence: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('kb');
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [currentEscalateQuestion, setCurrentEscalateQuestion] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, loading, currentView]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/health');
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.warn('Backend not responding yet:', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSend = async (questionToSend) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || loading) return;

    if (currentView !== 'chat') {
      setCurrentView('chat');
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const botMsg = {
        id: `bot-${data.id || Date.now()}`,
        sender: 'bot',
        originalQuestion: q,
        answer: data.answer,
        confidence: data.confidence,
        source: data.source,
        retrievedChunks: data.retrievedChunks,
        needsEscalation: data.needsEscalation,
        autoEscalated: data.autoEscalated,
        escalationId: data.escalationId,
        timestamp: new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      if (data.autoEscalated) {
        showToast(`⚠️ Low confidence detected (${(data.confidence * 100).toFixed(0)}%). Ticket #${data.escalationId} auto-escalated to human support queue.`);
      }

      fetchHealth();
    } catch (err) {
      console.error('Failed to ask question:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          originalQuestion: q,
          answer: `### Connection Error\n\nUnable to reach the FleetCo Helpdesk service: \`${err.message}\`.\n\nPlease check that the server is running on \`http://localhost:5000\`.`,
          confidence: 0.1,
          source: 'Error',
          needsEscalation: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalateConfirm = async ({ question, reason }) => {
    const res = await fetch('/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, reason })
    });

    if (!res.ok) {
      throw new Error('Escalation failed');
    }

    const data = await res.json();
    showToast(`✅ Escalation Ticket #${data.escalation.id} confirmed for Human IT Support!`);
    fetchHealth();
    return data;
  };

  const openDrawerWithTab = (tab) => {
    setDrawerTab(tab);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans tech-grid-bg">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-md bg-[#121A30] border border-cyan-500/60 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl shadow-black/60 animate-fadeIn flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#06B6D4] shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Modern SaaS Header */}
      <header className="border-b border-white/[0.08] bg-[#0B1020]/90 backdrop-blur-md sticky top-0 z-30 px-5 lg:px-8 py-3.5 flex items-center justify-between shadow-md shadow-black/20">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3.5">
          <div 
            onClick={() => setCurrentView('chat')}
            className="w-10 h-10 rounded-xl bg-[#121A30] border border-cyan-500/40 flex items-center justify-center text-[#06B6D4] shadow-lg shadow-cyan-950/40 cursor-pointer hover:border-cyan-400 transition-all"
            title="Go to Helpdesk Chat"
          >
            <Bot className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 
                onClick={() => setCurrentView('chat')}
                className="text-sm font-bold text-white tracking-wide cursor-pointer hover:text-cyan-300 transition-colors"
              >
                FleetCo IT Helpdesk
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-[#06B6D4] border border-cyan-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse"></span>
                TinyFish Retrieval Layer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Vector Grounded AI Assistant with 75% Escalation Threshold
            </p>
          </div>
        </div>

        {/* Dashboard Nav & Triggers */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* View Toggle: Chat vs Architecture */}
          <button
            onClick={() => setCurrentView(currentView === 'architecture' ? 'chat' : 'architecture')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              currentView === 'architecture'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-950/40'
                : 'bg-[#121A30] hover:bg-[#16213D] text-[#06B6D4] border border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            {currentView === 'architecture' ? (
              <>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat View</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5" />
                <span>Architecture</span>
              </>
            )}
          </button>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#121A30] border border-white/[0.08] text-xs shadow-inner">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Database className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Logs: <strong className="text-white font-mono">{stats.interactionCount}</strong></span>
            </div>
            <div className="w-px h-3.5 bg-slate-700/60"></div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F43F5E]" />
              <span>Escalated: <strong className="text-[#FB7185] font-mono">{stats.escalationCount}</strong></span>
            </div>
          </div>

          {/* Knowledge Base Drawer Button */}
          <button
            onClick={() => openDrawerWithTab('kb')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#121A30] hover:bg-[#16213D] text-slate-200 text-xs font-semibold rounded-xl border border-white/[0.08] hover:border-cyan-500/30 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span className="hidden sm:inline">KB Docs</span>
          </button>

          {/* Escalations Drawer Button */}
          <button
            onClick={() => openDrawerWithTab('escalations')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-[#FB7185] text-xs font-semibold rounded-xl border border-rose-500/30 transition-all shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#F43F5E]" />
            <span className="hidden sm:inline">Queue</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Either Architecture Page OR Chat Window */}
      {currentView === 'architecture' ? (
        <ArchitectureView onBackToChat={() => setCurrentView('chat')} />
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between overflow-hidden">
          
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 custom-scrollbar">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onOpenEscalateModal={(q) => {
                  setCurrentEscalateQuestion(q);
                  setEscalateModalOpen(true);
                }}
              />
            ))}

            {loading && (
              <div className="flex items-start gap-3.5 my-5 animate-slideUp">
                <div className="w-9 h-9 rounded-xl bg-[#121A30] border border-cyan-500/40 flex items-center justify-center text-[#06B6D4] shrink-0 shadow-lg shadow-cyan-950/20 mt-1">
                  <Bot className="w-5 h-5 text-[#06B6D4] animate-pulse" />
                </div>
                <div className="rounded-2xl bg-[#121A30] border border-cyan-500/20 p-4 text-xs text-slate-300 flex items-center gap-3 shadow-xl">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-bounce"></span>
                  </div>
                  <span className="font-medium text-slate-300">
                    TinyFish vector retrieval &amp; grounded context synthesis in progress...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Example Query Prompt Pills */}
          <div className="mb-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Select a query to test vector grounding &amp; escalation thresholds:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.query)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#121A30] hover:bg-[#16213D] border border-white/[0.08] hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all shadow-sm disabled:opacity-40"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Query Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center gap-2 bg-[#121A30] border border-white/[0.12] focus-within:border-[#06B6D4] focus-within:shadow-[0_0_15px_rgba(6,182,212,0.2)] rounded-2xl p-2 shadow-2xl transition-all"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask an IT support question (e.g., 'VPN login failed', 'Email setup', 'Laptop won't power on')..."
              disabled={loading}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || loading}
              className="p-3 bg-gradient-to-r from-[#06B6D4] to-[#0284C7] hover:from-[#22D3EE] hover:to-[#0EA5E9] text-white rounded-xl transition-all shadow-lg shadow-cyan-950/40 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
              title="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </main>
      )}

      {/* Side Knowledge & Audit Drawer */}
      <KnowledgeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={drawerTab}
      />

      {/* Escalation Modal */}
      <EscalateModal
        isOpen={escalateModalOpen}
        onClose={() => setEscalateModalOpen(false)}
        question={currentEscalateQuestion}
        onConfirmEscalation={handleEscalateConfirm}
      />
    </div>
  );
}
