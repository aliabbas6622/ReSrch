import React, { useState } from 'react';
import { Send, Sparkles, Brain, Loader2, ArrowUp, Zap, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { SwarmSession } from '../types';

interface OrchestratorChatBarProps {
  session: SwarmSession | null;
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
}

const QUICK_PROMPTS = [
  { label: '🛡️ Audit Security', prompt: 'Audit key security failure modes and adversarial risk bounds for this topic.' },
  { label: '⚡ Run Laborer Check', prompt: 'Trigger a Tier 3 Laborer task to calculate mathematical bounds and verify citations.' },
  { label: '📜 Consensus Summary', prompt: 'Provide an executive summary of the current corroborated claims and open disputes.' },
  { label: '⚖️ Ethical Audit', prompt: 'Analyze legal liability models, EU AI Act compliance, and bio-ethical boundaries.' },
];

export const OrchestratorChatBar: React.FC<OrchestratorChatBarProps> = ({
  session,
  onSendMessage,
  isSending,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSending) return;
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  const handleSelectPrompt = (promptText: string) => {
    setInput(promptText);
  };

  return (
    <div className="sticky bottom-0 z-30 w-full bg-gradient-to-t from-[#F9F8F6] via-[#F9F8F6]/95 to-transparent pt-4 pb-4 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#1A1A1A]/50 shrink-0 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#B45309]" /> PROMPT LEAD:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPrompt(qp.prompt)}
              className="font-mono text-[10px] whitespace-nowrap border border-[#1A1A1A]/15 bg-white/80 hover:bg-white hover:border-[#D43F3F] text-[#1A1A1A]/80 px-2.5 py-1 rounded-full shadow-2xs transition-all duration-150 shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* ChatGPT Style Floating Input Box */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center border border-[#1A1A1A]/20 bg-white shadow-md focus-within:border-[#D43F3F] focus-within:ring-1 focus-within:ring-[#D43F3F]/30 transition-all rounded-2xl overflow-hidden p-1.5"
        >
          <div className="flex items-center justify-center pl-3 pr-2 text-[#1A1A1A]/60">
            <Brain className="h-4 w-4 text-[#6366f1] animate-pulse" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder={
              session
                ? `Send direct query or directive to Orchestrator Lead (Topic: "${session.topic.slice(0, 30)}...")...`
                : 'Ask Orchestrator Lead to convene a custom research council...'
            }
            className="flex-1 bg-transparent py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1A1A] text-white hover:bg-[#D43F3F] disabled:opacity-30 disabled:hover:bg-[#1A1A1A] transition-all shrink-0 ml-1"
            title="Send Directive to Orchestrator"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </form>

        {/* Sending Progress Pill */}
        {isSending && (
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-[#6366f1] bg-[#6366f1]/10 py-1 px-3 rounded-full animate-fade-in max-w-fit mx-auto">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Orchestrator Council Lead processing research directive...</span>
          </div>
        )}
      </div>
    </div>
  );
};
