import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  BrainCircuit,
  Sliders,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  Plus,
} from 'lucide-react';
import { PRESET_TOPICS, PresetTopic, SPECIALIST_META } from '../data/presets';
import { SpecialistRole, SwarmConfig } from '../types';

interface ResearchTopicExplorerProps {
  onStartSession: (topic: string, config: SwarmConfig) => void;
  onSelectPreset: (presetId: string) => void;
  config: SwarmConfig;
  onUpdateConfig: (newConfig: SwarmConfig) => void;
}

export const ResearchTopicExplorer: React.FC<ResearchTopicExplorerProps> = ({
  onStartSession,
  onSelectPreset,
  config,
  onUpdateConfig,
}) => {
  const [customTopic, setCustomTopic] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<PresetTopic>(PRESET_TOPICS[0]);
  const [hypothesisText, setHypothesisText] = useState(
    'Formal game-theoretic constraints and multi-lane cross-examination can systematically eliminate hallucinations in multi-agent research outputs.'
  );

  const handleStartCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const topicToUse = customTopic.trim() || selectedPreset.prompt;
    onStartSession(topicToUse, config);
  };

  const toggleRole = (role: SpecialistRole) => {
    const active = config.selectedRoles.includes(role);
    let updated: SpecialistRole[];
    if (active) {
      if (config.selectedRoles.length <= 2) return; // keep at least 2
      updated = config.selectedRoles.filter((r) => r !== role);
    } else {
      updated = [...config.selectedRoles, role];
    }
    onUpdateConfig({ ...config, selectedRoles: updated });
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="border border-[#1A1A1A]/20 bg-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D43F3F]">
            <BrainCircuit className="h-4 w-4" />
            PAGE 01 — RESEARCH TOPIC & QUESTION FORMULATION
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A1A1A] leading-tight">
            Formulate Your Autonomous Research Agenda
          </h1>
          <p className="font-serif text-base text-[#1A1A1A]/80 leading-relaxed">
            Specify a complex research question, empirical hypothesis, or domain dilemma. The Tier 1 Orchestrator will analyze the prompt and deploy a specialized multi-agent council with dynamic specialist spawning.
          </p>
        </div>
      </div>

      {/* Main Form & Preset Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Topic & Hypothesis Entry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#1A1A1A]/20 bg-white p-6 space-y-6 shadow-sm">
            <div className="border-b border-[#1A1A1A]/10 pb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#D43F3F]" />
                Primary Research Question / Thesis Prompt
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-[#F2F0EB] text-[#1A1A1A] border border-[#1A1A1A]/20 px-2 py-0.5">
                OPENHARNESS COMPLIANT
              </span>
            </div>

            <form onSubmit={handleStartCustom} className="space-y-5">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-1.5">
                  ENTER RESEARCH QUESTION OR SELECT BENCHMARK PRESET BELOW:
                </label>
                <textarea
                  rows={4}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder={`e.g. ${selectedPreset.prompt}`}
                  className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-4 font-serif text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#D43F3F] focus:bg-white focus:outline-none leading-relaxed transition-all"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-1.5">
                  WORKING HYPOTHESIS & CORROBORATION GOAL:
                </label>
                <input
                  type="text"
                  value={hypothesisText}
                  onChange={(e) => setHypothesisText(e.target.value)}
                  className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-3 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none transition-all"
                />
              </div>

              {/* Roster Config Trigger */}
              <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Tier 2 Specialist Roster ({config.selectedRoles.length} Active)
                  </span>
                  <span className="font-mono text-[10px] text-[#2A6F47] font-bold uppercase">
                    ORCHESTRATOR CAN AUTO-SPAWN MORE AGENTS ON DEMAND
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(SPECIALIST_META) as SpecialistRole[]).map((role) => {
                    const active = config.selectedRoles.includes(role);
                    const meta = SPECIALIST_META[role];
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`p-2.5 text-left border transition-all duration-200 ${
                          active
                            ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white hover:border-[#D43F3F] hover:bg-[#D43F3F]'
                            : 'border-transparent bg-[#F9F8F6] text-[#1A1A1A]/70 hover:border-[#1A1A1A]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-serif text-xs font-bold">
                          <span>{meta.avatar}</span>
                          <span className="line-clamp-1">{meta.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Start Swarm Button - Borderless by default, border on hover */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 border border-transparent bg-[#1A1A1A] px-8 py-3 font-mono text-xs uppercase tracking-widest font-bold text-white hover:border-[#D43F3F] hover:bg-[#D43F3F] transition-all duration-200 shadow-sm"
                >
                  <Play className="h-4 w-4" />
                  <span>BOOT AUTONOMOUS RESEARCH COUNCIL</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Benchmark Topic Presets */}
        <div className="space-y-4">
          <div className="border-b border-[#1A1A1A]/15 pb-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#B45309]" />
              BENCHMARK RESEARCH PRESETS
            </h3>
            <p className="font-serif text-xs text-[#1A1A1A]/60 italic mt-0.5">
              Click any benchmark topic to auto-fill the research council brief.
            </p>
          </div>

          <div className="space-y-3">
            {PRESET_TOPICS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomTopic(preset.prompt);
                }}
                className={`p-4 border transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'border-[#1A1A1A] bg-[#F9F8F6] shadow-xs'
                    : 'border-transparent bg-white hover:border-[#1A1A1A]/60'
                }`}
              >
                <div className="font-mono text-[9px] font-bold text-[#D43F3F] uppercase tracking-wider mb-1">
                  {preset.category}
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A] mb-1">
                  {preset.title}
                </h4>
                <p className="font-sans text-xs text-[#1A1A1A]/70 line-clamp-2">
                  {preset.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
