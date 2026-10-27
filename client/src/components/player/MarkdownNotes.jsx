import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

export const MarkdownNotes = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!content || !content.trim()) {
    return (
      <div className="py-8 px-4 text-center rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
        <FileText className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-xs text-slate-500 font-medium">No written study notes provided for this lesson.</p>
      </div>
    );
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Simple, lightweight, secure Markdown parser for headers, code blocks, lists, and emphasis
  const renderFormattedMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let codeLang = '';
    let blockId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block start / end
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.replace('```', '').trim() || 'code';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const currentCode = codeBuffer.join('\n');
          const currentId = `code-${blockId++}`;
          elements.push(
            <div key={currentId} className="relative group my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <span className="uppercase tracking-wider">{codeLang}</span>
                <button
                  onClick={() => copyToClipboard(currentCode, currentId)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  {copiedCode === currentId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{currentCode}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-slate-900 mt-5 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3 pb-1 border-b border-slate-200">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-2 border-brand-500 pl-3 py-1 my-2 text-xs italic text-slate-600 bg-brand-50/60 rounded-r">
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={i} className="text-xs text-slate-700 ml-5 list-disc leading-relaxed my-1">
            {formatInlineStyles(line.substring(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '');
        elements.push(
          <li key={i} className="text-xs text-slate-700 ml-5 list-decimal leading-relaxed my-1">
            {formatInlineStyles(itemText)}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-xs text-slate-700 leading-relaxed my-1.5">
            {formatInlineStyles(line)}
          </p>
        );
      }
    }

    return elements;
  };

  const formatInlineStyles = (str) => {
    // Process inline code `foo` and bold **bar**
    const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-slate-100 text-brand-700 font-mono text-[11px] border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return <div className="prose-auralms">{renderFormattedMarkdown(content)}</div>;
};
