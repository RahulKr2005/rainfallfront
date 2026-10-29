import React, { useState } from 'react';
import { BookOpen, ExternalLink, CheckCircle2, Clock, AlertCircle, X, Search } from 'lucide-react';
import { CatalogItem } from '../types';

interface DatasetCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogItem[];
}

export const DatasetCatalogModal: React.FC<DatasetCatalogModalProps> = ({
  isOpen,
  onClose,
  catalog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = catalog.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variables.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
                Provenance & Data Lineage
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Official Dataset Sources Registry ({catalog.length} Collections)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official citations, resolutions, latency benchmarks, and open data access portals
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

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dataset name, satellite sensor, variable, or collection ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
        </div>

        {/* Dataset Cards List */}
        <div className="space-y-3 overflow-y-auto max-h-[58vh] pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/70 transition space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                    <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md">
                      {item.product_version}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      ID: {item.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{item.citation}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      item.status === 'CONNECTED'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                        : item.status === 'CACHED_PILOT'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                  <a
                    href={item.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition"
                    title="Visit Official Documentation"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Metadata Key-Value Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Spatial Resolution</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{item.spatial_resolution}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Temporal Cycle</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{item.temporal_resolution}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Access / License</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block" title={item.licence}>
                    {item.licence}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">Pipeline Role</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block" title={item.role}>
                    {item.role}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800 font-mono">
                <span>Variables: <strong className="text-slate-900 dark:text-white">{item.variables}</strong> ({item.units})</span>
                <span className="text-slate-500 dark:text-slate-400">Latency: {item.latency_notes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>Metadata verified against NASA, NOAA, ESA, and IMD specifications</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
