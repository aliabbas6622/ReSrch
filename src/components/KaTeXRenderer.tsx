import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  math?: string;
  block?: boolean;
  className?: string;
  children?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({
  math,
  block = false,
  className = '',
  children,
}) => {
  const latexSource = math || children || '';

  const html = useMemo(() => {
    try {
      return katex.renderToString(latexSource, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-red-600 font-mono text-xs">[LaTeX error: ${latexSource}]</span>`;
    }
  }, [latexSource, block]);

  return (
    <span
      className={`katex-wrapper ${block ? 'block my-3 text-center overflow-x-auto py-2' : 'inline-block px-1'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Parses a mix of Markdown-like text and inline/block LaTeX:
 * Inline: $...$
 * Block: $$...$$
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const parts = useMemo(() => {
    if (!text) return [];

    const result: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // First find block math $$...$$
    const textBlocks: Array<{ text: string; math?: string }> = [];
    while ((match = blockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        textBlocks.push({ text: text.slice(lastIndex, match.index) });
      }
      textBlocks.push({ text: '', math: match[1] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      textBlocks.push({ text: text.slice(lastIndex) });
    }

    // Now process inline math $...$ inside text segments
    textBlocks.forEach((tb) => {
      if (tb.math) {
        result.push({ type: 'block-math', content: tb.math });
      } else {
        const inlineRegex = /\$([^\$\n]+?)\$/g;
        let inlineLast = 0;
        let imatch: RegExpExecArray | null;
        while ((imatch = inlineRegex.exec(tb.text)) !== null) {
          if (imatch.index > inlineLast) {
            result.push({ type: 'text', content: tb.text.slice(inlineLast, imatch.index) });
          }
          result.push({ type: 'inline-math', content: imatch[1] });
          inlineLast = imatch.index + imatch[0].length;
        }
        if (inlineLast < tb.text.length) {
          result.push({ type: 'text', content: tb.text.slice(inlineLast) });
        }
      }
    });

    return result;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((p, idx) => {
        if (p.type === 'block-math') {
          return <KaTeXRenderer key={idx} math={p.content} block />;
        }
        if (p.type === 'inline-math') {
          return <KaTeXRenderer key={idx} math={p.content} block={false} />;
        }
        return <span key={idx}>{p.content}</span>;
      })}
    </span>
  );
};
