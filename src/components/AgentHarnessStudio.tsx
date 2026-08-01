import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Brain,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Database,
  Lock,
  MessageSquare,
  Wrench,
  UserCheck,
  FileCode,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HarnessTraceEvent {
  id: string;
  turn: number;
  component: 'loop_engine' | 'context_manager' | 'tool_sandbox' | 'human_in_loop' | 'guardrail';
  title: string;
  detail: string;
  status: 'success' | 'warning' | 'error' | 'intercepted';
  timestamp: string;
  latencyMs: number;
}

const INITIAL_TRACES: HarnessTraceEvent[] = [
  {
    id: 'trace-1',
    turn: 1,
    component: 'loop_engine',
    title: 'Harness Loop Initialized',
    detail: 'State machine initialized with session topic: "Autonomous Governance in Public AI". Max steps: 10.',
    status: 'success',
    timestamp: '00:00.12',
    latencyMs: 12,
  },
  {
    id: 'trace-2',
    turn: 1,
    component: 'context_manager',
    title: 'Context Window Assembled',
    detail: 'Pruned history to 4,096 token limit. Injected Tier 1 Orchestrator prompt & active claim ledger schema.',
    status: 'success',
    timestamp: '00:00.45',
    latencyMs: 33,
  },
  {
    id: 'trace-3',
    turn: 1,
    component: 'tool_sandbox',
    title: 'Tool Call Dispatched → [spawns_laborer]',
    detail: 'Middleware intercepted request from Frontier Specialist. Enforced Tier 3 isolated sandbox with budget=3.',
    status: 'intercepted',
    timestamp: '00:01.20',
    latencyMs: 75,
  },
  {
    id: 'trace-4',
    turn: 2,
    component: 'guardrail',
    title: 'Bounded Autonomy Audit Passed',
    detail: 'Depth cap verify: current=2 <= max=3. No recursive loop detected.',
    status: 'success',
    timestamp: '00:01.88',
    latencyMs: 14,
  },
  {
    id: 'trace-5',
    turn: 2,
    component: 'human_in_loop',
    title: 'Human-in-the-Loop Breakpoint Triggered',
    detail: 'Steerability hook evaluated: Red-Team Skeptic requested permission to challenge claim #04.',
    status: 'warning',
    timestamp: '00:02.40',
    latencyMs: 8,
  },
];

