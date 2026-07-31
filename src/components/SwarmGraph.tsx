import React from 'react';
import { AgentState, LaborerTask, Claim } from '../types';
import { SPECIALIST_META } from '../data/presets';
import { BrainCircuit, Cpu, Bot, Shield, CheckCircle2, MessageSquare, ExternalLink, Award } from 'lucide-react';

interface SwarmGraphProps {
  agents: AgentState[];
  claims: Claim[];
  laborers: LaborerTask[];
  onSelectAgent: (agent: AgentState) => void;
  activeAgentId?: string;
}

interface PerformanceBadge {
  label: string;
  colorClass: string;
}

const getPerformanceBadges = (
  ag: AgentState,
  claims: Claim[],
  laborers: LaborerTask[]
): PerformanceBadge[] => {
  const badges: PerformanceBadge[] = [];
  const role = ag.role || 'frontier_research';
  const agentClaims = claims.filter((c) => c.agentRole === role);
  const corroboratedCount =
    agentClaims.filter((c) => c.status === 'corroborated').length + (ag.corroborationsCount || 0);
  const totalClaims = agentClaims.length + (ag.claimsCount || 0);
  const confidence = ag.confidenceScore ?? 0.88;
  const agentLaborers = laborers.filter((l) => l.parentAgentId === ag.id);

  // High Accuracy badge
  if (confidence >= 0.90 || corroboratedCount >= 2) {
    badges.push({
      label: 'High Accuracy',
      colorClass: 'border-[#2A6F47]/40 bg-[#2A6F47]/10 text-[#2A6F47]',
    });
  }

  // Deep Researcher badge
  if (totalClaims >= 2 || agentLaborers.length >= 1 || (ag.claimsCount && ag.claimsCount >= 2)) {
    badges.push({
      label: 'Deep Researcher',
      colorClass: 'border-[#0284c7]/40 bg-[#0284c7]/10 text-[#0284c7]',
    });
  }

  // Rigorous Auditor badge
  if (ag.challengesCount && ag.challengesCount >= 1) {
    badges.push({
      label: 'Rigorous Auditor',
      colorClass: 'border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#7c3aed]',
    });
  }

  // Default fallback if no badges apply
  if (badges.length === 0) {
    badges.push({
      label: 'Domain Specialist',
      colorClass: 'border-[#1A1A1A]/20 bg-[#F2F0EB] text-[#1A1A1A]',
    });
  }

  return badges;
};

