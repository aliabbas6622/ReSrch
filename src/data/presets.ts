import { SpecialistRole, SwarmConfig } from '../types';

export interface PresetTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  recommendedRoles: SpecialistRole[];
}

export const SPECIALIST_META: Record<
  SpecialistRole,
  {
    name: string;
    lane: string;
    avatar: string;
    color: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    description: string;
  }
> = {
  prior_art: {
    name: 'Product Historian',
    lane: 'Prior Art & Industry Benchmark',
    avatar: '📜',
    color: '#8b5cf6', // purple
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-300',
    borderColor: 'border-purple-500/40',
    description:
      'Analyzes past commercial products, failed attempts, historical papers, and benchmarks. Identifies what shipped, what died, and why.',
  },
  classical_philosophy: {
    name: 'Classical Philosopher',
    lane: 'Classical & Epistemic Foundations',
    avatar: '🏛️',
    color: '#3b82f6', // blue
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    borderColor: 'border-blue-500/40',
    description:
      'Examines foundational Western/Greek philosophy, ethics, epistemology, and historical framing of the core dilemma.',
  },
  islamic_scholarship: {
    name: 'Islamic Scholar',
    lane: 'Islamic Philosophy & Jurisprudence',
    avatar: '📚',
    color: '#10b981', // emerald
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300',
    borderColor: 'border-emerald-500/40',
    description:
      'Analyzes classical Islamic philosophy, jurisprudence (Fiqh), intent frameworks (Niyyah), and scholastic consensus (Ijma) pertinent to the topic.',
  },
  mathematics: {
    name: 'Mathematician',
    lane: 'Formal Proofs & Theoretical Limits',
    avatar: '🧮',
    color: '#f59e0b', // amber
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    borderColor: 'border-amber-500/40',
    description:
      'Provides formal mathematical modeling, proof analysis, bounds, game theory, and computational complexity limits.',
  },
  frontier_research: {
    name: 'Frontier Researcher',
    lane: 'Recent Papers, Preprints & arXiv',
    avatar: '🔬',
    color: '#ec4899', // pink
    badgeBg: 'bg-pink-950/80',
    badgeText: 'text-pink-300',
    borderColor: 'border-pink-500/40',
    description:
      'Tracks cutting-edge research papers, arXiv preprints, top conference proceedings, and breakthrough methodologies.',
  },
  current_events: {
    name: 'Current Events Analyst',
    lane: 'News, Policy & Global Deployment',
    avatar: '🌐',
    color: '#06b6d4', // cyan
    badgeBg: 'bg-cyan-950/80',
    badgeText: 'text-cyan-300',
    borderColor: 'border-cyan-500/40',
    description:
      'Monitors real-world news, geopolitical regulatory frameworks, policy shifts, market deployments, and live industry moves.',
  },
  skeptic: {
    name: 'Red-Team Skeptic',
    lane: 'Adversarial Critique & Verification',
    avatar: '🛡️',
    color: '#ef4444', // red
    badgeBg: 'bg-red-950/80',
    badgeText: 'text-red-300',
    borderColor: 'border-red-500/40',
    description:
      'Actively pokes holes in other agents claims, tests hidden assumptions, searches for counter-examples, and verifies logical integrity.',
  },
};

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: 'ai-governance',
    title: 'Ethics & Bound Autonomy in AI Governance Infrastructure',
    category: 'AI Safety & Policy',
    description:
      'Investigating structural constraints, liability models, and formal decision limits when autonomous AI agents oversee critical public infrastructure.',
    prompt:
      'Analyze the ethics, legal liability, formal verification limits, and systemic safety boundaries of deploying autonomous multi-agent systems to govern critical energy grids and public transit networks.',
    recommendedRoles: [
      'prior_art',
      'classical_philosophy',
      'mathematics',
      'frontier_research',
      'current_events',
      'skeptic',
    ],
  },
  {
    id: 'evolution-of-intent',
    title: 'Formalization of Intent (Niyyah) from Jurisprudence to Decision AI',
    category: 'Legal & Epistemic Philosophy',
    description:
      'Comparing classical Islamic jurisprudence on intent (Niyyah) and mens rea with modern agentic goal specification and formal utility functions.',
    prompt:
      'Compare how intent (Niyyah) is defined, verified, and weighted in classical Islamic jurisprudence with modern formal specifications of utility functions and goal alignment in autonomous agent architectures.',
    recommendedRoles: [
      'prior_art',
      'classical_philosophy',
      'islamic_scholarship',
      'mathematics',
      'frontier_research',
      'skeptic',
    ],
  },
  {
    id: 'zero-knowledge-privacy',
    title: 'Zero-Knowledge Proofs vs Optimistic State Machines at Scale',
    category: 'Cryptographic Engineering',
    description:
      'Evaluating mathematical proof generation overhead, recursive STARKs/SNARKs, and game-theoretic fraud proof limits in decentralized consensus.',
    prompt:
      'Perform a deep comparative analysis between Zero-Knowledge rollups (ZK-SNARKs/STARKs) and Optimistic state verification regarding mathematical proof generation complexity, latency, hardware costs, and security guarantees at 100,000 TPS.',
    recommendedRoles: [
      'prior_art',
      'mathematics',
      'frontier_research',
      'current_events',
      'skeptic',
    ],
  },
  {
    id: 'quantum-error-correction',
    title: 'Fault-Tolerant Quantum Scalability: Surface Codes vs Topological Qubits',
    category: 'Physics & Computing',
    description:
      'Examining physical error rates, physical-to-logical qubit overhead, and recent experimental breakthroughs in Majorana bound states.',
    prompt:
      'Assess the realistic timeline and engineering trade-offs between surface code error correction on superconducting/trapped-ion architectures versus topological qubit implementations for fault-tolerant quantum supremacy.',
    recommendedRoles: [
      'prior_art',
      'mathematics',
      'frontier_research',
      'current_events',
      'skeptic',
    ],
  },
  {
    id: 'neurosymbolic-reasoning',
    title: 'Neuro-Symbolic Logic & Formal Bounds on LLM Hallucinations',
    category: 'Computer Science',
    description:
      'Can statistical language models achieve deterministic correctness when coupled with formal SMT solvers and automated theorem provers?',
    prompt:
      'Investigate the theoretical and practical limits of using neuro-symbolic reasoning (coupling probabilistic transformers with formal SMT provers like Z3) to eliminate hallucinations in automated mathematical deduction.',
    recommendedRoles: [
      'prior_art',
      'classical_philosophy',
      'mathematics',
      'frontier_research',
      'skeptic',
    ],
  },
];

export const DEFAULT_CONFIG: SwarmConfig = {
  maxDebateRounds: 3,
  maxLaborersPerSpecialist: 3,
  selectedRoles: [
    'prior_art',
    'classical_philosophy',
    'islamic_scholarship',
    'mathematics',
    'frontier_research',
    'current_events',
    'skeptic',
  ],
  enableRedTeamAutoChallenge: true,
  sourceQualityFloor: 'Secondary',
  executionSpeed: 'normal',
};
