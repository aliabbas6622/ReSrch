import React from 'react';
import { Claim } from '../types';
import { SPECIALIST_META } from '../data/presets';
import { Bookmark, CheckCircle2, AlertOctagon, ExternalLink, ShieldCheck } from 'lucide-react';

interface ClaimDetailModalProps {
  claim: Claim;
  onClose: () => void;
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ claim, onClose }) => {
  const roleMeta = SPECIALIST_META[claim.agentRole as keyof typeof SPECIALIST_META] || SPECIALIST_META['frontier_research'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{roleMeta.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-zinc-100">{claim.agentName}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${roleMeta.badgeBg} ${roleMeta.badgeText}`}>
                  {roleMeta.lane}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Angle: {claim.topicAngle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-zinc-400 hover:text-zinc-200">
            ✕
          </button>
        </div>

        {/* Statement */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
          <div className="text-[10px] uppercase font-semibold text-purple-400 mb-1">
            Claim Thesis
          </div>
          <p className="text-xs font-medium text-zinc-100 leading-relaxed">
            "{claim.statement}"
          </p>
        </div>

        {/* Evidence & Citation */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Empirical / Theoretical Evidence
            </h3>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-xs text-zinc-200 leading-relaxed">
              {claim.evidence}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div>
              <span className="text-zinc-500 font-medium">Source Citation: </span>
              <span className="text-zinc-200 font-mono">{claim.source}</span>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/30">
              {claim.sourceTier}
            </span>
          </div>
        </div>

        {/* Independent Corroborations */}
        {claim.corroboratedBy.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Independent Corroboration ({claim.corroboratedBy.length})
            </h3>
            <div className="space-y-2">
              {claim.corroboratedBy.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-zinc-200 space-y-1"
                >
                  <div className="font-semibold text-emerald-300">
                    Backed by {c.agentName}:
                  </div>
                  <div>{c.evidence}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Red-Team Critiques */}
        {claim.contestedBy.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4" />
              Red-Team Adversarial Challenge ({claim.contestedBy.length})
            </h3>
            <div className="space-y-2">
              {claim.contestedBy.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-xs text-zinc-200 space-y-1"
                >
                  <div className="font-semibold text-red-300">
                    Challenged by {c.agentName}:
                  </div>
                  <div>{c.critique}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