export const SwarmGraph: React.FC<SwarmGraphProps> = ({
  agents,
  claims,
  laborers,
  onSelectAgent,
  activeAgentId,
}) => {
  const orchestrator = agents.find((a) => a.tier === 'orchestrator');
  const specialists = agents.filter((a) => a.tier === 'specialist');

  return (
    <div className="border border-[#1A1A1A] bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-[#1A1A1A]/20 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#1A1A1A]" />
            Swarm Topology & Agent State Map
          </h2>
          <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest mt-0.5">
            Tier 1 Orchestrator → Tier 2 Specialist Council → Short-lived Tier 3 Laborers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-[#1A1A1A]" /> Tier 1 Orchestrator
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-purple-700" /> Tier 2 Specialists ({specialists.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 bg-[#B45309]" /> Tier 3 Laborers ({laborers.length})
          </span>
        </div>
      </div>

      {/* Tier 1: Orchestrator Node */}
      {orchestrator && (
        <div className="flex justify-center mb-6">
          <div
            onClick={() => onSelectAgent(orchestrator)}
            className={`group cursor-pointer flex items-center gap-4 border bg-[#F9F8F6] p-4 px-6 transition-all duration-200 hover:border-[#1A1A1A] ${
              activeAgentId === orchestrator.id
                ? 'border-[#1A1A1A] bg-white ring-2 ring-[#1A1A1A]'
                : 'border-[#1A1A1A]/30'
            }`}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] text-white text-xl shadow-sm">
              {orchestrator.avatar}
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D43F3F] text-[7px] font-bold text-white" title="Council Lead">
                ★
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[9px] font-bold text-[#D43F3F] uppercase tracking-widest">TIER 1 ORCHESTRATOR</span>
                <span className="border border-[#1A1A1A] bg-white px-2 py-0.2 font-mono text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                  COUNCIL LEAD
                </span>
                <span className="border border-[#2A6F47]/40 bg-[#2A6F47]/10 px-1.5 py-0.2 font-mono text-[8px] font-bold text-[#2A6F47] uppercase tracking-wider">
                  HIGH ACCURACY
                </span>
              </div>
              <div className="font-serif text-base font-bold text-[#1A1A1A]">{orchestrator.name}</div>
              <div className="text-xs text-[#1A1A1A]/70 line-clamp-1 max-w-md font-sans">
                {orchestrator.activeBrief}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connector lines to Tier 2 */}
      <div className="relative flex justify-center mb-6">
        <div className="h-6 w-px bg-[#1A1A1A]" />
      </div>

      {/* Tier 2: Specialists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {specialists.map((ag) => {
          const role = ag.role || 'frontier_research';
          const meta = SPECIALIST_META[role] || SPECIALIST_META['frontier_research'];
          const agentClaims = claims.filter((c) => c.agentRole === role);
          const corroboratedCount = agentClaims.filter((c) => c.status === 'corroborated').length;
          const agentLaborers = laborers.filter((l) => l.parentAgentId === ag.id);
          const performanceBadges = getPerformanceBadges(ag, claims, laborers);

          return (
            <div
              key={ag.id}
              onClick={() => onSelectAgent(ag)}
              className={`cursor-pointer border p-4 bg-white transition-all duration-200 hover:border-[#1A1A1A] flex flex-col justify-between ${
                activeAgentId === ag.id
                  ? 'border-[#1A1A1A] bg-[#F9F8F6] ring-2 ring-[#1A1A1A]'
                  : 'border-[#1A1A1A]/20'
              }`}
              style={{ borderTopColor: ag.color, borderTopWidth: '3px' }}
            >
              <div>
                <div className="flex items-center justify-between mb-2 border-b border-[#1A1A1A]/10 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex items-center justify-center">
                      <span className="text-base">{ag.avatar}</span>
                    </div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-[#1A1A1A]/20 bg-[#F2F0EB] text-[#1A1A1A]">
                      Tier 2
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#1A1A1A]/60">
                    Budget: {ag.laborerBudgetRemaining}
                  </span>
                </div>

                <div className="font-serif text-sm font-bold text-[#1A1A1A] mb-0.5">{ag.name}</div>
                <div className="font-mono text-[9px] font-bold text-[#D43F3F] uppercase tracking-wider mb-1.5">{meta.lane}</div>

                {/* Performance Badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {performanceBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className={`font-mono text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 border ${badge.colorClass}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-[#1A1A1A]/80 bg-[#F9F8F6] p-2 border border-[#1A1A1A]/10 line-clamp-2 font-sans">
                  {ag.activeBrief}
                </div>
              </div>

              {/* Agent Metrics */}
              <div className="mt-4 pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-between font-mono text-[10px] text-[#1A1A1A]/70">
                <span className="flex items-center gap-1" title="Claims posted">
                  <MessageSquare className="h-3 w-3 text-[#1A1A1A]" />
                  {agentClaims.length} Claims
                </span>
                <span className="flex items-center gap-1" title="Corroborated claims">
                  <CheckCircle2 className="h-3 w-3 text-[#2A6F47]" />
                  {corroboratedCount} Valid
                </span>
                <span className="flex items-center gap-1" title="Laborers spawned">
                  <Bot className="h-3 w-3 text-[#B45309]" />
                  {agentLaborers.length} Tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier 3: Spawned Laborers Section */}
      {laborers.length > 0 && (
        <div className="mt-8 pt-4 border-t border-[#1A1A1A]/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-xs font-bold text-[#B45309] uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-[#B45309]" />
              Active Tier 3 Disposable Laborers ({laborers.length})
            </h3>
            <span className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-wider">
              Short-lived single-purpose task runners
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {laborers.map((lab) => (
              <div
                key={lab.id}
                className="border border-[#B45309] bg-amber-50 px-3 py-1.5 font-sans text-xs text-[#1A1A1A] flex items-center gap-2"
              >
                <span className="h-2 w-2 bg-[#B45309] animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-[#B45309] uppercase">[{lab.taskType.toUpperCase()}]</span>
                <span className="text-[#1A1A1A]/80 truncate max-w-xs">{lab.description}</span>
                <span className="font-mono text-[9px] text-[#1A1A1A]/60 uppercase">By {lab.parentAgentName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

