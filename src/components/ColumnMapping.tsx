'use client';

import { Dataset, TrainingConfig } from '@/types';
import { Target, Layers, Clock, TrendingUp, Users, BarChart2 } from 'lucide-react';
import { useState } from 'react';

interface ColumnMappingProps {
  dataset: Dataset;
  onStartTraining: (config: TrainingConfig) => void;
}

export default function ColumnMapping({ dataset, onStartTraining }: ColumnMappingProps) {
  const numericColumns = dataset.columns.filter((c) => c.dtype === 'numeric');
  const dateColumns = dataset.columns.filter((c) => c.dtype === 'datetime');

  const [targetColumn, setTargetColumn] = useState(numericColumns[numericColumns.length - 1]?.name || '');
  const [features, setFeatures] = useState<string[]>(
    numericColumns.filter((c) => c.name !== targetColumn).map((c) => c.name)
  );
  const [modelType, setModelType] = useState<'time_series' | 'classification' | 'regression'>(
    dateColumns.length > 0 ? 'time_series' : numericColumns.some((c) => c.unique_count === 2) ? 'classification' : 'regression'
  );
  const [dateColumn, setDateColumn] = useState(dateColumns[0]?.name || '');
  const [forecastPeriods, setForecastPeriods] = useState(90);

  const toggleFeature = (name: string) => {
    setFeatures((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  const modelTypes = [
    {
      value: 'time_series' as const,
      label: 'Time Series',
      description: 'Prophet / ARIMA — Forecast future values over time',
      icon: <Clock className="h-5 w-5" />,
      color: 'border-blue-500 bg-blue-500/10 text-blue-400',
    },
    {
      value: 'classification' as const,
      label: 'Classification',
      description: 'XGBoost — Predict categories (churn, yes/no)',
      icon: <Users className="h-5 w-5" />,
      color: 'border-purple-500 bg-purple-500/10 text-purple-400',
    },
    {
      value: 'regression' as const,
      label: 'Regression',
      description: 'LightGBM — Predict numerical values',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'border-green-500 bg-green-500/10 text-green-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Model Type Selection */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <BarChart2 className="h-4 w-4 text-gray-400" />
          Model Type
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {modelTypes.map((mt) => (
            <button
              key={mt.value}
              onClick={() => setModelType(mt.value)}
              className={`rounded-xl border p-4 text-left transition-all ${
                modelType === mt.value
                  ? mt.color
                  : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="mb-2">{mt.icon}</div>
              <p className="text-sm font-semibold text-white">{mt.label}</p>
              <p className="mt-1 text-xs text-gray-400">{mt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Target Variable */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Target className="h-4 w-4 text-red-400" />
          Target Variable (What to Predict)
        </h3>
        <div className="flex flex-wrap gap-2">
          {numericColumns.map((col) => (
            <button
              key={col.name}
              onClick={() => {
                setTargetColumn(col.name);
                setFeatures((prev) => prev.filter((f) => f !== col.name));
              }}
              className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                targetColumn === col.name
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date Column (for time series) */}
      {modelType === 'time_series' && dateColumns.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="h-4 w-4 text-blue-400" />
            Date Column
          </h3>
          <div className="flex flex-wrap gap-2">
            {dateColumns.map((col) => (
              <button
                key={col.name}
                onClick={() => setDateColumn(col.name)}
                className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                  dateColumn === col.name
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                {col.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feature Columns */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Layers className="h-4 w-4 text-blue-400" />
          Feature Columns ({features.length} selected)
        </h3>
        <div className="flex flex-wrap gap-2">
          {numericColumns
            .filter((c) => c.name !== targetColumn)
            .map((col) => (
              <button
                key={col.name}
                onClick={() => toggleFeature(col.name)}
                className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                  features.includes(col.name)
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                {col.name}
              </button>
            ))}
        </div>
      </div>

      {/* Forecast Periods */}
      {modelType === 'time_series' && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Forecast Periods</h3>
          <div className="flex gap-2">
            {[30, 90, 180, 365].map((p) => (
              <button
                key={p}
                onClick={() => setForecastPeriods(p)}
                className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                  forecastPeriods === p
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                {p} days
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start Training */}
      <button
        onClick={() =>
          onStartTraining({
            dataset_id: dataset.id,
            target_column: targetColumn,
            feature_columns: features,
            model_type: modelType,
            date_column: dateColumn || undefined,
            forecast_periods: forecastPeriods,
          })
        }
        disabled={!targetColumn || features.length === 0}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Training Model
      </button>
    </div>
  );
}
