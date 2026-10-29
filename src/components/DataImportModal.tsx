import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X, Loader2 } from 'lucide-react';
import { uploadDataset } from '../services/api';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [sourceType, setSourceType] = useState('IMD_STATION_CSV');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const res = await uploadDataset(sourceType, selectedFile);
      setResult(res);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-600 dark:text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
                Data Ingestion Engine
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Local Dataset Ingestion Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload in-situ weather observations, radar volumes, or SAR water masks
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

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-semibold mb-1.5">
              Select Dataset Format / Ingestion Adapter
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
            >
              <option value="IMD_STATION_CSV">IMD Surface Weather Station Observations (CSV)</option>
              <option value="RADAR_NETCDF">IMD Doppler Weather Radar Scan (NetCDF-4 / HDF5)</option>
              <option value="SENTINEL1_SAR">Copernicus Sentinel-1 SAR Water Extent (GeoTIFF)</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-6 text-center transition bg-slate-50/50 dark:bg-slate-800/30">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block space-y-2">
              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-fit mx-auto shadow-xs text-blue-600 dark:text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                {selectedFile ? selectedFile.name : 'Click to select or drop local file'}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono block">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supported formats: .csv, .nc, .h5, .tif'}
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Upload & Validation Verified</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">{result.message}</p>
              {result.records_parsed !== undefined && (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">
                  Parsed Records: {result.records_parsed}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-medium transition flex items-center gap-2 shadow-xs"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{uploading ? 'Validating...' : 'Ingest Dataset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
