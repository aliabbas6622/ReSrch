import React from 'react';
import { SwarmConfig, SpecialistRole } from '../types';
import { SPECIALIST_META } from '../data/presets';
import { Settings, Shield, Sliders, Check, RotateCcw } from 'lucide-react';

interface SwarmConfigModalProps {
  config: SwarmConfig;
  onSave: (newConfig: SwarmConfig) => void;
  onClose: () => void;
}

export const SwarmConfigModal: React.FC<SwarmConfigModalProps> = ({
  config,
  onSave,
  onClose,
}) => {
  const [formState, setFormState] = React.useState<SwarmConfig>({ ...config });

  const toggleRole = (role: SpecialistRole) => {
    setFormState((prev) => {
      const exists = prev.selectedRoles.includes(role);
      let updated: SpecialistRole[];
      if (exists) {
        if (prev.selectedRoles.length <= 2) return prev; // Keep at least 2
        updated = prev.selectedRoles.filter((r) => r !== role);
      } else {
        updated = [...prev.selectedRoles, role];
      }
      return { ...prev, selectedRoles: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl border border-[#1A1A1A] bg-white p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#1A1A1A]" />
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Bounded Autonomy & Swarm Settings
              </h2>
              <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest">
                Configure recursion depth, debate caps, and active specialist roster
              </p>
            </div>
          </div>
          <button onClick={onClose} className="font-mono text-xs text-[#1A1A1A]/60 hover:text-[#1A1A1A]">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Active Specialist Roster */}
          <div>
            <label className="block font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-2">
              Active Tier 2 Specialist Roster ({formState.selectedRoles.length} Active)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(SPECIALIST_META) as SpecialistRole[]).map((r) => {
                const meta = SPECIALIST_META[r];
                const active = formState.selectedRoles.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRole(r)}
                    className={`flex items-center justify-between p-2.5 border text-xs font-serif font-bold transition ${
                      active
                        ? 'border-[#1A1A1A] bg-[#F9F8F6] text-[#1A1A1A]'
                        : 'border-[#1A1A1A]/20 bg-white text-[#1A1A1A]/60 hover:border-[#1A1A1A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{meta.avatar}</span>
                      <span>{meta.name}</span>
                    </div>
                    {active && <Check className="h-4 w-4 text-[#D43F3F]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Limits & Caps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-semibold text-[#1A1A1A] mb-1">
                Max Cross-Examination Rounds (1 - 5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={formState.maxDebateRounds}
                onChange={(e) =>
                  setFormState({ ...formState, maxDebateRounds: parseInt(e.target.value) || 3 })
                }
                className="w-full border border-[#1A1A1A]/20 bg-[#F9F8F6] p-2 font-mono text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
              />
              <p className="font-mono text-[9px] text-[#1A1A1A]/60 mt-1">
                Caps cross-examination iterations before forcing synthesis.
              </p>
            </div>

            <div>
              <label className="block font-mono text-xs font-semibold text-[#1A1A1A] mb-1">
                Laborer Budget per Specialist
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formState.maxLaborersPerSpecialist}
                onChange={(e) =>
                  setFormState({ ...formState, maxLaborersPerSpecialist: parseInt(e.target.value) || 3 })
                }
                className="w-full border border-[#1A1A1A]/20 bg-[#F9F8F6] p-2 font-mono text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
              />
              <p className="font-mono text-[9px] text-[#1A1A1A]/60 mt-1">
                Max short-lived Tier 3 tasks each specialist can spawn.
              </p>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 border-t border-[#1A1A1A]/20 pt-4 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-xs font-bold text-[#1A1A1A]">
                  Auto Red-Team Adversarial Challenge
                </div>
                <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                  Forces Skeptic agent to contest unverified claims automatically
                </div>
              </div>
              <input
                type="checkbox"
                checked={formState.enableRedTeamAutoChallenge}
                onChange={(e) =>
                  setFormState({ ...formState, enableRedTeamAutoChallenge: e.target.checked })
                }
                className="h-4 w-4 border-[#1A1A1A] accent-[#1A1A1A]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-xs font-bold text-[#1A1A1A]">Strict Depth Limit</div>
                <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                  Tier 2 can spawn Tier 3 Laborers, but NO deeper agent levels (prevents recursion loops)
                </div>
              </div>
              <span className="font-mono text-[9px] font-bold border border-[#2A6F47] bg-emerald-50 text-[#2A6F47] px-2 py-0.5">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#1A1A1A]/20 pt-4 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#1A1A1A]/20 bg-white px-4 py-2 text-xs uppercase font-semibold text-[#1A1A1A] hover:bg-[#F2F0EB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-[#1A1A1A] bg-[#1A1A1A] px-5 py-2 text-xs uppercase font-semibold text-white hover:bg-[#D43F3F] hover:border-[#D43F3F]"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
