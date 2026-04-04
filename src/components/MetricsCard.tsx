'use client';

import { ModelMetrics } from '@/types';
import { formatPercent } from '@/lib/utils';
import { TrendingUp, Target, BarChart2, Activity, Award } from 'lucide-react';

interface MetricsCardProps {
  metrics: ModelMetrics;
  modelType: string;
}

interface MetricDisplay {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

function getQuality(value: number, higher_is_better: boolean): 'excellent' | 'good' | 'fair' | 'poor' {
  if (higher_is_better) {
    if (value >= 0.9) return 'excellent';
    if (value >= 0.75) return 'good';
    if (value >= 0.5) return 'fair';
    return 'poor';
  }
  // Lower is better (errors)
  return 'good';
}

const qualityColors = {
  excellent: 'text-green-400 bg-green-500/10 border-green-500/20',
  good: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  fair: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  poor: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function MetricsCard({ metrics, modelType }: MetricsCardProps) {
  const displays: MetricDisplay[] = [];

  if (metrics.r2 !== undefined) {
    displays.push({
      label: 'R² Score',
      value: formatPercent(metrics.r2),
      description: 'Variance explained by model',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-blue-400',
      quality: getQuality(metrics.r2, true),
    });
  }
  if (metrics.mae !== undefined) {
    displays.push({
      label: 'MAE',
      value: metrics.mae.toFixed(2),
      description: 'Mean Absolute Error',
      icon: <Target className="h-5 w-5" />,
      color: 'text-purple-400',
      quality: 'good',
    });
  }
  if (metrics.rmse !== undefined) {
    displays.push({
      label: 'RMSE',
      value: metrics.rmse.toFixed(2),
      description: 'Root Mean Squared Error',
      icon: <BarChart2 className="h-5 w-5" />,
      color: 'text-amber-400',
      quality: 'good',
    });
  }
  if (metrics.accuracy !== undefined) {
    displays.push({
      label: 'Accuracy',
      value: formatPercent(metrics.accuracy),
      description: 'Overall correct predictions',
      icon: <Award className="h-5 w-5" />,
      color: 'text-green-400',
      quality: getQuality(metrics.accuracy, true),
    });
  }
  if (metrics.f1 !== undefined) {
    displays.push({
      label: 'F1 Score',
      value: formatPercent(metrics.f1),
      description: 'Harmonic mean of precision & recall',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-blue-400',
      quality: getQuality(metrics.f1, true),
    });
  }
  if (metrics.auc !== undefined) {
    displays.push({
      label: 'AUC-ROC',
      value: formatPercent(metrics.auc),
      description: 'Area Under the ROC Curve',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-400',
      quality: getQuality(metrics.auc, true),
    });
  }
  if (metrics.precision !== undefined) {
    displays.push({
      label: 'Precision',
      value: formatPercent(metrics.precision),
      description: 'True positives / predicted positives',
      icon: <Target className="h-5 w-5" />,
      color: 'text-amber-400',
      quality: getQuality(metrics.precision, true),
    });
  }
  if (metrics.recall !== undefined) {
    displays.push({
      label: 'Recall',
      value: formatPercent(metrics.recall),
      description: 'True positives / actual positives',
      icon: <Activity className="h-5 w-5" />,
      color: 'text-green-400',
      quality: getQuality(metrics.recall, true),
    });
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">
        Model Performance — {modelType === 'time_series' ? 'Time Series' : modelType === 'classification' ? 'Classification' : 'Regression'}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {displays.map((d) => (
          <div
            key={d.label}
            className={`rounded-xl border p-4 ${qualityColors[d.quality]}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium opacity-70">{d.label}</span>
              {d.icon}
            </div>
            <p className="text-2xl font-bold">{d.value}</p>
            <p className="mt-1 text-xs opacity-60">{d.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
