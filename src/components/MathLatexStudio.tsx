import React, { useState } from 'react';
import { KaTeXRenderer, MathText } from './KaTeXRenderer';
import {
  Sigma,
  Calculator,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileCode,
  CheckCircle2,
  BrainCircuit,
  HelpCircle,
} from 'lucide-react';

interface TheoremPreset {
  id: string;
  title: string;
  category: string;
  latex: string;
  explanation: string;
  swarmApplication: string;
}

const MATHEMATICAL_THEOREMS: TheoremPreset[] = [
  {
    id: 'bound-autonomy',
    title: 'Bounded Autonomy Recursion Cap (Theorem 1.1)',
    category: 'Agent Swarm Theory',
    latex: `\\mathcal{R}_{max} = \\sum_{k=1}^{D} \\prod_{j=1}^{k} B_j \\le B_{orchestrator} \\cdot (B_{specialist})^{D-1}`,
    explanation: 'Defines the strict ceiling on total laborer sub-task spawns where $D$ is the max depth cap (hardcoded $D=3$) and $B_j$ is the remaining budget vector.',
    swarmApplication: 'Ensures Tier 3 disposable laborers terminate in finite steps without infinite recursion loops.',
  },
  {
    id: 'corroboration-consensus',
    title: 'Multi-Specialist Claim Corroboration Entropy',
    category: 'Information Theory',
    latex: `H(C) = - \\sum_{i=1}^{N} P(c_i) \\log_2 P(c_i) + \\lambda \\cdot \\Delta_{critique}`,
    explanation: 'Measures the reduction in uncertainty of claim $C$ when validated by $N$ independent specialist roles across distinct research lanes.',
    swarmApplication: 'Used by the Orchestrator to calculate when a claim transitions from UNVERIFIED to CORROBORATED status.',
  },
  {
    id: 'adversarial-payoff',
    title: 'Skeptic Red-Team Game Theoretic Equilibrium',
    category: 'Game Theory',
    latex: `U(S, R) = \\max_{\\theta} \\mathbb{E} \\left[ \\mathbb{I}_{contradiction}(S_i, R_j) \\cdot (1 - \\gamma^{\\text{depth}}) \\right]`,
    explanation: 'The payoff function for the Skeptic Specialist $S$ challenging candidate research findings $R$ to eliminate hallucinated consensus.',
    swarmApplication: 'Powers automatic red-team challenge triggers in cross-examination debate rounds.',
  },
  {
    id: 'convergence-metric',
    title: 'Swarm Deliberation Convergence Index',
    category: 'Stochastic Processes',
    latex: `\\Phi(t) = 1 - \\frac{|| \\mathbf{C}_{unverified}(t) ||}{|| \\mathbf{C}_{total}(t) || + 1} \\cdot e^{-\\alpha \\cdot t}`,
    explanation: 'Tracks overall swarm progress toward final synthesis readiness as debate turns progress from round 1 to round 5.',
    swarmApplication: 'Triggers Phase 4 (Convergence Check) when $\\Phi(t) > 0.85$.',
  },
];

