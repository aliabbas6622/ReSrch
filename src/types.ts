export type AgentTier = 'orchestrator' | 'specialist' | 'laborer';

export type SpecialistRole =
  | 'prior_art'
  | 'classical_philosophy'
  | 'islamic_scholarship'
  | 'mathematics'
  | 'frontier_research'
  | 'current_events'
  | 'skeptic';

export type AgentStatus =
  | 'idle'
  | 'thinking'
  | 'posting'
  | 'spawning_laborer'
  | 'corroborating'
  | 'challenging'
  | 'done';

export interface AgentState {
  id: string;
  name: string;
  tier: AgentTier;
  role?: SpecialistRole;
  avatar: string;
  status: AgentStatus;
  activeBrief: string;
  laborerBudgetRemaining: number;
  color: string;
  description: string;
  isDynamic?: boolean;
  customRoleName?: string;
  customLane?: string;
  systemPrompt?: string;
  currentTask?: string;
  claimsCount?: number;
  corroborationsCount?: number;
  challengesCount?: number;
  confidenceScore?: number;
}

export type LaborerTaskType =
  | 'calculation'
  | 'citation_verify'
  | 'source_fetch'
  | 'translation'
  | 'fact_check';

export interface LaborerTask {
  id: string;
  parentAgentId: string;
  parentAgentName: string;
  taskType: LaborerTaskType;
  description: string;
  result?: string;
  status: 'pending' | 'completed' | 'failed';
  confidence: 'low' | 'med' | 'high';
  timestamp: number;
}

export type SourceTier =
  | 'Primary (Peer-reviewed/Foundational)'
  | 'Reputable Secondary'
  | 'General / Web';

export type ClaimStatus = 'unverified' | 'corroborated' | 'contested';

export interface ClaimCorroboration {
  agentId: string;
  agentName: string;
  evidence: string;
  timestamp: number;
}

export interface ClaimContestation {
  agentId: string;
  agentName: string;
  critique: string;
  timestamp: number;
}

export interface Claim {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: SpecialistRole | 'orchestrator';
  topicAngle: string;
  statement: string;
  evidence: string;
  source: string;
  sourceTier: SourceTier;
  confidence: 'low' | 'med' | 'high';
  status: ClaimStatus;
  corroboratedBy: ClaimCorroboration[];
  contestedBy: ClaimContestation[];
  timestamp: number;
  channel: '#findings' | '#debate';
}

export type MessageType =
  | 'directive'
  | 'finding'
  | 'challenge'
  | 'corroboration'
  | 'laborer_report'
  | 'convergence_note'
  | 'direct_message';

export interface RoomMessage {
  id: string;
  channel: '#findings' | '#debate' | '#orchestrator' | 'DM' | '#laborers';
  senderId: string;
  senderName: string;
  senderRole: SpecialistRole | 'orchestrator' | 'laborer';
  recipientId?: string;
  recipientName?: string;
  text: string;
  claimId?: string;
  laborerTaskId?: string;
  timestamp: number;
  type: MessageType;
}

export interface SwarmConfig {
  maxDebateRounds: number;
  maxLaborersPerSpecialist: number;
  selectedRoles: SpecialistRole[];
  enableRedTeamAutoChallenge: boolean;
  sourceQualityFloor: 'Primary' | 'Secondary' | 'All';
  executionSpeed: 'normal' | 'fast' | 'instant';
}

export type SwarmPhase =
  | 'idle'
  | 'scoping'
  | 'parallel_research'
  | 'cross_examination'
  | 'convergence_check'
  | 'synthesis'
  | 'completed';

export interface ResearchLaneSummary {
  laneName: string;
  role: SpecialistRole;
  summary: string;
  corroboratedClaimsCount: number;
  claims: Claim[];
}

export interface UnresolvedDispute {
  claimStatement: string;
  status: string;
  viewpoints: { agentName: string; position: string }[];
}

export interface BibliographyEntry {
  source: string;
  tier: SourceTier;
  citedBy: string[];
  claimIds: string[];
}

export interface FinalReport {
  title: string;
  executiveSummary: string;
  keyTakeaways: string[];
  researchLanes: ResearchLaneSummary[];
  openDisputesAndContradictions: UnresolvedDispute[];
  verifiedBibliography: BibliographyEntry[];
  mathematicalProofsOrModels?: string[];
  convergenceAnalysis: string;
  generatedAt: number;
}

export interface SwarmLogEvent {
  id: string;
  timestamp: number;
  agentName: string;
  phase: SwarmPhase;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SwarmSession {
  id: string;
  topic: string;
  phase: SwarmPhase;
  currentRound: number;
  totalRounds: number;
  angles: string[];
  agents: AgentState[];
  claims: Claim[];
  messages: RoomMessage[];
  laborers: LaborerTask[];
  report?: FinalReport;
  logs: SwarmLogEvent[];
  config: SwarmConfig;
  createdAt?: number;
}
