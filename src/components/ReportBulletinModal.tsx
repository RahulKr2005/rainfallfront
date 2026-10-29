import React, { useState, useEffect } from 'react';
import { FileDown, Copy, Check, X, ShieldAlert } from 'lucide-react';
import { fetchBulletin } from '../services/api';

interface ReportBulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  horizon: number;
}

export const ReportBulletinModal: React.FC<ReportBulletinModalProps> = ({
  isOpen,
  onClose,
  horizon,
}) => {
  const [bulletin, setBulletin] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchBulletin(horizon, 'markdown')
        .then((res) => setBulletin(res.bulletin_markdown))
        .catch((err) => setBulletin(`Error generating bulletin: ${err.message}`))
        .finally(() => setLoading(false));
    }
  }, [isOpen, horizon]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bulletin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([bulletin], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DELHI_EWS_BULLETIN_${horizon}H.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-600 dark:text-blue-400">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
                Civil Defense Research Summary
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Early Warning Research Bulletin ({horizon}h)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official markdown bulletin formatted for emergency planning and scientific archiving
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
          {loading ? 'Compiling bulletin data...' : bulletin}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            Weather early warning bulletin.
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-medium transition shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