export const AgentHarnessStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'loop' | 'context' | 'tools' | 'steerability' | 'telemetry'>('architecture');
  const [traces, setTraces] = useState<HarnessTraceEvent[]>(INITIAL_TRACES);
  const [currentTurn, setCurrentTurn] = useState(2);
  const [isSimulating, setIsSimulating] = useState(false);
  const [humanApprovalRequired, setHumanApprovalRequired] = useState(true);
  const [maxContextTokens, setMaxContextTokens] = useState(8192);
  const [tokenUsage, setTokenUsage] = useState(3420);
  const [customSteerPrompt, setCustomSteerPrompt] = useState('');

  // Handle step simulation in harness
  const handleStepHarness = () => {
    const nextTurn = currentTurn + 1;
    const components: HarnessTraceEvent['component'][] = ['loop_engine', 'context_manager', 'tool_sandbox', 'guardrail'];
    const selectedComp = components[Math.floor(Math.random() * components.length)];

    const newTrace: HarnessTraceEvent = {
      id: `trace-${Date.now()}`,
      turn: nextTurn,
      component: selectedComp,
      title: `Harness Cycle Step ${nextTurn}`,
      detail: `Executed ${selectedComp} step. State transitions verified & token window updated to ${tokenUsage + 120} tokens.`,
      status: 'success',
      timestamp: `00:0${nextTurn * 2}.10`,
      latencyMs: Math.floor(Math.random() * 45) + 10,
    };

    setTraces((prev) => [newTrace, ...prev]);
    setCurrentTurn(nextTurn);
    setTokenUsage((prev) => Math.min(maxContextTokens, prev + 140));
  };

  return (
    <div className="space-[#1A1A1A] space-y-8">
      {/* Header Banner */}
      <div className="border border-[#1A1A1A] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-1">
              <Cpu className="h-4 w-4 text-[#D43F3F]" />
              PRODUCTION AGENT HARNESS SPECIFICATION
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
              The Anatomy of an Agent Harness
            </h1>
            <p className="font-serif text-sm text-[#1A1A1A]/70 italic mt-1">
              Interactive specification of the 6 key architectural building blocks required for production-grade agent harnesses: Execution Engine, Context Manager, Tool Sandbox, Steerability Hooks, Tracing Telemetry, and Bounded Safety.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <button
              onClick={handleStepHarness}
              className="flex items-center gap-1.5 border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-white hover:bg-[#D43F3F] hover:border-[#D43F3F] transition"
            >
              <Play className="h-4 w-4" />
              <span>STEP HARNESS CYCLE</span>
            </button>
          </div>
        </div>

        {/* Harness Navigation Pillars */}
        <div className="flex border-b border-[#1A1A1A]/20 gap-2 overflow-x-auto">
          {[
            { id: 'architecture', label: '1. Overview & 6 Pillars', icon: Layers },
            { id: 'loop', label: '2. Execution Loop', icon: Activity },
            { id: 'context', label: '3. Context & Window Memory', icon: Database },
            { id: 'tools', label: '4. Tool Call Sandbox', icon: Wrench },
            { id: 'steerability', label: '5. Steerability & Human-in-Loop', icon: UserCheck },
            { id: 'telemetry', label: '6. Telemetry & Tracing', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-2.5 px-3.5 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition shrink-0 ${
                  activeTab === tab.id
                    ? 'border-[#1A1A1A] text-[#1A1A1A] bg-[#F9F8F6]'
                    : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Architecture Overview */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="border border-[#1A1A1A] bg-white p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2">
              Why Agents Need an Architectural Harness
            </h2>
            <p className="font-serif text-sm text-[#1A1A1A]/80 leading-relaxed">
              As articulated in LangChain's <em>The Anatomy of an Agent Harness</em>, raw LLM prompt loops fail in production due to context degradation, non-deterministic tool calling, infinite recursion loops, and lack of human oversight. The <strong>Agent Harness</strong> provides the deterministic software envelope surrounding non-deterministic LLM agent reasoning.
            </p>

            {/* 6 Core Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
                <div className="font-mono text-[10px] font-bold text-[#D43F3F] uppercase tracking-widest">PILLAR 01</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#1A1A1A]" /> Execution Loop
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  State machine that steps turns, evaluates break conditions, enforces turn limits, and manages step transitions.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
                <div className="font-mono text-[10px] font-bold text-[#D43F3F] uppercase tracking-widest">PILLAR 02</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#1A1A1A]" /> Context Window Manager
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Prunes history scratchpad, sliding token windows, dynamic vector retrieval, and systemic prompt injection.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
                <div className="font-mono text-[10px] font-bold text-[#D43F3F] uppercase tracking-widest">PILLAR 03</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-[#1A1A1A]" /> Tool Call Sandbox
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Middleware that intercepts tool requests, validates schemas, enforces rate limits, and spawns short-lived Tier 3 laborers.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
                <div className="font-mono text-[10px] font-bold text-[#D43F3F] uppercase tracking-widest">PILLAR 04</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#1A1A1A]" /> Steerability & Human-in-Loop
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Breakpoints for manual intervention, prompt steering injection, state mutation, and approval gates.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
                <div className="font-mono text-[10px] font-bold text-[#D43F3F] uppercase tracking-widest">PILLAR 05</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#1A1A1A]" /> Telemetry & Tracing
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Real-time DAG execution visualization, turn-by-turn token breakdown, latency tracking, and audit logs.
                </p>
              </div>

              <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
                <div className="font-mono text-[10px] font-bold text-[#D43F3F] uppercase tracking-widest">PILLAR 06</div>
                <div className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#1A1A1A]" /> Bounded Autonomy Guardrails
                </div>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Strict recursion caps (depth &le; 3), budget ceilings, claim verification rules, and red-team audits.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Execution Loop */}
      {activeTab === 'loop' && (
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Harness Execution Loop & State Machine
              </h2>
              <p className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest">
                Deterministic turn control loop with bounded iteration caps
              </p>
            </div>
            <div className="font-mono text-xs font-bold text-[#D43F3F] bg-red-50 border border-[#D43F3F] px-3 py-1 uppercase">
              TURN #{currentTurn} ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['1. Prompt Assembly', '2. Agent Inference', '3. Tool Interception', '4. State Update'].map((step, idx) => (
              <div
                key={idx}
                className={`border p-4 text-center ${
                  idx === (currentTurn % 4)
                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-md'
                    : 'border-[#1A1A1A]/20 bg-[#F9F8F6] text-[#1A1A1A]'
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mb-1">STEP 0{idx + 1}</div>
                <div className="font-serif text-sm font-bold">{step}</div>
              </div>
            ))}
          </div>

          <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 font-mono text-xs text-[#1A1A1A] space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#D43F3F]">STATE MACHINE CODE REPRESENTATION:</div>
            <pre className="bg-white p-3 border border-[#1A1A1A]/10 overflow-x-auto text-[11px] leading-relaxed">
{`async function harnessExecutionLoop(state: SwarmState): Promise<SwarmState> {
  while (state.turn < state.maxTurns && !state.isCompleted) {
    const context = await contextManager.prepareWindow(state);
    const action = await llmOrchestrator.decideNextStep(context);
    
    if (action.type === 'tool_call') {
      const result = await toolSandbox.execute(action.tool, action.args);
      state = updateStateWithTool(state, result);
    } else if (action.type === 'claim_posted') {
      state = corroborationEngine.registerClaim(state, action.claim);
    }

    if (guardrail.shouldTerminate(state)) break;
    state.turn++;
  }
  return state;
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Context & Window Memory */}
      {activeTab === 'context' && (
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Dynamic Context Window & Memory Manager
              </h2>
              <p className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest">
                Sliding token budget, scratchpad compaction, and claims injection
              </p>
            </div>
            <div className="font-mono text-xs font-bold text-[#1A1A1A]">
              USAGE: {tokenUsage} / {maxContextTokens} TOKENS
            </div>
          </div>

          {/* Token Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[10px] text-[#1A1A1A]/70 uppercase">
              <span>System Prompt (1,024)</span>
              <span>Claims Ledger (1,200)</span>
              <span>Room History ({tokenUsage - 2224})</span>
              <span>Remaining ({maxContextTokens - tokenUsage})</span>
            </div>
            <div className="h-4 w-full border border-[#1A1A1A] bg-white flex overflow-hidden">
              <div className="h-full bg-[#1A1A1A]" style={{ width: '20%' }} />
              <div className="h-full bg-purple-700" style={{ width: '25%' }} />
              <div className="h-full bg-[#B45309]" style={{ width: `${((tokenUsage - 2224) / maxContextTokens) * 100}%` }} />
              <div className="h-full bg-[#F2F0EB]" style={{ flex: 1 }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
              <div className="font-mono font-bold text-[#1A1A1A] uppercase">1. Scratchpad Pruning</div>
              <p className="text-[#1A1A1A]/70">Automatically truncates intermediate thoughts while locking verified claims in permanent memory.</p>
            </div>

            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
              <div className="font-mono font-bold text-[#1A1A1A] uppercase">2. Sliding History Window</div>
              <p className="text-[#1A1A1A]/70">Retains recent 10 messages from the shared deliberation room for cross-examination context.</p>
            </div>

            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-2">
              <div className="font-mono font-bold text-[#1A1A1A] uppercase">3. Claims Invariant Filter</div>
              <p className="text-[#1A1A1A]/70">Ensures active claims list is injected into every specialist's system prompt to prevent hallucination.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tool Call Sandbox */}
      {activeTab === 'tools' && (
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-6">
          <div className="border-b border-[#1A1A1A]/10 pb-3">
            <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Tool Call Middleware & Isolation Sandbox
            </h2>
            <p className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest">
              Intercepting, validating, and executing Tier 3 disposable laborer sub-tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-3">
              <div className="font-mono text-xs font-bold text-[#1A1A1A] uppercase flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#D43F3F]" /> Available Harness Tools
              </div>
              <ul className="space-y-2 font-mono text-xs text-[#1A1A1A]">
                <li className="border border-[#1A1A1A]/10 bg-white p-2.5 flex justify-between items-center">
                  <span>spawns_laborer(taskType, description)</span>
                  <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300">TIER 3 SANDBOX</span>
                </li>
                <li className="border border-[#1A1A1A]/10 bg-white p-2.5 flex justify-between items-center">
                  <span>post_claim(statement, source, tier)</span>
                  <span className="text-[9px] bg-purple-100 text-purple-900 px-2 py-0.5 border border-purple-300">TIER 2 LEDGER</span>
                </li>
                <li className="border border-[#1A1A1A]/10 bg-white p-2.5 flex justify-between items-center">
                  <span>challenge_claim(claimId, critique)</span>
                  <span className="text-[9px] bg-red-100 text-red-900 px-2 py-0.5 border border-red-300">RED-TEAM</span>
                </li>
              </ul>
            </div>

            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-3">
              <div className="font-mono text-xs font-bold text-[#1A1A1A] uppercase flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2A6F47]" /> Safety Interceptor Rules
              </div>
              <div className="space-y-2 text-xs font-sans text-[#1A1A1A]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2A6F47]" />
                  <span>Runtime schema gates on every API boundary</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2A6F47]" />
                  <span>Strict Laborer budget check: max 3 per specialist</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#2A6F47]" />
                  <span>No sub-laborers allowed (Depth cap = 3)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Steerability & Human-in-Loop */}
      {activeTab === 'steerability' && (
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-6">
          <div className="border-b border-[#1A1A1A]/10 pb-3">
            <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Human-in-the-Loop & Steerability Controls
            </h2>
            <p className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest">
              Injecting user prompts, pausing on critical actions, and manual state overrides
            </p>
          </div>

          <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                  Human Approval Breakpoint Gate
                </div>
                <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                  Pause harness before executing high-impact claims or red-team challenges
                </div>
              </div>
              <input
                type="checkbox"
                checked={humanApprovalRequired}
                onChange={(e) => setHumanApprovalRequired(e.target.checked)}
                className="h-4 w-4 border-[#1A1A1A] accent-[#1A1A1A]"
              />
            </div>

            <div className="space-y-2 border-t border-[#1A1A1A]/10 pt-3">
              <label className="block font-mono text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">
                INJECT MID-SESSION STEERING PROMPT TO COUNCIL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Focus specifically on empirical mathematical bounds..."
                  value={customSteerPrompt}
                  onChange={(e) => setCustomSteerPrompt(e.target.value)}
                  className="flex-1 border border-[#1A1A1A]/30 bg-white p-2.5 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customSteerPrompt.trim()) {
                      const newTrace: HarnessTraceEvent = {
                        id: `trace-steer-${Date.now()}`,
                        turn: currentTurn,
                        component: 'human_in_loop',
                        title: 'Human Steering Prompt Injected',
                        detail: `User injected: "${customSteerPrompt}" into Tier 1 Orchestrator context.`,
                        status: 'intercepted',
                        timestamp: '00:03.12',
                        latencyMs: 5,
                      };
                      setTraces([newTrace, ...traces]);
                      setCustomSteerPrompt('');
                    }
                  }}
                  className="border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-2 font-mono text-xs uppercase font-bold text-white hover:bg-[#D43F3F]"
                >
                  INJECT PROMPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Telemetry & Tracing */}
      {activeTab === 'telemetry' && (
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Harness Telemetry & Tracing Logs
              </h2>
              <p className="font-mono text-[10px] text-[#1A1A1A]/60 uppercase tracking-widest">
                Real-time timeline of harness events, latency, and component intercepts
              </p>
            </div>
            <button
              onClick={() => setTraces(INITIAL_TRACES)}
              className="font-mono text-xs border border-[#1A1A1A]/20 bg-[#F9F8F6] px-3 py-1 uppercase text-[#1A1A1A] hover:bg-white"
            >
              CLEAR LOGS
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {traces.map((trace) => (
              <div
                key={trace.id}
                className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="font-bold text-[#D43F3F]">[{trace.timestamp}]</span>
                  <span className="border border-[#1A1A1A]/20 bg-white px-2 py-0.5 text-[9px] uppercase font-bold text-[#1A1A1A]">
                    {trace.component}
                  </span>
                  <div>
                    <div className="font-serif font-bold text-[#1A1A1A]">{trace.title}</div>
                    <div className="text-[11px] text-[#1A1A1A]/70 font-sans">{trace.detail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#1A1A1A]/60">{trace.latencyMs}ms</span>
                  <span className="h-2 w-2 rounded-full bg-[#2A6F47]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
