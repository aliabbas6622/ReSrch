import React from 'react';
import { FinalReport } from '../types';
import { SPECIALIST_META } from '../data/presets';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  Award,
  AlertTriangle,
  Brain,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface FinalReportViewProps {
  report: FinalReport;
  topic: string;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({ report, topic }) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'summary' | 'lanes' | 'disputes' | 'bibliography'>('summary');

  const generateMarkdown = () => {
    let md = `# ${report.title}\n\n`;
    md += `**Topic**: ${topic}\n`;
    md += `**Generated**: ${new Date(report.generatedAt).toLocaleString()}\n\n`;
    md += `--- \n\n## Executive Summary\n\n${report.executiveSummary}\n\n`;
    md += `## Key Takeaways\n\n`;
    report.keyTakeaways.forEach((k) => {
      md += `- ${k}\n`;
    });
    md += `\n## Research Lanes Synthesis\n\n`;
    report.researchLanes.forEach((lane) => {
      md += `### ${lane.laneName}\n`;
      md += `${lane.summary}\n\n`;
      if (lane.claims && lane.claims.length > 0) {
        md += `**Corroborated Claims:**\n`;
        lane.claims.forEach((c) => {
          md += `- "${c.statement}" (Source: ${c.source})\n`;
        });
        md += `\n`;
      }
    });
    if (report.openDisputesAndContradictions.length > 0) {
      md += `## Open Disputes & Contradictions\n\n`;
      report.openDisputesAndContradictions.forEach((d) => {
        md += `### "${d.claimStatement}"\n`;
        md += `**Status**: ${d.status}\n`;
        d.viewpoints.forEach((vp) => {
          md += `- **${vp.agentName}**: ${vp.position}\n`;
        });
        md += `\n`;
      });
    }
    md += `## Verified Bibliography\n\n`;
    report.verifiedBibliography.forEach((b) => {
      md += `- **${b.source}** [Tier: ${b.tier}] (Cited by: ${b.citedBy.join(', ')})\n`;
    });
    return md;
  };

  const handleCopy = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Swarm_Report_${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
  };

  return (
    <div className="border border-[#1A1A1A] bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Banner / Journal Paper Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
            <span className="border border-[#2A6F47] bg-emerald-50 px-2.5 py-0.5 text-[#2A6F47] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              VERIFIED COUNCIL REPORT
            </span>
            <span>
              GENERATED: {new Date(report.generatedAt).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {report.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 border border-[#1A1A1A] bg-white px-3 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:bg-[#F2F0EB] transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#2A6F47]" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#1A1A1A]/60" />
                <span>COPY MD</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-white hover:bg-[#D43F3F] hover:border-[#D43F3F] transition"
          >
            <Download className="h-4 w-4" />
            <span>EXPORT .MD</span>
          </button>
        </div>
      </div>

      {/* Editorial Navigation Tabs */}
      <div className="flex border-b border-[#1A1A1A]/20 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
            activeTab === 'summary'
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
          }`}
        >
          Summary & Insights
        </button>

        <button
          onClick={() => setActiveTab('lanes')}
          className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
            activeTab === 'lanes'
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
          }`}
        >
          Specialist Lanes ({report.researchLanes.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
            activeTab === 'disputes'
              ? 'border-[#D43F3F] text-[#D43F3F]'
              : 'border-transparent text-[#1A1A1A]/60 hover:text-[#D43F3F]'
          }`}
        >
          Open Disputes ({report.openDisputesAndContradictions.length})
        </button>

        <button
          onClick={() => setActiveTab('bibliography')}
          className={`pb-2 px-3 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition ${
            activeTab === 'bibliography'
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
          }`}
        >
          Bibliography ({report.verifiedBibliography.length})
        </button>
      </div>

      {/* Tab 1: Executive Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Executive Summary Paragraphs */}
          <div className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-6 space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2 border-b border-[#1A1A1A]/10 pb-2">
              <FileText className="h-4 w-4 text-[#D43F3F]" />
              EXECUTIVE SYNTHESIS
            </h3>
            <div className="font-serif text-sm text-[#1A1A1A] leading-relaxed space-y-3 whitespace-pre-wrap">
              {report.executiveSummary}
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h3 className="font-mono text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#B45309]" />
              KEY CORROBORATED INSIGHTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="border border-[#1A1A1A]/15 bg-white p-4 flex items-start gap-3 shadow-xs"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#1A1A1A] bg-[#1A1A1A] text-white text-[10px] font-mono font-bold">
                    0{idx + 1}
                  </span>
                  <p className="font-serif text-xs text-[#1A1A1A] leading-relaxed">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Convergence Analysis */}
          {report.convergenceAnalysis && (
            <div className="border border-[#1A1A1A] bg-[#F2F0EB] p-4">
              <h4 className="font-mono text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-[#1A1A1A]" />
                ORCHESTRATOR CONVERGENCE ASSESSMENT
              </h4>
              <p className="font-serif text-xs text-[#1A1A1A]/90 italic">{report.convergenceAnalysis}</p>
            </div>
          )}

          {/* Mathematical Models */}
          {report.mathematicalProofsOrModels && report.mathematicalProofsOrModels.length > 0 && (
            <div>
              <h3 className="font-mono text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-2">
                FORMAL PROOFS & MATHEMATICAL BOUNDS
              </h3>
              <div className="space-y-2">
                {report.mathematicalProofsOrModels.map((proof, idx) => (
                  <div
                    key={idx}
                    className="border border-[#B45309] bg-amber-50 p-3 font-mono text-xs text-[#B45309]"
                  >
                    {proof}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Specialist Research Lanes */}
      {activeTab === 'lanes' && (
        <div className="space-y-4">
          {report.researchLanes.map((lane, idx) => {
            const roleMeta = SPECIALIST_META[lane.role] || SPECIALIST_META['frontier_research'];
            return (
              <div
                key={idx}
                className="border border-[#1A1A1A]/20 bg-white p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{roleMeta.avatar}</span>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#1A1A1A]">{lane.laneName}</h3>
                      <p className="font-mono text-[10px] text-[#1A1A1A]/60">SPECIALIST: {roleMeta.name.toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#2A6F47] bg-emerald-50 text-[#2A6F47]">
                    {lane.corroboratedClaimsCount} Corroborated Claims
                  </span>
                </div>

                <p className="font-serif text-xs text-[#1A1A1A]/90 leading-relaxed bg-[#F9F8F6] p-3 border border-[#1A1A1A]/10">
                  {lane.summary}
                </p>

                {lane.claims && lane.claims.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
                      SUBMITTED CLAIMS
                    </h4>
                    {lane.claims.map((c) => (
                      <div
                        key={c.id}
                        className="border border-[#1A1A1A]/15 bg-white p-3 text-xs text-[#1A1A1A] space-y-1"
                      >
                        <div className="font-serif font-bold text-[#1A1A1A]">"{c.statement}"</div>
                        <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                          <span>SOURCE: </span>
                          {c.source} [{c.sourceTier}]
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Open Disputes & Contradictions */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="border border-[#B45309] bg-amber-50 p-4 font-mono text-xs text-[#B45309]">
            <strong>BOUNDED AUTONOMY RULE:</strong> Unresolved contradictions and red-team critiques are explicitly retained in the report rather than papered over with false consensus.
          </div>

          {report.openDisputesAndContradictions.length === 0 ? (
            <div className="text-center py-8 font-serif text-xs text-[#1A1A1A]/60 italic">
              No open disputes remaining. Full convergence established across all active specialist lanes.
            </div>
          ) : (
            report.openDisputesAndContradictions.map((dispute, idx) => (
              <div
                key={idx}
                className="border border-[#D43F3F] bg-red-50/40 p-5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#D43F3F]/20 pb-2">
                  <h3 className="font-serif text-sm font-bold text-[#D43F3F] flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Contested Claim #{idx + 1}
                  </h3>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#D43F3F] bg-white text-[#D43F3F]">
                    {dispute.status}
                  </span>
                </div>

                <div className="font-serif text-xs font-bold text-[#1A1A1A] bg-white p-3 border border-[#1A1A1A]/20">
                  "{dispute.claimStatement}"
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest">
                    DIVERGENT VIEWPOINTS
                  </h4>
                  {dispute.viewpoints.map((vp, vidx) => (
                    <div
                      key={vidx}
                      className="border border-[#1A1A1A]/15 bg-white p-3 text-xs text-[#1A1A1A] flex items-start gap-2"
                    >
                      <span className="font-mono text-[10px] font-bold text-[#D43F3F] shrink-0">
                        [{vp.agentName}]:
                      </span>
                      <span className="font-serif">{vp.position}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Bibliography */}
      {activeTab === 'bibliography' && (
        <div className="space-y-3">
          <h3 className="font-mono text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-widest mb-2">
            VERIFIED SOURCE CITATIONS
          </h3>

          {report.verifiedBibliography.map((bib, idx) => (
            <div
              key={idx}
              className="border border-[#1A1A1A]/20 bg-[#F9F8F6] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-serif font-bold text-[#1A1A1A]">{bib.source}</div>
                <div className="font-mono text-[10px] text-[#1A1A1A]/60">
                  Cited by: {bib.citedBy.join(', ')}
                </div>
              </div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider border border-[#1A1A1A]/20 bg-white px-2.5 py-0.5 text-[#1A1A1A] shrink-0">
                {bib.tier}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
