import React from 'react';
import {
  RoomMessage,
  AgentState,
  Claim,
  LaborerTask,
  SpecialistRole,
} from '../types';
import { SPECIALIST_META } from '../data/presets';
import {
  MessageSquare,
  Radio,
  Swords,
  Bot,
  Mail,
  Send,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Plus,
  ShieldAlert,
  Bookmark,
  Sparkles,
} from 'lucide-react';

interface ChannelRoomProps {
  messages: RoomMessage[];
  claims: Claim[];
  agents: AgentState[];
  laborers: LaborerTask[];
  onTriggerLaborer: (parentAgentRole: SpecialistRole, taskType: any, description: string) => void;
  onSelectClaim: (claim: Claim) => void;
  isProcessing: boolean;
}

export const ChannelRoom: React.FC<ChannelRoomProps> = ({
  messages,
  claims,
  agents,
  laborers,
  onTriggerLaborer,
  onSelectClaim,
  isProcessing,
}) => {
  const [activeChannel, setActiveChannel] = React.useState<
    '#orchestrator' | '#findings' | '#debate' | 'DM' | '#laborers'
  >('#findings');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = React.useState<string>('all');
  const [showLaborerModal, setShowLaborerModal] = React.useState(false);

  // Manual Laborer Form
  const [labParentRole, setLabParentRole] = React.useState<SpecialistRole>('frontier_research');
  const [labTaskType, setLabTaskType] = React.useState<any>('calculation');
  const [labDesc, setLabDesc] = React.useState('');

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  // Channel unread/counts
  const getChannelCount = (chan: string) => {
    if (chan === 'DM') return messages.filter((m) => m.channel === 'DM').length;
    return messages.filter((m) => m.channel === chan).length;
  };

  const filteredMessages = messages.filter((m) => {
    if (m.channel !== activeChannel) return false;
    if (selectedAgentFilter !== 'all' && m.senderRole !== selectedAgentFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.text.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSpawnLaborer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labDesc.trim()) return;
    onTriggerLaborer(labParentRole, labTaskType, labDesc);
    setLabDesc('');
    setShowLaborerModal(false);
  };

  return (
    <div className="flex h-[640px] border border-[#1A1A1A] bg-white overflow-hidden shadow-sm">
      {/* Sidebar Channels */}
      <div className="w-60 border-r border-[#1A1A1A]/20 bg-[#F9F8F6] p-3 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-4 px-2 border-b border-[#1A1A1A]/10 pb-2">
            <h3 className="font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-[#D43F3F]" />
              CHANNELS & DIRECTIVES
            </h3>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveChannel('#orchestrator')}
              className={`w-full flex items-center justify-between border px-3 py-2 text-xs font-mono uppercase tracking-wider transition ${
                activeChannel === '#orchestrator'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold'
                  : 'bg-white text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:border-[#1A1A1A]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-[#D43F3F] font-bold">#</span>
                orchestrator
              </span>
              <span className="bg-[#1A1A1A]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#1A1A1A]">
                {getChannelCount('#orchestrator')}
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('#findings')}
              className={`w-full flex items-center justify-between border px-3 py-2 text-xs font-mono uppercase tracking-wider transition ${
                activeChannel === '#findings'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold'
                  : 'bg-white text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:border-[#1A1A1A]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-purple-600 font-bold">#</span>
                findings
              </span>
              <span className="bg-[#1A1A1A]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#1A1A1A]">
                {getChannelCount('#findings')}
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('#debate')}
              className={`w-full flex items-center justify-between border px-3 py-2 text-xs font-mono uppercase tracking-wider transition ${
                activeChannel === '#debate'
                  ? 'bg-[#D43F3F] text-white border-[#D43F3F] font-semibold'
                  : 'bg-white text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:border-[#D43F3F]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Swords className="h-3.5 w-3.5 text-[#D43F3F]" />
                debate
              </span>
              <span className="bg-[#1A1A1A]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#1A1A1A]">
                {getChannelCount('#debate')}
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('DM')}
              className={`w-full flex items-center justify-between border px-3 py-2 text-xs font-mono uppercase tracking-wider transition ${
                activeChannel === 'DM'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold'
                  : 'bg-white text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:border-[#1A1A1A]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-600" />
                direct-msg
              </span>
              <span className="bg-[#1A1A1A]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#1A1A1A]">
                {getChannelCount('DM')}
              </span>
            </button>

            <button
              onClick={() => setActiveChannel('#laborers')}
              className={`w-full flex items-center justify-between border px-3 py-2 text-xs font-mono uppercase tracking-wider transition ${
                activeChannel === '#laborers'
                  ? 'bg-[#B45309] text-white border-[#B45309] font-semibold'
                  : 'bg-white text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:border-[#B45309]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-[#B45309]" />
                laborers-log
              </span>
              <span className="bg-[#1A1A1A]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#1A1A1A]">
                {getChannelCount('#laborers')}
              </span>
            </button>
          </nav>
        </div>

        {/* Quick Laborer Spawn Trigger */}
        <div className="pt-3 border-t border-[#1A1A1A]/15">
          <button
            onClick={() => setShowLaborerModal(true)}
            className="w-full flex items-center justify-center gap-1.5 border border-[#B45309] bg-amber-50 px-3 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-[#B45309] hover:bg-[#B45309] hover:text-white transition"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Spawn Laborer Task</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header Bar */}
        <div className="border-b border-[#1A1A1A]/20 bg-[#F2F0EB] px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">
              {activeChannel === 'DM' ? 'DIRECT MESSAGES (SPECIALIST-TO-SPECIALIST)' : activeChannel}
            </span>
            <span className="text-xs text-[#1A1A1A]/60 hidden md:inline font-serif italic">
              {activeChannel === '#findings' && '— Structured claim postings (claim → evidence → source → confidence)'}
              {activeChannel === '#debate' && '— Cross-agent corroboration and red-team challenges'}
              {activeChannel === '#orchestrator' && '— Tier 1 Orchestrator directives and convergence state'}
              {activeChannel === '#laborers' && '— Short-lived single-purpose task executions'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#1A1A1A]/50" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 sm:w-48 border border-[#1A1A1A]/20 bg-white py-1 pl-8 pr-3 font-mono text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#1A1A1A] focus:outline-none"
              />
            </div>

            {/* Filter by Agent */}
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="border border-[#1A1A1A]/20 bg-white py-1 px-2 font-mono text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-none"
            >
              <option value="all">ALL AGENTS</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.role || ag.tier}>
                  {ag.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9F8F6]">
          {filteredMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6 text-[#1A1A1A]/50 font-serif">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30 text-[#1A1A1A]" />
              <p className="text-sm font-semibold italic">No record logged in {activeChannel} yet.</p>
              <p className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest mt-1">
                Advance swarm turns via "Next Step" or "Auto Swarm".
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const claimObj = msg.claimId ? claims.find((c) => c.id === msg.claimId) : null;
              const senderAgent = agents.find((a) => a.id === msg.senderId);
              const roleMeta = msg.senderRole && msg.senderRole !== 'orchestrator' && msg.senderRole !== 'laborer'
                ? SPECIALIST_META[msg.senderRole as SpecialistRole]
                : null;

              return (
                <div
                  key={msg.id}
                  className={`border p-4 transition-all ${
                    msg.type === 'directive'
                      ? 'border-l-4 border-l-[#1A1A1A] border-[#1A1A1A]/20 bg-white'
                      : msg.type === 'challenge'
                      ? 'border-l-4 border-l-[#D43F3F] border-[#D43F3F]/30 bg-red-50/40'
                      : msg.type === 'corroboration'
                      ? 'border-l-4 border-l-[#2A6F47] border-[#2A6F47]/30 bg-emerald-50/40'
                      : 'border-[#1A1A1A]/15 bg-white'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2 border-b border-[#1A1A1A]/10 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {msg.senderRole === 'orchestrator'
                          ? '🧠'
                          : msg.senderRole === 'laborer'
                          ? '⚡'
                          : roleMeta?.avatar || '👤'}
                      </span>
                      <span className="font-serif text-xs font-bold text-[#1A1A1A]">
                        {msg.senderName}
                      </span>
                      {roleMeta && (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/15 bg-[#F2F0EB] text-[#1A1A1A]">
                          {roleMeta.lane}
                        </span>
                      )}
                      {msg.recipientName && (
                        <span className="font-mono text-[10px] text-[#D43F3F] font-semibold">
                          ➔ {msg.recipientName}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[#1A1A1A]/60">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Linked Claim Card preview if available */}
                  {claimObj && (
                    <div
                      onClick={() => onSelectClaim(claimObj)}
                      className="mt-3 cursor-pointer border border-[#1A1A1A]/20 bg-[#F9F8F6] p-2.5 hover:border-[#1A1A1A] hover:bg-white transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="h-3.5 w-3.5 text-[#1A1A1A] shrink-0" />
                        <div>
                          <div className="font-serif text-xs font-bold text-[#1A1A1A] line-clamp-1">
                            {claimObj.statement}
                          </div>
                          <div className="font-mono text-[10px] text-[#1A1A1A]/70">
                            Source: {claimObj.source} [{claimObj.sourceTier}]
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 border ${
                            claimObj.status === 'corroborated'
                              ? 'bg-emerald-100 text-[#2A6F47] border-[#2A6F47]/40'
                              : claimObj.status === 'contested'
                              ? 'bg-red-100 text-[#D43F3F] border-[#D43F3F]/40'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                          }`}
                        >
                          {claimObj.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Manual Laborer Trigger Modal */}
      {showLaborerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-[#1A1A1A] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#1A1A1A]/20 pb-3">
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#B45309]" />
                Spawn Tier 3 Laborer Task
              </h3>
              <button
                onClick={() => setShowLaborerModal(false)}
                className="font-mono text-xs font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
              >
                [✕ CLOSE]
              </button>
            </div>

            <form onSubmit={handleSpawnLaborer} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                  Parent Specialist Agent
                </label>
                <select
                  value={labParentRole}
                  onChange={(e) => setLabParentRole(e.target.value as SpecialistRole)}
                  className="w-full border border-[#1A1A1A] bg-[#F9F8F6] p-2 text-xs font-sans text-[#1A1A1A] focus:outline-none"
                >
                  {(Object.keys(SPECIALIST_META) as SpecialistRole[]).map((r) => (
                    <option key={r} value={r}>
                      {SPECIALIST_META[r].name} ({SPECIALIST_META[r].lane})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                  Laborer Task Type
                </label>
                <select
                  value={labTaskType}
                  onChange={(e) => setLabTaskType(e.target.value)}
                  className="w-full border border-[#1A1A1A] bg-[#F9F8F6] p-2 text-xs font-sans text-[#1A1A1A] focus:outline-none"
                >
                  <option value="calculation">Math / Mathematical Calculation</option>
                  <option value="citation_verify">Citation & Source Verification</option>
                  <option value="translation">Text / Passages Translation</option>
                  <option value="fact_check">Empirical Fact Check</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">
                  Task Brief & Prompt
                </label>
                <textarea
                  rows={3}
                  value={labDesc}
                  onChange={(e) => setLabDesc(e.target.value)}
                  placeholder="e.g. Verify asymptotic bound for state transition complexity or check paper author..."
                  className="w-full border border-[#1A1A1A] bg-[#F9F8F6] p-2 text-xs font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#D43F3F] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setShowLaborerModal(false)}
                  className="border border-[#1A1A1A] bg-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-[#1A1A1A] hover:bg-[#F2F0EB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="border border-[#B45309] bg-[#B45309] hover:bg-amber-800 px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-semibold text-white"
                >
                  Spawn Laborer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
