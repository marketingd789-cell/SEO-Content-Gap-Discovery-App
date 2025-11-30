import React from 'react';
import { GeneratedContent } from '../types';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, ArrowLeft, Download } from 'lucide-react';

interface Props {
  content: GeneratedContent;
  onBack: () => void;
}

const ContentGenerator: React.FC<Props> = ({ content, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${content.title}\n\n${content.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([`# ${content.title}\n\n${content.content}`], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex gap-2">
            <button 
                onClick={downloadFile}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-all"
            >
                <Download size={16} />
                Download MD
            </button>
            <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all text-white
                ${copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        {/* SEO Meta Panel */}
        <div className="bg-slate-50 p-6 border-b border-slate-100">
            <div className="flex flex-wrap gap-2 mb-4">
                {content.targetKeywords.map((kw, i) => (
                    <span key={i} className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {kw}
                    </span>
                ))}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{content.title}</h1>
            <p className="text-slate-600 text-sm italic border-l-4 border-blue-400 pl-3">
                {content.metaDescription}
            </p>
        </div>

        {/* Content Preview */}
        <div className="p-8 prose prose-slate prose-headings:font-bold prose-a:text-blue-600 max-w-none">
          <ReactMarkdown>{content.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;