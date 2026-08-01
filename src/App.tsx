import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Navbar, MainPage } from './components/Navbar';
import { SwarmGraph } from './components/SwarmGraph';
import { ChannelRoom } from './components/ChannelRoom';
import { ClaimLedger } from './components/ClaimLedger';
import { FinalReportView } from './components/FinalReportView';
import { SwarmConfigModal } from './components/SwarmConfigModal';
import { AgentInspectorModal } from './components/AgentInspectorModal';
import { ClaimDetailModal } from './components/ClaimDetailModal';
import { MathLatexStudio } from './components/MathLatexStudio';
import { MarkdownWorkbench } from './components/MarkdownWorkbench';
import { AgentHarnessStudio } from './components/AgentHarnessStudio';
import { ResearchTopicExplorer } from './components/ResearchTopicExplorer';
import { AgentSpawnerStudio } from './components/AgentSpawnerStudio';
import { OrchestratorChatBar } from './components/OrchestratorChatBar';
import {
  auth,
  signInWithGoogle,
  signInAnonymouslyUser,
  logoutUser,
  saveSwarmSessionToFirestore,
  fetchUserSwarmSessions,
  deleteSwarmSessionFromFirestore,
} from './lib/firebase';
import {
  SwarmSession,
  AgentState,
  Claim,
  LaborerTask,
  SwarmConfig,
  SpecialistRole,
} from './types';
import { PRESET_TOPICS, DEFAULT_CONFIG } from './data/presets';
import { navigateToPage, pageFromLocation } from './lib/routes';
import {
  BrainCircuit,
  Sparkles,
  Radio,
  Cpu,
  BookmarkCheck,
  FileText,
  Play,
  Pause,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2,
} from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<SwarmSession | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'room' | 'graph' | 'ledger' | 'report'>('room');
  const [activeMainPage, setActiveMainPage] = useState<MainPage>(() => pageFromLocation());
  const [config, setConfig] = useState<SwarmConfig>(DEFAULT_CONFIG);

  // Firebase Auth & Firestore State
  const [user, setUser] = useState<User | null>(null);
  const [savedSessions, setSavedSessions] = useState<SwarmSession[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  useEffect(() => {
    const syncRoute = () => setActiveMainPage(pageFromLocation());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const selectMainPage = (page: MainPage) => navigateToPage(page);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      loadSavedSessions(currentUser?.uid);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Saved Sessions from Firestore
  const loadSavedSessions = async (userId?: string) => {
    setIsSyncing(true);
    try {
      const list = await fetchUserSwarmSessions(userId);
      setSavedSessions(list);
    } catch (err) {
      console.warn('Could not fetch saved sessions:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-Save Session to Firestore on update
  useEffect(() => {
    if (session) {
      const timer = setTimeout(async () => {
        setIsSyncing(true);
        await saveSwarmSessionToFirestore(session, user?.uid);
        await loadSavedSessions(user?.uid);
        setIsSyncing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [session, user]);

  // Auto-run loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoRunning && session && session.phase !== 'completed' && !isStepping) {
      timer = setTimeout(() => {
        handleStepSwarm();
      }, 1200);
    } else if (session && session.phase === 'completed') {
      setIsAutoRunning(false);
      setActiveTab('report');
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAutoRunning, session, isStepping]);

  // Init Swarm Session
  const handleInitSwarm = async (queryTopic: string, customConfig?: SwarmConfig) => {
    if (!queryTopic.trim()) return;
    setIsInitializing(true);
    setIsAutoRunning(false);
    setAppError(null);

    try {
      const res = await fetch('/api/swarm/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: queryTopic,
          config: customConfig || config,
        }),
      });

      if (!res.ok) throw new Error('Failed to init session');
      const data: SwarmSession = await res.json();
      setSession(data);
      setActiveTab('room');
      navigateToPage('swarm');
      // Save to Firestore
      saveSwarmSessionToFirestore(data, user?.uid);
    } catch (err) {
      console.error('Error initializing swarm:', err);
      setAppError(err instanceof Error ? err.message : 'The research council could not be initialized.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Step Swarm
  const handleStepSwarm = async () => {
    if (!session || isStepping || session.phase === 'completed') return;
    setIsStepping(true);
    setAppError(null);

    try {
      const res = await fetch('/api/swarm/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session }),
      });

      if (!res.ok) throw new Error('Failed step');
      const updated: SwarmSession = await res.json();
      setSession(updated);

      if (updated.phase === 'completed') {
        setIsAutoRunning(false);
        setActiveTab('report');
      }
    } catch (err) {
      console.error('Error stepping swarm:', err);
      setAppError(err instanceof Error ? err.message : 'The swarm could not advance.');
      setIsAutoRunning(false);
    } finally {
      setIsStepping(false);
    }
  };

  // Handle Orchestrator Bottom Chat Message
  const handleSendOrchestratorMessage = async (text: string) => {
    if (!text.trim() || isSendingChat) return;
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/swarm/orchestrator-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session,
          message: text,
        }),
      });

      if (!res.ok) throw new Error('Failed to send chat');
      const data = await res.json();

      if (data.session) {
        setSession(data.session);
        navigateToPage('swarm');
        setActiveTab('room');
      } else if (session && data.reply) {
        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.userMessage, data.reply],
          };
        });
      } else {
        // Init session if none active!
        handleInitSwarm(text);
      }
    } catch (err) {
      console.error('Error chatting with orchestrator:', err);
      setAppError(err instanceof Error ? err.message : 'The orchestrator is temporarily unavailable.');
    } finally {
      setIsSendingChat(false);
    }
  };

  // Trigger Laborer
  const handleTriggerLaborer = async (
    parentAgentRole: SpecialistRole,
    taskType: any,
    description: string
  ) => {
    if (!session) return;

    try {
      const parentAgent =
        session.agents.find((a) => a.role === parentAgentRole) || session.agents[1];

      const res = await fetch('/api/swarm/laborer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentAgentId: parentAgent.id,
          parentAgentName: parentAgent.name,
          taskType,
          description,
          topic: session.topic,
        }),
      });

      if (!res.ok) throw new Error('Failed laborer execution');
      const task: LaborerTask = await res.json();

      setSession((prev) => {
        if (!prev) return prev;
        const now = Date.now();
        const updatedLaborers = [...prev.laborers, task];
        const updatedMessages = [
          ...prev.messages,
          {
            id: `msg-lab-${task.id}`,
            channel: '#laborers' as const,
            senderId: task.parentAgentId,
            senderName: `Tier 3 Laborer (${task.taskType})`,
            senderRole: 'laborer' as const,
            text: `⚡ **LABORER TASK (${task.taskType.toUpperCase()})**: ${task.description}\n\n**Result**: ${task.result}`,
            laborerTaskId: task.id,
            timestamp: now,
            type: 'laborer_report' as const,
          },
        ];

        return {
          ...prev,
          laborers: updatedLaborers,
          messages: updatedMessages,
        };
      });
    } catch (err) {
      console.error('Error in manual laborer:', err);
    }
  };

  // Add Dynamic Custom Agent
  const handleAddCustomAgent = (newAgent: AgentState) => {
    if (!session) {
      handleInitSwarm('Autonomous Dynamic Swarm Query with Custom Agent Roster');
      return;
    }

    setSession((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      const updatedAgents = [...prev.agents, newAgent];
      const updatedMessages = [
        ...prev.messages,
        {
          id: `msg-spawn-${now}`,
          channel: '#orchestrator' as const,
          senderId: 'agent-orchestrator',
          senderName: 'Orchestrator Council Lead',
          senderRole: 'orchestrator' as const,
          text: `🤖 **DYNAMIC AGENT SPAWNED**: The Orchestrator has instantiated **${newAgent.name}** (${newAgent.customLane || newAgent.role}).\n\n**Active Brief**: "${newAgent.activeBrief || newAgent.description}"`,
          timestamp: now,
          type: 'directive' as const,
        },
      ];

      return {
        ...prev,
        agents: updatedAgents,
        messages: updatedMessages,
      };
    });
  };

  // Remove Agent
  const handleRemoveAgent = (agentId: string) => {
    if (!session) return;
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        agents: prev.agents.filter((a) => a.id !== agentId),
      };
    });
  };

  // Orchestrator Auto-Spawn
  const handleOrchestratorAutoSpawn = () => {
    const topicToUse = session?.topic || 'Autonomous Multi-Agent Governance';
    const now = Date.now();
    const dynamicSpecialist1: AgentState = {
      id: `agent-auto-${now}-1`,
      name: 'Bioethics & Legal Compliance Auditor',
      tier: 'specialist',
      avatar: '⚖️',
      status: 'idle',
      activeBrief: `Auditing legal liability models, bio-ethical boundaries, and EU AI Act compliance for: "${topicToUse}"`,
      laborerBudgetRemaining: 3,
      color: '#0284c7',
      description: 'Dynamic bioethics and legal compliance specialist.',
      claimsCount: 0,
      corroborationsCount: 0,
      challengesCount: 0,
      confidenceScore: 0.94,
      isDynamic: true,
      customRoleName: 'Bioethics & Legal Compliance Auditor',
      customLane: 'Bioethics & Legal Compliance',
    };

    const dynamicSpecialist2: AgentState = {
      id: `agent-auto-${now}-2`,
      name: 'Quantitative Risk & Game Strategist',
      tier: 'specialist',
      avatar: '📈',
      status: 'idle',
      activeBrief: `Calculating game-theoretic Nash equilibrium bounds and economic fault tolerance for: "${topicToUse}"`,
      laborerBudgetRemaining: 3,
      color: '#7c3aed',
      description: 'Dynamic quantitative game theory and risk specialist.',
      claimsCount: 0,
      corroborationsCount: 0,
      challengesCount: 0,
      confidenceScore: 0.96,
      isDynamic: true,
      customRoleName: 'Quantitative Risk & Game Strategist',
      customLane: 'Quantitative Game Theory & Risk',
    };

    if (session) {
      handleAddCustomAgent(dynamicSpecialist1);
      setTimeout(() => handleAddCustomAgent(dynamicSpecialist2), 300);
    } else {
      handleInitSwarm(topicToUse);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_TOPICS.find((p) => p.id === presetId);
    if (preset) {
      setTopicInput(preset.prompt);
      handleInitSwarm(preset.prompt);
    }
  };

  const handleReset = () => {
    setIsAutoRunning(false);
    setSession(null);
    setTopicInput('');
    navigateToPage('topic');
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSwarmSessionFromFirestore(sessionId, user?.uid);
    setSavedSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (session?.id === sessionId) {
      setSession(null);
    }
  };

  const activeAgentsList = session?.agents || [
    {
      id: 'agent-orchestrator',
      name: 'Orchestrator Council Lead',
      tier: 'orchestrator' as const,
      avatar: '🧠',
      status: 'idle' as const,
      laborerBudgetRemaining: 99,
      color: '#6366f1',
      description: 'Council Lead',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#D43F3F] selection:text-white relative">
      {/* App Header / Navigation with Firebase Auth */}
      <Navbar
        session={session}
        isAutoRunning={isAutoRunning}
        onToggleAutoRun={() => setIsAutoRunning(!isAutoRunning)}
        onStep={handleStepSwarm}
        onReset={handleReset}
        onSelectPreset={handleSelectPreset}
        onOpenConfig={() => setShowConfigModal(true)}
        onExportReport={() => {
          navigateToPage('swarm');
          setActiveTab('report');
        }}
        isStepping={isStepping}
        activeMainPage={activeMainPage}
        onSelectMainPage={selectMainPage}
        user={user}
        onSignInGoogle={signInWithGoogle}
        onSignInAnonymous={signInAnonymouslyUser}
        onSignOut={logoutUser}
        savedSessions={savedSessions}
        onLoadSession={(s) => { setSession(s); navigateToPage('swarm'); }}
        onDeleteSession={handleDeleteSession}
        isSyncing={isSyncing}
      />

      {appError && (
        <div role="alert" className="mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-7xl items-center justify-between gap-4 border border-[#D43F3F] bg-red-50 px-4 py-3 text-sm text-red-900">
          <span><strong>Request failed.</strong> {appError}</span>
          <button onClick={() => setAppError(null)} className="min-h-9 border border-red-300 px-3 font-mono text-xs font-bold uppercase hover:bg-white">Dismiss</button>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 space-y-6 pb-24">
        {/* Page 01: Topic & Question Explorer */}
        {activeMainPage === 'topic' && (
          <ResearchTopicExplorer
            onStartSession={(topic, cfg) => {
              setConfig(cfg);
              handleInitSwarm(topic, cfg);
            }}
            onSelectPreset={handleSelectPreset}
            config={config}
            onUpdateConfig={setConfig}
          />
        )}

        {/* Page 03: Agent Spawner */}
        {activeMainPage === 'spawner' && (
          <AgentSpawnerStudio
            session={session}
            agents={activeAgentsList as AgentState[]}
            onAddCustomAgent={handleAddCustomAgent}
            onRemoveAgent={handleRemoveAgent}
            onOrchestratorAutoSpawn={handleOrchestratorAutoSpawn}
          />
        )}

        {/* Page 04: Math & LaTeX Studio */}
        {activeMainPage === 'math' && <MathLatexStudio />}

        {/* Page 05: Markdown Workbench */}
        {activeMainPage === 'markdown' && (
          <MarkdownWorkbench
            report={session?.report}
            topic={session?.topic}
          />
        )}

        {/* Page 06: Agent Harness Studio */}
        {activeMainPage === 'harness' && <AgentHarnessStudio />}

        {/* Page 02: Research Council & Swarm Room */}
        {activeMainPage === 'swarm' && (!session ? (
          <div className="py-6 sm:py-12 space-y-8 max-w-4xl mx-auto">
            {/* Hero Banner */}
            <div className="text-center space-y-4 border-b border-[#1A1A1A]/15 pb-8">
              <div className="inline-flex items-center gap-2 border border-transparent bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/80 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#B45309]" />
                <span>3-TIER RECURSIVE MULTI-AGENT ARCHITECTURE</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A]">
                Recursive Research Swarm
              </h1>

              <p className="font-serif text-base text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed italic">
                A multi-agent council of domain specialists operating in a shared deliberation room with <strong className="font-sans not-italic text-[#1A1A1A] font-semibold underline decoration-[#D43F3F]">bounded autonomy</strong>, dynamic agent spawning, short-lived laborers, and formal claim corroboration.
              </p>
            </div>

            {/* Custom Input Card */}
            <div className="border border-[#1A1A1A]/20 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                  § 01 // ENTER RESEARCH TOPIC OR HYPOTHESIS
                </label>
                <span className="font-mono text-[9px] text-[#D43F3F] uppercase tracking-wider">
                  BOUNDED DEBATE: MAX 5 ROUNDS
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. Formal bounds of autonomous AI governance in public infrastructure..."
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInitSwarm(topicInput)}
                  className="flex-1 border border-[#1A1A1A]/30 bg-[#F9F8F6] px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:border-[#D43F3F] focus:outline-none focus:bg-white font-sans transition-all"
                />

                <button
                  onClick={() => handleInitSwarm(topicInput)}
                  disabled={isInitializing || !topicInput.trim()}
                  className="flex items-center justify-center gap-2 border border-transparent bg-[#1A1A1A] px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold text-white hover:border-[#D43F3F] hover:bg-[#D43F3F] disabled:opacity-50 transition-all duration-200 shrink-0"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>INITIALIZING COUNCIL...</span>
                    </>
                  ) : (
                    <>
                      <span>CONVENE COUNCIL</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Presets List */}
              <div className="pt-4 border-t border-[#1A1A1A]/10">
                <div className="font-mono text-[10px] font-semibold text-[#1A1A1A]/60 uppercase tracking-widest mb-3">
                  BENCHMARK RESEARCH INQUIRIES:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_TOPICS.slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className="text-left border border-transparent bg-[#F9F8F6] p-3.5 hover:border-[#D43F3F] hover:bg-white transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9px] font-semibold text-[#D43F3F] uppercase tracking-wider">
                          {preset.category}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1A1A1A]/40 group-hover:text-[#D43F3F] group-hover:translate-x-0.5 transition" />
                      </div>
                      <div className="font-serif text-xs font-bold text-[#1A1A1A] group-hover:text-[#D43F3F] mb-1">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-[#1A1A1A]/70 line-clamp-2">
                        {preset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#1A1A1A]/20 bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider">
                  <BrainCircuit className="h-4 w-4 text-[#1A1A1A]" /> Tier 1 Orchestrator
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Decomposes research queries, issues scoped briefs, controls debate rounds, and compiles verified reports.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider">
                  <Radio className="h-4 w-4 text-[#D43F3F]" /> Shared Deliberation Room
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Specialists post structured claims, corroborations, and red-team critiques across dedicated channels.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-white p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-mono font-bold text-xs uppercase tracking-wider">
                  <Zap className="h-4 w-4 text-[#B45309]" /> Bounded Autonomy & Laborers
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Short-lived Tier 3 task workers execute calculations and citation checks without runaway recursion.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Swarm Session View */
          <div className="space-y-6">
            {/* Session Summary Bar */}
            <div className="border border-[#1A1A1A]/20 bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold text-[#D43F3F] uppercase tracking-widest">
                    ACTIVE RESEARCH INQUIRY
                  </span>
                  <span className="font-mono text-[10px] text-[#1A1A1A]/60">
                    SESSION ID: {session.id}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  {session.topic}
                </h2>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#1A1A1A]/10 pt-3 md:pt-0 md:pl-4">
                <div className="text-right">
                  <div className="font-mono text-[9px] text-[#1A1A1A]/60 uppercase tracking-widest">SUBMITTED CLAIMS</div>
                  <div className="font-mono text-xs font-bold text-[#1A1A1A]">
                    {session.claims.length} (<span className="text-[#2A6F47]">{session.claims.filter((c) => c.status === 'corroborated').length} Corroborated</span>)
                  </div>
                </div>

                <div className="h-6 w-px bg-[#1A1A1A]/10" />

                <div className="text-right">
                  <div className="font-mono text-[9px] text-[#1A1A1A]/60 uppercase tracking-widest">DEBATE ROUND</div>
                  <div className="font-mono text-xs font-bold text-[#B45309]">
                    {session.currentRound} / {session.totalRounds}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/20 pb-0">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('room')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                    activeTab === 'room'
                      ? 'border-[#1A1A1A] text-[#1A1A1A] bg-white'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-white/50'
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Shared Room Chat</span>
                  <span className="bg-[#1A1A1A]/10 px-1.5 py-0.2 text-[9px] text-[#1A1A1A] font-mono">
                    {session.messages.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('graph')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                    activeTab === 'graph'
                      ? 'border-[#1A1A1A] text-[#1A1A1A] bg-white'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-white/50'
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Swarm Graph</span>
                </button>

                <button
                  onClick={() => setActiveTab('ledger')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                    activeTab === 'ledger'
                      ? 'border-[#1A1A1A] text-[#1A1A1A] bg-white'
                      : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-white/50'
                  }`}
                >
                  <BookmarkCheck className="h-3.5 w-3.5" />
                  <span>Claim Ledger</span>
                  <span className="bg-[#1A1A1A]/10 px-1.5 py-0.2 text-[9px] text-[#1A1A1A] font-mono">
                    {session.claims.length}
                  </span>
                </button>

                {session.report && (
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                      activeTab === 'report'
                        ? 'border-[#2A6F47] text-[#2A6F47] bg-white'
                        : 'border-transparent text-[#2A6F47]/80 hover:text-[#2A6F47] hover:bg-white/50'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Final Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'room' && (
              <ChannelRoom
                messages={session.messages}
                claims={session.claims}
                agents={session.agents}
                laborers={session.laborers}
                onTriggerLaborer={handleTriggerLaborer}
                onSelectClaim={setSelectedClaim}
                isProcessing={isStepping}
              />
            )}

            {activeTab === 'graph' && (
              <SwarmGraph
                agents={session.agents}
                claims={session.claims}
                laborers={session.laborers}
                onSelectAgent={setSelectedAgent}
                activeAgentId={selectedAgent?.id}
              />
            )}

            {activeTab === 'ledger' && (
              <ClaimLedger
                claims={session.claims}
                onSelectClaim={setSelectedClaim}
              />
            )}

            {activeTab === 'report' && session.report && (
              <FinalReportView
                report={session.report}
                topic={session.topic}
              />
            )}
          </div>
        ))}
      </main>

      {/* ChatGPT-style Floating Orchestrator Chat Message Bar */}
      <OrchestratorChatBar
        session={session}
        onSendMessage={handleSendOrchestratorMessage}
        isSending={isSendingChat}
      />

      {/* Modals */}
      {selectedAgent && (
        <AgentInspectorModal
          agent={selectedAgent}
          claims={session?.claims || []}
          messages={session?.messages || []}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}

      {showConfigModal && (
        <SwarmConfigModal
          config={config}
          onSave={(newCfg) => setConfig(newCfg)}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
}
