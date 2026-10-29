import React from 'react';
import { BarChart3, CheckCircle2, ShieldCheck, AlertCircle, X } from 'lucide-react';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationData: any;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  onClose,
  evaluationData,
}) => {
  if (!isOpen || !evaluationData) return null;

  const { rainfall_forecasting_evaluation, inundation_sar_evaluation, scientific_integrity_notes } = evaluationData;
  const h24 = rainfall_forecasting_evaluation?.h24;
  const h6 = rainfall_forecasting_evaluation?.h6;
  const h12 = rainfall_forecasting_evaluation?.h12;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-medium">
                Scientific Verification
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Model Evaluation & Benchmark Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rigorous holdout test metrics, baseline comparisons, and Sentinel-1 SAR spatial ground truth
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

        {/* 1. Rainfall Continuous Metrics Table (6h, 12h, 24h) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              1. Continuous Error Metrics (Chronological Holdout Split)
            </h3>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">Zero lookahead evaluated</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-xs text-left text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-mono border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Horizon</th>
                  <th className="p-3">Threshold</th>
                  <th className="p-3">ML MAE (mm)</th>
                  <th className="p-3">ML RMSE (mm)</th>
                  <th className="p-3">Persistence MAE</th>
                  <th className="p-3">Raw GFS MAE</th>
                  <th className="p-3 text-emerald-600 dark:text-emerald-400">Skill vs Persistence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {[
                  { label: '6-Hour', data: h6 },
                  { label: '12-Hour', data: h12 },
                  { label: '24-Hour', data: h24 },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white font-sans">{row.label}</td>
                    <td className="p-3 text-amber-600 dark:text-amber-400">{row.data?.threshold_used_mm} mm</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{row.data?.continuous_metrics?.ml_model?.mae_mm}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{row.data?.continuous_metrics?.ml_model?.rmse_mm}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{row.data?.continuous_metrics?.persistence_baseline?.mae_mm}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{row.data?.continuous_metrics?.raw_gfs_nwp?.mae_mm}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      +{row.data?.continuous_metrics?.skill_score_vs_persistence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Categorical Heavy-Rain Event Contingency Table */}
        {h24 && (
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              2. 24-Hour Event Categorical Contingency (IMD Heavy Rain Threshold: {h24.threshold_used_mm} mm)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Probability of Detection (POD)</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  {h24.categorical_metrics?.probability_of_detection_pod}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Hit rate</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">False Alarm Ratio (FAR)</span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1 block">
                  {h24.categorical_metrics?.false_alarm_ratio_far}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Lower is better</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Critical Success Index (CSI)</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {h24.categorical_metrics?.critical_success_index_csi}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Threat score</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Heidke Skill Score (HSS)</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1 block">
                  {h24.categorical_metrics?.heidke_skill_score_hss}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Chance-adjusted</span>
              </div>
            </div>
          </section>
        )}

        {/* 3. Sentinel-1 SAR Flood Inundation Spatial Validation */}
        {inundation_sar_evaluation && (
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              3. Copernicus Sentinel-1 SAR Spatial Water Extent Validation (July 2023 Flood)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Spatial IoU (Jaccard Index)</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {inundation_sar_evaluation.iou_jaccard}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Grid intersection</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Precision</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {inundation_sar_evaluation.precision}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">True positive purity</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">Recall</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {inundation_sar_evaluation.recall}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Coverage sensitivity</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-sans">F1-Score</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
                  {inundation_sar_evaluation.f1_score}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">Harmonic balance</span>
              </div>
            </div>
          </section>
        )}

        {/* 4. Scientific Integrity & Methodological Guarantees */}
        <section className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Academic Methodology & Integrity Safeguards</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed pt-1">
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Chronological Holdouts:</strong>
              {scientific_integrity_notes?.split_strategy}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Zero Lookahead Leakage:</strong>
              {scientific_integrity_notes?.zero_leakage_guarantee}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Honest Depth Disclaimer:</strong>
              {scientific_integrity_notes?.depth_omission_rationale}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
