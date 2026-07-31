import React from 'react';
import { AgentState, Claim, RoomMessage } from '../types';
import { SPECIALIST_META } from '../data/presets';
import { Bot, MessageSquare, CheckCircle2, Shield, User } from 'lucide-react';

interface AgentInspectorModalProps {
  agent: AgentState;
  claims: Claim[];
  messages: RoomMessage[];
  onClose: () => void;
}

export const AgentInspectorModal: React.FC<AgentInspectorModalProps> = ({
  agent,
  claims,
  messages,
  onClose,
}) => {
  const roleMeta =
    agent.role && agent.tier !== 'orchestrator'
      ? SPECIALIST_META[agent.role]
      : null;

  const agentClaims = claims.filter(
    (c) => c.agentId === agent.id || (agent.role && c.agentRole === agent.role)
  );
  const agentMessages = messages.filter((m) => m.senderId === agent.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg border border-[#1A1A1A] bg-white p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-[#1A1A1A] bg-[#F9F8F6] text-2xl">
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-[#1A1A1A]">{agent.name}</h2>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/20 bg-[#F2F0EB] text-[#1A1A1A]">
                  {agent.tier}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#1A1A1A]/60">{roleMeta ? roleMeta.lane : agent.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="font-mono text-xs text-[#1A1A1A]/60 hover:text-[#1A1A1A]">
            ✕
          </button>
        </div>

        {/* Brief */}
        <div>
          <h3 className="font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-1">
            CURRENT SCOPED BRIEF
          </h3>
          <div className="border border-[#1A1A1A]/15 bg-[#F9F8F6] p-3 font-serif text-xs text-[#1A1A1A] leading-relaxed">
            {agent.activeBrief}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="border border-[#1A1A1A]/20 bg-white p-2.5">
            <div className="text-[#1A1A1A]/60 text-[9px] font-bold uppercase">Submitted Claims</div>
            <div className="text-sm font-bold text-[#1A1A1A]">{agentClaims.length}</div>
          </div>
          <div className="border border-[#1A1A1A]/20 bg-white p-2.5">
            <div className="text-[#1A1A1A]/60 text-[9px] font-bold uppercase">Room Messages</div>
            <div className="text-sm font-bold text-[#1A1A1A]">{agentMessages.length}</div>
          </div>
          <div className="border border-[#1A1A1A]/20 bg-white p-2.5">
            <div className="text-[#1A1A1A]/60 text-[9px] font-bold uppercase">Laborer Budget</div>
            <div className="text-sm font-bold text-[#B45309]">
              {agent.laborerBudgetRemaining}
            </div>
          </div>
        </div>

        {/* Submitted Claims List */}
        <div>
          <h3 className="font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-2">
            SUBMITTED FINDINGS ({agentClaims.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {agentClaims.length === 0 ? (
              <div className="font-serif text-xs text-[#1A1A1A]/50 text-center py-4 italic">No claims posted yet.</div>
            ) : (
              agentClaims.map((c) => (
                <div key={c.id} className="border border-[#1A1A1A]/15 bg-[#F9F8F6] p-2.5 text-xs text-[#1A1A1A] space-y-1">
                  <div className="font-serif font-bold">"{c.statement}"</div>
                  <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                    Source: {c.source} ({c.sourceTier})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 font-mono">
          <button
            onClick={onClose}
            className="border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-1.5 text-xs uppercase font-semibold text-white hover:bg-[#D43F3F] hover:border-[#D43F3F]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
