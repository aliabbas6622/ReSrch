import React from 'react';
import {
  BrainCircuit,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronDown,
  BookOpen,
  Sigma,
  FileText,
  Cpu,
  HelpCircle,
  UserPlus,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  User as UserIcon,
  Database,
  Trash2,
  Clock,
  Check,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { SwarmSession, SwarmPhase } from '../types';
import { PRESET_TOPICS } from '../data/presets';

export type MainPage = 'topic' | 'swarm' | 'spawner' | 'math' | 'markdown' | 'harness';

interface NavbarProps {
  session: SwarmSession | null;
  isAutoRunning: boolean;
  onToggleAutoRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onSelectPreset: (presetId: string) => void;
  onOpenConfig: () => void;
  onExportReport: () => void;
  isStepping: boolean;
  activeMainPage: MainPage;
  onSelectMainPage: (page: MainPage) => void;
  user: User | null;
  onSignInGoogle: () => void;
  onSignInAnonymous: () => void;
  onSignOut: () => void;
  savedSessions: SwarmSession[];
  onLoadSession: (s: SwarmSession) => void;
  onDeleteSession: (sessionId: string) => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  isAutoRunning,
  onToggleAutoRun,
  onStep,
  onReset,
  onSelectPreset,
  onOpenConfig,
  onExportReport,
  isStepping,
  activeMainPage,
  onSelectMainPage,
  user,
  onSignInGoogle,
  onSignInAnonymous,
  onSignOut,
  savedSessions,
  onLoadSession,
  onDeleteSession,
  isSyncing,
}) => {
  const [presetsOpen, setPresetsOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);

  const getPhaseBadge = (phase: SwarmPhase) => {
    switch (phase) {
      case 'scoping':
        return { label: 'Scoping Briefs', bg: 'bg-[#1A1A1A] text-[#F9F8F6] border-[#1A1A1A]' };
      case 'parallel_research':
        return { label: 'Parallel Research', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'cross_examination':
        return { label: `Debate Round ${session?.currentRound}/${session?.totalRounds}`, bg: 'bg-[#D43F3F]/10 text-[#D43F3F] border-[#D43F3F]/30' };
      case 'convergence_check':
        return { label: 'Convergence Check', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'synthesis':
        return { label: 'Synthesizing Report', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'completed':
        return { label: 'Swarm Complete', bg: 'bg-emerald-800 text-white border-emerald-900' };
      default:
        return { label: 'Idle', bg: 'bg-zinc-100 text-zinc-700 border-zinc-300' };
    }
  };

  const currentPhase = session ? getPhaseBadge(session.phase) : getPhaseBadge('idle');

  return (
    <header className="sticky top-0 z-30 border-b border-[#1A1A1A]/20 bg-[#F9F8F6] px-4 py-3 text-[#1A1A1A]">
      {/* Editorial Top Utility Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#1A1A1A]/10 pb-2 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/60">
        <div className="flex items-center gap-3">
          <span>OPENHARNESS MULTI-AGENT SPECIFICATION</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">DYNAMIC ORCHESTRATOR SPAWNER</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#2A6F47] font-semibold">
            {isSyncing ? (
              <>
                <Cloud className="h-3 w-3 animate-spin text-[#B45309]" />
                <span className="text-[#B45309]">SYNCING FIRESTORE...</span>
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-[#2A6F47]" />
                <span>FIRESTORE SYNCED</span>
              </>
            )}
          </div>
          <span>•</span>
          <span className="text-[#D43F3F] font-semibold">FIREBASE AUTH & LEDGER ACTIVE</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo & Main Navigation Bar */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => onSelectMainPage('topic')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center border border-transparent bg-[#1A1A1A] text-[#F9F8F6] group-hover:border-[#D43F3F] group-hover:bg-[#D43F3F] transition-all duration-200">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A]">
                  Research Swarm
                </h1>
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/20 bg-[#EFECE6] text-[#1A1A1A]">
                  OpenHarness
                </span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 hidden md:block font-serif italic">
                Autonomous multi-agent research & harness engine
              </p>
            </div>
          </div>

          {/* Top Page Selector Tabs - Borderless buttons with hover border */}
          <div className="hidden lg:flex items-center gap-1 border-l border-[#1A1A1A]/20 pl-4 font-mono text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => onSelectMainPage('topic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-200 ${
                activeMainPage === 'topic'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                  : 'border-transparent text-[#1A1A1A]/70 hover:border-[#1A1A1A] hover:bg-[#F2F0EB]'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#D43F3F]" />
              <span>01. Topic & Question</span>
            </button>

            <button
              onClick={() => onSelectMainPage('swarm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-200 ${
                activeMainPage === 'swarm'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                  : 'border-transparent text-[#1A1A1A]/70 hover:border-[#1A1A1A] hover:bg-[#F2F0EB]'
              }`}
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>02. Research Council</span>
            </button>

            <button
              onClick={() => onSelectMainPage('spawner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-200 ${
                activeMainPage === 'spawner'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                  : 'border-transparent text-[#1A1A1A]/70 hover:border-[#1A1A1A] hover:bg-[#F2F0EB]'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5 text-[#2A6F47]" />
              <span>03. Agent Spawner</span>
            </button>

            <button
              onClick={() => onSelectMainPage('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-200 ${
                activeMainPage === 'math'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                  : 'border-transparent text-[#1A1A1A]/70 hover:border-[#1A1A1A] hover:bg-[#F2F0EB]'
              }`}
            >
              <Sigma className="h-3.5 w-3.5 text-[#D43F3F]" />
              <span>04. Math & LaTeX</span>
            </button>

            <button
              onClick={() => onSelectMainPage('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-200 ${
                activeMainPage === 'markdown'
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#1A1A1A]'
                  : 'border-transparent text-[#1A1A1A]/70 hover:border-[#1A1A1A] hover:bg-[#F2F0EB]'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-[#B45309]" />
              <span>05. Markdown</span>
            </button>
          </div>
        </div>

        {/* Right Action Controls: Ledger History + Firebase Auth + Execution */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved Ledger Sessions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="flex items-center gap-1.5 border border-transparent bg-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-medium text-[#1A1A1A] hover:border-[#1A1A1A] transition-all duration-200"
              title="View & Load Saved Firestore Swarm Sessions"
            >
              <Database className="h-3.5 w-3.5 text-[#0284c7]" />
              <span className="hidden sm:inline">Ledger History</span>
              <span className="bg-[#0284c7]/10 text-[#0284c7] px-1.5 py-0.2 text-[9px] font-bold">
                {savedSessions.length}
              </span>
              <ChevronDown className="h-3 w-3 text-[#1A1A1A]/60" />
            </button>

            {historyOpen && (
              <div
                className="absolute right-0 mt-2 w-80 border border-[#1A1A1A] bg-white p-2 shadow-xl z-50"
                onMouseLeave={() => setHistoryOpen(false)}
              >
                <div className="flex items-center justify-between px-2 py-1.5 font-mono text-[10px] font-semibold text-[#1A1A1A]/60 uppercase tracking-widest border-b border-[#1A1A1A]/10 mb-1">
                  <span>FIRESTORE SAVED SESSIONS</span>
                  <span className="text-[#2A6F47]">{savedSessions.length} RUNS</span>
                </div>

                {savedSessions.length === 0 ? (
                  <div className="p-4 text-center font-mono text-xs text-[#1A1A1A]/50 italic">
                    No saved sessions in Firestore yet. Sessions auto-sync as you debate!
                  </div>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {savedSessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 hover:bg-[#F9F8F6] transition border-b border-[#1A1A1A]/5 group"
                      >
                        <button
                          onClick={() => {
                            onLoadSession(s);
                            onSelectMainPage('swarm');
                            setHistoryOpen(false);
                          }}
                          className="flex-1 text-left pr-2"
                        >
                          <div className="font-serif text-xs font-bold text-[#1A1A1A] group-hover:text-[#D43F3F] line-clamp-1">
                            {s.topic}
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[9px] text-[#1A1A1A]/60">
                            <span>{s.claims?.length || 0} claims</span>
                            <span>•</span>
                            <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                          </div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(s.id);
                          }}
                          className="p-1 text-[#1A1A1A]/40 hover:text-[#D43F3F] transition"
                          title="Delete from Firestore"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Firebase User Auth Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAuthOpen(!authOpen)}
              className="flex items-center gap-1.5 border border-transparent bg-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-medium text-[#1A1A1A] hover:border-[#1A1A1A] transition-all duration-200"
              title="Firebase Auth Credentials"
            >
              {user ? (
                <>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2A6F47] text-[9px] font-bold text-white">
                    {user.email ? user.email[0].toUpperCase() : 'A'}
                  </div>
                  <span className="hidden sm:inline font-semibold text-[#2A6F47]">
                    {user.email ? user.email.split('@')[0] : 'Guest User'}
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="h-3.5 w-3.5 text-[#1A1A1A]" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
              <ChevronDown className="h-3 w-3 text-[#1A1A1A]/60" />
            </button>

            {authOpen && (
              <div
                className="absolute right-0 mt-2 w-72 border border-[#1A1A1A] bg-white p-3 shadow-xl z-50 space-y-3"
                onMouseLeave={() => setAuthOpen(false)}
              >
                <div className="border-b border-[#1A1A1A]/10 pb-2">
                  <div className="font-mono text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest">
                    FIREBASE AUTH STATUS
                  </div>
                  {user ? (
                    <div className="mt-1 space-y-0.5">
                      <div className="font-serif text-xs font-bold text-[#1A1A1A]">
                        {user.email || 'Anonymous Guest Session'}
                      </div>
                      <div className="font-mono text-[9px] text-[#2A6F47]">
                        UID: {user.uid.slice(0, 12)}...
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#1A1A1A]/70 mt-1">
                      Sign in to sync all research ledgers and custom swarm agent rosters across devices.
                    </p>
                  )}
                </div>

                {!user ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onSignInGoogle();
                        setAuthOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 border border-[#1A1A1A] bg-[#1A1A1A] text-white py-2 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#D43F3F] transition-all"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>Sign In with Google</span>
                    </button>

                    <button
                      onClick={() => {
                        onSignInAnonymous();
                        setAuthOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 border border-[#1A1A1A]/30 bg-[#F9F8F6] text-[#1A1A1A] py-1.5 font-mono text-xs font-medium uppercase tracking-wider hover:border-[#1A1A1A] transition-all"
                    >
                      <span>Continue as Anonymous Guest</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onSignOut();
                      setAuthOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-[#D43F3F] text-[#D43F3F] py-1.5 font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#D43F3F] hover:text-white transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Benchmark Topics Selector */}
          <div className="relative">
            <button
              onClick={() => setPresetsOpen(!presetsOpen)}
              className="flex items-center gap-1.5 border border-transparent bg-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-medium text-[#1A1A1A] hover:border-[#1A1A1A] transition-all duration-200"
              title="Load Benchmark Preset Topic"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#B45309]" />
              <span className="hidden sm:inline">Topics</span>
              <ChevronDown className="h-3 w-3 text-[#1A1A1A]/60" />
            </button>

            {presetsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 border border-[#1A1A1A] bg-white p-2 shadow-xl z-50"
                onMouseLeave={() => setPresetsOpen(false)}
              >
                <div className="px-2 py-1.5 font-mono text-[10px] font-semibold text-[#1A1A1A]/60 uppercase tracking-widest border-b border-[#1A1A1A]/10 mb-1">
                  Selected Benchmark Queries
                </div>
                <div className="space-y-1">
                  {PRESET_TOPICS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        onSelectMainPage('swarm');
                        setPresetsOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-[#F9F8F6] transition group border-b border-[#1A1A1A]/5 last:border-none"
                    >
                      <div className="font-serif text-xs font-semibold text-[#1A1A1A] group-hover:text-[#D43F3F]">
                        {preset.title}
                      </div>
                      <div className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-wider">
                        {preset.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Execution Controls */}
          {session && activeMainPage === 'swarm' && (
            <div className="flex items-center gap-2">
              {session.phase !== 'completed' ? (
                <>
                  <button
                    onClick={onToggleAutoRun}
                    className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-200 ${
                      isAutoRunning
                        ? 'border-transparent bg-[#B45309] text-white hover:border-[#1A1A1A]'
                        : 'border-transparent bg-[#D43F3F] text-white hover:border-[#1A1A1A]'
                    }`}
                  >
                    {isAutoRunning ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>Pause Swarm</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>Auto Swarm</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onStep}
                    disabled={isAutoRunning || isStepping}
                    className="flex items-center gap-1.5 border border-transparent bg-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-medium text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F2F0EB] disabled:opacity-50 transition-all duration-200"
                    title="Advance Swarm 1 Step"
                  >
                    <Layers className="h-3.5 w-3.5 text-[#1A1A1A]" />
                    <span className="hidden sm:inline">Next Step</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onExportReport}
                  className="flex items-center gap-1.5 border border-transparent bg-[#2A6F47] hover:border-[#1A1A1A] px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all duration-200"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Report</span>
                </button>
              )}
            </div>
          )}

          {/* Config & Reset */}
          <button
            onClick={onOpenConfig}
            className="border border-transparent bg-white p-2 text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F2F0EB] transition-all duration-200"
            title="Swarm Settings & Bounded Autonomy"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onReset}
            className="border border-transparent bg-white p-2 text-[#1A1A1A] hover:border-[#D43F3F] hover:bg-[#D43F3F] hover:text-white transition-all duration-200"
            title="New Research Query"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bar Selector */}
      <div className="flex lg:hidden items-center justify-around border-t border-[#1A1A1A]/10 mt-2 pt-2 font-mono text-[10px] font-semibold uppercase tracking-wider">
        <button
          onClick={() => onSelectMainPage('topic')}
          className={`px-2 py-1 ${activeMainPage === 'topic' ? 'text-[#D43F3F] font-bold underline' : 'text-[#1A1A1A]/70'}`}
        >
          01. Topic
        </button>
        <button
          onClick={() => onSelectMainPage('swarm')}
          className={`px-2 py-1 ${activeMainPage === 'swarm' ? 'text-[#D43F3F] font-bold underline' : 'text-[#1A1A1A]/70'}`}
        >
          02. Council
        </button>
        <button
          onClick={() => onSelectMainPage('spawner')}
          className={`px-2 py-1 ${activeMainPage === 'spawner' ? 'text-[#D43F3F] font-bold underline' : 'text-[#1A1A1A]/70'}`}
        >
          03. Spawner
        </button>
        <button
          onClick={() => onSelectMainPage('math')}
          className={`px-2 py-1 ${activeMainPage === 'math' ? 'text-[#D43F3F] font-bold underline' : 'text-[#1A1A1A]/70'}`}
        >
          04. Math
        </button>
        <button
          onClick={() => onSelectMainPage('markdown')}
          className={`px-2 py-1 ${activeMainPage === 'markdown' ? 'text-[#D43F3F] font-bold underline' : 'text-[#1A1A1A]/70'}`}
        >
          05. MD
        </button>
        <button
          onClick={() => onSelectMainPage('harness')}
          className={`px-2 py-1 ${activeMainPage === 'harness' ? 'text-[#D43F3F] font-bold underline' : 'text-[#1A1A1A]/70'}`}
        >
          06. Harness
        </button>
      </div>
    </header>
  );
};
