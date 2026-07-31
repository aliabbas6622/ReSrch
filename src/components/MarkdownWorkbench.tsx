import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  FileText,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  BookOpen,
  Sparkles,
  Columns,
  Maximize2,
  Code2,
} from 'lucide-react';
import { FinalReport } from '../types';

interface MarkdownWorkbenchProps {
  report?: FinalReport | null;
  topic?: string;
}

const SAMPLE_MARKDOWN = `# Autonomous Multi-Agent Swarm Governance Report

## Executive Summary
This document presents the **formal synthesis** derived by the *Tier 1 Orchestrator* and verified by 7 specialized *Tier 2 Council Members*.

### Key Corroborated Findings
1. **Bounded Recursion Ceiling**: The maximum depth $D$ of short-lived Tier 3 laborers is capped strictly at $D=3$.
2. **Consensus Entropy Equation**:
$$ H(C) = - \\sum_{i=1}^{N} P(c_i) \\log_2 P(c_i) $$

> **Governance Principle**: No claim is admitted to the final synthesis without at least two independent corroborations from distinct specialist lanes.

### Specialist Roster & Status
| Role | Agent Name | Status | Verified Claims |
| :--- | :--- | :--- | :--- |
| Orchestrator | Sovereign Lead | ACTIVE | 12 |
| Frontier Research | Dr. Aris Thorne | CORROBORATED | 4 |
| Empirical Auditor | Dr. Elena Vance | AUDITED | 3 |
| Red-Team Skeptic | Agent Vane | CONTESTED | 2 |

\`\`\`typescript
// Bounded Autonomy Enforcement Loop
export function enforceSafetyCap(currentDepth: number, maxDepth: number = 3): boolean {
  if (currentDepth >= maxDepth) {
    console.warn("[SAFETY GUARDRAIL]: Depth ceiling reached. Terminating child task.");
    return false;
  }
  return true;
}
\`\`\`
`;

export const MarkdownWorkbench: React.FC<MarkdownWorkbenchProps> = ({ report, topic }) => {
  const initialContent = report
    ? `# ${report.title}\n\n## Executive Summary\n${report.executiveSummary}\n\n## Key Takeaways\n${report.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n## Convergence Analysis\n${report.convergenceAnalysis || 'Full convergence achieved.'}\n`
    : SAMPLE_MARKDOWN;

  const [markdownContent, setMarkdownContent] = useState<string>(initialContent);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Swarm-Report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-[#1A1A1A] space-y-6">
      {/* Workbench Header */}
      <div className="border border-[#1A1A1A] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/15 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 mb-1">
              <FileText className="h-4 w-4 text-[#D43F3F]" />
              MARKDOWN & LATEX DOCUMENT WORKBENCH
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Interactive Markdown Studio
            </h1>
            <p className="font-serif text-xs text-[#1A1A1A]/70 italic mt-0.5">
              Live Markdown editor with embedded KaTeX math rendering, GFM tables, and publication export.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {/* View Controls */}
            <div className="flex items-center border border-[#1A1A1A] bg-[#F9F8F6]">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-3 py-1.5 font-bold uppercase tracking-wider transition ${
                  viewMode === 'split' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-white'
                }`}
              >
                <Columns className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode('editor')}
                className={`flex items-center gap-1 px-3 py-1.5 font-bold uppercase tracking-wider transition ${
                  viewMode === 'editor' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-white'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-3 py-1.5 font-bold uppercase tracking-wider transition ${
                  viewMode === 'preview' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A] hover:bg-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="border border-[#1A1A1A] bg-white px-3 py-1.5 uppercase font-bold text-[#1A1A1A] hover:bg-[#F2F0EB] transition flex items-center gap-1"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#2A6F47]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="border border-[#1A1A1A] bg-[#1A1A1A] px-3.5 py-1.5 uppercase font-bold text-white hover:bg-[#D43F3F] hover:border-[#D43F3F] transition flex items-center gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span>EXPORT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Markdown Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`border border-[#1A1A1A] bg-white p-5 space-y-3 shadow-sm ${viewMode === 'editor' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2 font-mono text-xs">
              <span className="font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-[#D43F3F]" /> MARKDOWN SOURCE CODE
              </span>
              <span className="text-[#1A1A1A]/50">{markdownContent.length} CHARS</span>
            </div>

            <textarea
              rows={22}
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              className="w-full border border-[#1A1A1A]/20 bg-[#F9F8F6] p-4 font-mono text-xs text-[#1A1A1A] focus:border-[#D43F3F] focus:outline-none focus:bg-white leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Right: Rendered Markdown View */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`border border-[#1A1A1A] bg-white p-6 space-y-4 shadow-sm ${viewMode === 'preview' ? 'lg:col-span-2' : ''}`}>
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2 font-mono text-xs">
              <span className="font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#B45309]" /> RENDERED DOCUMENT PREVIEW
              </span>
              <span className="text-[#2A6F47] font-bold uppercase tracking-wider bg-emerald-50 border border-[#2A6F47] px-2 py-0.5 text-[9px]">
                REMARK-MATH + KATEX ACTIVE
              </span>
            </div>

            <div className="editorial-markdown-preview prose max-w-none text-[#1A1A1A] space-y-4 font-sans text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-serif text-2xl font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-2 my-4">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-serif text-xl font-bold text-[#1A1A1A] border-b border-[#1A1A1A]/20 pb-1 mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-serif text-base font-bold text-[#1A1A1A] mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#D43F3F] bg-[#F9F8F6] p-3 italic my-4 text-[#1A1A1A]/90 font-serif">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-[#1A1A1A]/30 text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-[#1A1A1A] text-white font-mono uppercase text-[10px]">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-[#1A1A1A]/40 p-2 text-left font-bold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-[#1A1A1A]/20 p-2">
                      {children}
                    </td>
                  ),
                  code: ({ children, className }) => {
                    return (
                      <code className="bg-[#F2F0EB] text-[#1A1A1A] font-mono text-xs px-1.5 py-0.5 border border-[#1A1A1A]/20">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
