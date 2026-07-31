import React from 'react';
import { Claim, SpecialistRole, SourceTier } from '../types';
import { SPECIALIST_META } from '../data/presets';
import {
  BookmarkCheck,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Search,
  Filter,
  ShieldCheck,
  Award,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface ClaimLedgerProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

export const ClaimLedger: React.FC<ClaimLedgerProps> = ({ claims, onSelectClaim }) => {
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredClaims = claims.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (roleFilter !== 'all' && c.agentRole !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.statement.toLowerCase().includes(q) ||
        c.evidence.toLowerCase().includes(q) ||
        c.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const corroboratedCount = claims.filter((c) => c.status === 'corroborated').length;
  const contestedCount = claims.filter((c) => c.status === 'contested').length;
  const unverifiedCount = claims.filter((c) => c.status === 'unverified').length;

  return (
    <div className="border border-[#1A1A1A] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-4 mb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4 text-[#1A1A1A]" />
            Claim Verification Ledger & Corroboration Matrix
          </h2>
          <p className="font-mono text-[10px] text-[#1A1A1A]/70 uppercase tracking-widest mt-0.5">
            Claims posted across swarm session with evidence tags, source quality tiers, and red-team critiques
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`border px-2.5 py-1 font-semibold uppercase tracking-wider transition ${
              statusFilter === 'all'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white text-[#1A1A1A]/70 border-[#1A1A1A]/20 hover:border-[#1A1A1A]'
            }`}
          >
            Total: {claims.length}
          </button>
          <button
            onClick={() => setStatusFilter('corroborated')}
            className={`flex items-center gap-1 border px-2.5 py-1 font-semibold uppercase tracking-wider transition ${
              statusFilter === 'corroborated'
                ? 'bg-emerald-100 text-[#2A6F47] border-[#2A6F47]'
                : 'bg-white text-[#2A6F47]/80 border-[#2A6F47]/30 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            Corroborated ({corroboratedCount})
          </button>
          <button
            onClick={() => setStatusFilter('contested')}
            className={`flex items-center gap-1 border px-2.5 py-1 font-semibold uppercase tracking-wider transition ${
              statusFilter === 'contested'
                ? 'bg-red-100 text-[#D43F3F] border-[#D43F3F]'
                : 'bg-white text-[#D43F3F]/80 border-[#D43F3F]/30 hover:bg-red-50'
            }`}
          >
            <AlertOctagon className="h-3 w-3" />
            Contested ({contestedCount})
          </button>
          <button
            onClick={() => setStatusFilter('unverified')}
            className={`flex items-center gap-1 border px-2.5 py-1 font-semibold uppercase tracking-wider transition ${
              statusFilter === 'unverified'
                ? 'bg-zinc-200 text-zinc-900 border-zinc-400'
                : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            <HelpCircle className="h-3 w-3" />
            Unverified ({unverifiedCount})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#1A1A1A]/50" />
          <input
            type="text"
            placeholder="Search claims, evidence, or citations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[#1A1A1A]/20 bg-[#F9F8F6] py-1.5 pl-9 pr-3 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#1A1A1A] focus:outline-none font-sans"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto border border-[#1A1A1A]/20 bg-[#F9F8F6] py-1.5 px-3 font-mono text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
        >
          <option value="all">FILTER BY SPECIALIST ROLE</option>
          {(Object.keys(SPECIALIST_META) as SpecialistRole[]).map((r) => (
            <option key={r} value={r}>
              {SPECIALIST_META[r].name.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Claims List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredClaims.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#1A1A1A]/20 p-6 font-serif text-[#1A1A1A]/60 italic">
            No claims match the selected search criteria.
          </div>
        ) : (
          filteredClaims.map((claim) => {
            const roleMeta = SPECIALIST_META[claim.agentRole as SpecialistRole] || SPECIALIST_META['frontier_research'];

            return (
              <div
                key={claim.id}
                onClick={() => onSelectClaim(claim)}
                className="cursor-pointer border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 transition-all hover:border-[#1A1A1A] hover:bg-white shadow-sm group"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2 border-b border-[#1A1A1A]/10 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{roleMeta.avatar}</span>
                    <span className="font-serif text-xs font-bold text-[#1A1A1A]">{claim.agentName}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/15 bg-[#F2F0EB] text-[#1A1A1A]">
                      {roleMeta.lane}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    {/* Source Tier Badge */}
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${
                        claim.sourceTier.includes('Primary')
                          ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold'
                          : 'bg-white text-[#1A1A1A]/70 border-[#1A1A1A]/20'
                      }`}
                    >
                      {claim.sourceTier}
                    </span>

                    {/* Verification Status */}
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 border ${
                        claim.status === 'corroborated'
                          ? 'bg-emerald-100 text-[#2A6F47] border-[#2A6F47]'
                          : claim.status === 'contested'
                          ? 'bg-red-100 text-[#D43F3F] border-[#D43F3F]'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                      }`}
                    >
                      {claim.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Statement */}
                <h3 className="font-serif text-sm font-bold text-[#1A1A1A] group-hover:text-[#D43F3F] transition mb-2">
                  "{claim.statement}"
                </h3>

                {/* Evidence & Source */}
                <div className="bg-white p-3 border border-[#1A1A1A]/10 text-xs text-[#1A1A1A] space-y-1 mb-3 font-sans">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/70">Evidence: </span>
                    {claim.evidence}
                  </div>
                  <div className="text-[11px] text-[#1A1A1A]/70 border-t border-[#1A1A1A]/10 pt-1 mt-1 font-mono">
                    <span className="font-bold text-[#1A1A1A]/70">Citation: </span>
                    {claim.source}
                  </div>
                </div>

                {/* Corroboration & Red-Team Audit Summary */}
                <div className="flex flex-wrap items-center justify-between font-mono text-[10px] text-[#1A1A1A]/70 border-t border-[#1A1A1A]/10 pt-2 gap-2">
                  <div className="flex items-center gap-3">
                    {claim.corroboratedBy.length > 0 ? (
                      <span className="flex items-center gap-1 text-[#2A6F47] font-bold">
                        <UserCheck className="h-3.5 w-3.5" />
                        Backed by {claim.corroboratedBy.length} independent specialist(s)
                      </span>
                    ) : (
                      <span className="text-[#1A1A1A]/50">No independent corroboration yet</span>
                    )}

                    {claim.contestedBy.length > 0 && (
                      <span className="flex items-center gap-1 text-[#D43F3F] font-bold">
                        <AlertOctagon className="h-3.5 w-3.5" />
                        {claim.contestedBy.length} Red-Team critique(s)
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1 text-[#1A1A1A] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Inspect Evidence <ChevronRight className="h-3.5 w-3.5 text-[#D43F3F]" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