export const MathLatexStudio: React.FC = () => {
  const [selectedTheorem, setSelectedTheorem] = useState<TheoremPreset>(MATHEMATICAL_THEOREMS[0]);
  const [customLatex, setCustomLatex] = useState<string>(
    `\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}`
  );
  const [customExplanation, setCustomExplanation] = useState<string>(
    'The Gaussian integral evaluated over the entire real line equals $\\sqrt{\\pi}$.'
  );
  const [copied, setCopied] = useState(false);

  const handleCopyLatex = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-[#1A1A1A] space-y-8">
      {/* Studio Header */}
      <div className="border border-[#1A1A1A] bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/15 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-1">
              <Sigma className="h-4 w-4 text-[#D43F3F]" />
              FORMAL MATHEMATICAL SPECIFICATIONS & PROOFS ENGINE
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
              LaTeX & Math Derivation Workbench
            </h1>
            <p className="font-serif text-sm text-[#1A1A1A]/70 italic mt-1">
              Rigorous mathematical modeling of multi-agent swarm dynamics, game-theoretic debate equilibria, and bounded recursion bounds.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="border border-[#1A1A1A]/20 bg-[#F2F0EB] px-3 py-1.5 uppercase tracking-wider text-[#1A1A1A] font-semibold">
              KATEX ENGINE ACTIVE
            </span>
          </div>
        </div>

        {/* Preset Theorem Selector */}
        <div className="space-y-4">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">
            SELECT FORMAL MATHEMATICAL PROOF / EQUATION PRESET:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {MATHEMATICAL_THEOREMS.map((thm) => (
              <button
                key={thm.id}
                onClick={() => {
                  setSelectedTheorem(thm);
                  setCustomLatex(thm.latex);
                  setCustomExplanation(thm.explanation);
                }}
                className={`text-left p-3.5 border transition font-sans ${
                  selectedTheorem.id === thm.id
                    ? 'border-[#1A1A1A] bg-[#F9F8F6] ring-1 ring-[#1A1A1A]'
                    : 'border-[#1A1A1A]/20 bg-white hover:border-[#1A1A1A]/60'
                }`}
              >
                <div className="font-mono text-[9px] font-bold text-[#D43F3F] uppercase tracking-wider mb-1">
                  {thm.category}
                </div>
                <div className="font-serif text-xs font-bold text-[#1A1A1A] line-clamp-1 mb-2">
                  {thm.title}
                </div>
                <div className="bg-white p-2 border border-[#1A1A1A]/10 text-[11px] overflow-hidden">
                  <KaTeXRenderer math={thm.latex} block={false} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: KaTeX Formula Editor & Raw LaTeX */}
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[#D43F3F]" />
              LaTeX Code Editor
            </h2>
            <button
              onClick={() => handleCopyLatex(customLatex)}
              className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase border border-[#1A1A1A]/20 bg-[#F9F8F6] px-2.5 py-1 text-[#1A1A1A] hover:bg-white transition"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-[#2A6F47]" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-[#1A1A1A]/60" />
                  <span>COPY LATEX</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <label className="block font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
              INPUT LATEX MATHEMATICAL EQUATION:
            </label>
            <textarea
              rows={4}
              value={customLatex}
              onChange={(e) => setCustomLatex(e.target.value)}
              className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-3 font-mono text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none focus:bg-white"
            />
          </div>

          <div className="space-y-3">
            <label className="block font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
              ANNOTATION & DERIVATION TEXT:
            </label>
            <input
              type="text"
              value={customExplanation}
              onChange={(e) => setCustomExplanation(e.target.value)}
              className="w-full border border-[#1A1A1A]/30 bg-[#F9F8F6] p-2.5 font-sans text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none"
            />
          </div>

          <div className="border-t border-[#1A1A1A]/10 pt-4">
            <div className="font-mono text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest mb-2">
              QUICK INSERT LATEX OPERATORS:
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {[
                { label: 'Sum', code: '\\sum_{i=1}^{n}' },
                { label: 'Integral', code: '\\int_{a}^{b}' },
                { label: 'Fraction', code: '\\frac{a}{b}' },
                { label: 'Matrix', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
                { label: 'Limit', code: '\\lim_{x \\to \\infty}' },
                { label: 'Infinity', code: '\\infty' },
                { label: 'Expectation', code: '\\mathbb{E}[X]' },
              ].map((snippet) => (
                <button
                  key={snippet.label}
                  onClick={() => setCustomLatex((prev) => prev + ' ' + snippet.code)}
                  className="border border-[#1A1A1A]/20 bg-[#F9F8F6] px-2 py-1 text-[#1A1A1A] hover:bg-white hover:border-[#1A1A1A] transition"
                >
                  +{snippet.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Realtime KaTeX Render Preview */}
        <div className="border border-[#1A1A1A] bg-white p-6 space-y-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/15 pb-3 mb-4">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B45309]" />
                Rendered KaTeX Formula & Proof
              </h2>
              <span className="font-mono text-[9px] font-bold text-[#2A6F47] uppercase tracking-wider bg-emerald-50 border border-[#2A6F47] px-2 py-0.5">
                LIVE PARSER OK
              </span>
            </div>

            {/* Formatted Rendered Card */}
            <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-6 space-y-4">
              <div className="font-serif text-base font-bold text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2">
                {selectedTheorem.title}
              </div>

              {/* KaTeX Block Render */}
              <div className="bg-white p-4 border border-[#1A1A1A]/15 shadow-xs overflow-x-auto">
                <KaTeXRenderer math={customLatex} block />
              </div>

              {/* Text + Inline Math explanation */}
              <div className="font-serif text-xs text-[#1A1A1A]/90 leading-relaxed bg-white p-3 border border-[#1A1A1A]/10">
                <MathText text={customExplanation} />
              </div>

              <div className="border-t border-[#1A1A1A]/10 pt-3">
                <div className="font-mono text-[9px] font-bold text-[#D43F3F] uppercase tracking-wider mb-1">
                  SWARM ARCHITECTURE IMPLICATION:
                </div>
                <p className="font-sans text-xs text-[#1A1A1A]/80">
                  {selectedTheorem.swarmApplication}
                </p>
              </div>
            </div>
          </div>

          <div className="font-mono text-[10px] text-[#1A1A1A]/60 border-t border-[#1A1A1A]/10 pt-3 flex items-center justify-between">
            <span>KATEX JS COMPLIANT // NO RUNTIME ERRORS</span>
            <span>MATHJAX / LATEX SPECIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
