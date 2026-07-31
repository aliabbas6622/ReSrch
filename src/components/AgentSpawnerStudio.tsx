import React, { useState } from 'react';
import {
  UserPlus,
  Cpu,
  BrainCircuit,
  Zap,
  Bot,
  Sparkles,
  Trash2,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Sliders,
  Radio,
  Infinity as InfinityIcon,
  Layers,
} from 'lucide-react';
import { AgentState, SpecialistRole, SwarmSession } from '../types';
import { SPECIALIST_META } from '../data/presets';

interface AgentSpawnerStudioProps {
  session: SwarmSession | null;
  agents: AgentState[];
  onAddCustomAgent: (newAgent: AgentState) => void;
  onRemoveAgent: (agentId: string) => void;
  onOrchestratorAutoSpawn: () => void;
}

export const AgentSpawnerStudio: React.FC<AgentSpawnerStudioProps> = ({
  session,
  agents,
  onAddCustomAgent,
  onRemoveAgent,
  onOrchestratorAutoSpawn,
}) => {
  const [roleName, setRoleName] = useState('');
  const [laneName, setLaneName] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('🔬');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [agentTier, setAgentTier] = useState<'tier2_specialist' | 'tier3_laborer'>('tier2_specialist');
  const [colorHex, setColorHex] = useState('#D43F3F');

  const [isSpawningAuto, setIsSpawningAuto] = useState(false);

  const handleManualSpawn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim() || !laneName.trim()) return;

    const newId = `custom-agent-${Date.now()}`;
    const newAgent: AgentState = {
      id: newId,
      name: roleName.trim(),
      tier: agentTier === 'tier2_specialist' ? 'specialist' : 'laborer',
      role: 'frontier_research', // default role fallback
      status: 'idle',
      activeBrief: systemPrompt || `Investigate ${laneName.trim()} in depth.`,
      laborerBudgetRemaining: 3,
      color: colorHex || '#D43F3F',
      description: `Custom spawned agent specializing in ${laneName.trim()}`,
      currentTask: `Ready for dynamic domain analysis in ${laneName}`,
      claimsCount: 0,
      corroborationsCount: 0,
      challengesCount: 0,
      confidenceScore: 0.92,
      avatar: avatarEmoji || '🤖',
      customRoleName: roleName.trim(),
      customLane: laneName.trim(),
      isDynamic: true,
      systemPrompt: systemPrompt || `You are an expert specialist in ${laneName}. Analyze inputs rigorously.`,
    };

    onAddCustomAgent(newAgent);
    setRoleName('');
    setLaneName('');
    setSystemPrompt('');
  };

  const handleTriggerAutoSpawn = () => {
    setIsSpawningAuto(true);
    setTimeout(() => {
      onOrchestratorAutoSpawn();
      setIsSpawningAuto(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border border-[#1A1A1A]/20 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D43F3F]">
              <Cpu className="h-4 w-4" />
              PAGE 03 — DYNAMIC ORCHESTRATOR & UNLIMITED AGENT SPAWNER
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
              Autonomous Agent Generation Engine
            </h1>
            <p className="font-serif text-sm text-[#1A1A1A]/80 max-w-2xl leading-relaxed">
              The Tier 1 Orchestrator evaluates the research thesis dynamically and spawns tailored domain agents on demand. There is zero hard limit on agent capacity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] px-4 py-3 flex items-center gap-3">
              <InfinityIcon className="h-6 w-6 text-[#D43F3F]" />
              <div>
                <div className="font-mono text-xs font-bold text-[#1A1A1A]">UNLIMITED CAP</div>
                <div className="font-mono text-[10px] text-[#1A1A1A]/60">{agents.length} AGENTS ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto Spawner & Manual Spawner Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Orchestrator Auto-Spawn & Manual Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Orchestrator Autonomous Spawner Trigger */}
          <div className="border border-[#1A1A1A]/20 bg-white p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-[#D43F3F]" />
                <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Orchestrator AI Autonomous Agent Spawner
                </h2>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/20 bg-emerald-50 text-[#2A6F47] font-bold">
                AUTO-EVALUATION ACTIVE
              </span>
            </div>

            <p className="font-serif text-xs text-[#1A1A1A]/80 leading-relaxed">
              Let the Orchestrator analyze the research topic ({session?.topic || 'Current Research Session'}) and automatically instantiate 2–3 specialized expert agents with tailored domain briefs.
            </p>

            {/* Borderless button by default, reveals border on hover */}
            <button
              onClick={handleTriggerAutoSpawn}
              disabled={isSpawningAuto}
              className="w-full flex items-center justify-center gap-2 border border-transparent bg-[#1A1A1A] py-3 font-mono text-xs uppercase tracking-widest font-bold text-white hover:border-[#D43F3F] hover:bg-[#D43F3F] transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>{isSpawningAuto ? 'ORCHESTRATOR IS GENERATING AGENTS...' : 'AUTO-SPAWN DOMAIN SPECIALISTS VIA ORCHESTRATOR'}</span>
            </button>
          </div>

          {/* Manual Agent Custom Form */}
          <div className="border border-[#1A1A1A]/20 bg-white p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#1A1A1A]" />
                <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Manual Custom Agent Creation
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase font-bold">
                ZERO CAPACITY LIMIT
              </span>
            </div>

            <form onSubmit={handleManualSpawn} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                    Agent Name / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Quantitative Risk Auditor"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-2.5 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                    Research Lane / Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Statistical Verification & Bounds"
                    value={laneName}
                    onChange={(e) => setLaneName(e.target.value)}
                    className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-2.5 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                    Avatar Emoji
                  </label>
                  <input
                    type="text"
                    value={avatarEmoji}
                    onChange={(e) => setAvatarEmoji(e.target.value)}
                    className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-2.5 font-sans text-xs text-center text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                    Swarm Hierarchy Tier
                  </label>
                  <select
                    value={agentTier}
                    onChange={(e) => setAgentTier(e.target.value as any)}
                    className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-2.5 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
                  >
                    <option value="tier2_specialist">Tier 2 Specialist Agent</option>
                    <option value="tier3_laborer">Tier 3 Single-Task Laborer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                    Theme Color
                  </label>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full h-9 border border-[#1A1A1A]/30 bg-[#F9F8F6] p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                  System Directive & Domain Constraints
                </label>
                <textarea
                  rows={3}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Define specific guidelines, empirical datasets to cite, or red-team criteria..."
                  className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-2.5 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
                />
              </div>

              {/* Borderless button by default, reveals border on hover */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 border border-transparent bg-[#1A1A1A] px-6 py-2.5 font-mono text-xs uppercase tracking-wider font-bold text-white hover:border-[#D43F3F] hover:bg-[#D43F3F] transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>INSTANTIATE NEW AGENT</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Active Agent Network Roster */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-b border-[#1A1A1A]/15 pb-2 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-[#D43F3F]" />
              ACTIVE AGENT ROSTER ({agents.length})
            </h3>
            <span className="font-mono text-[10px] text-[#1A1A1A]/60">
              ORCHESTRATOR DIRECTED
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="border border-[#1A1A1A]/15 bg-white p-3.5 shadow-xs flex items-center justify-between hover:border-[#1A1A1A] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{ag.avatar || '🤖'}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-[#1A1A1A]">
                        {ag.customRoleName || ag.name}
                      </span>
                      {ag.isDynamic && (
                        <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-[#D43F3F]/40 bg-red-50 text-[#D43F3F] font-bold">
                          ORCHESTRATOR SPAWNED
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-[#1A1A1A]/70">
                      {ag.customLane || ag.role || ag.tier} • Status: {ag.status}
                    </div>
                  </div>
                </div>

                {ag.tier !== 'orchestrator' && (
                  <button
                    onClick={() => onRemoveAgent(ag.id)}
                    className="p-1.5 border border-transparent text-[#1A1A1A]/40 hover:text-[#D43F3F] hover:border-[#D43F3F] transition-all"
                    title="Remove agent from swarm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
