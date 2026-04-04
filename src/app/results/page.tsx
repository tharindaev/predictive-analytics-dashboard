'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MetricsCard from '@/components/MetricsCard';
import ForecastChart from '@/components/ForecastChart';
import FeatureImportanceChart from '@/components/FeatureImportanceChart';
import PredictionTable from '@/components/PredictionTable';
import ScenarioModeling from '@/components/ScenarioModeling';
import { TrainedModel, ForecastPoint, ScenarioInput, Dataset } from '@/types';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';

interface ResultsData {
  model: TrainedModel;
  forecast: ForecastPoint[];
  scenarioInputs: ScenarioInput[];
  dataset: Dataset;
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [activeTab, setActiveTab] = useState<'forecast' | 'scenario'>('forecast');

  useEffect(() => {
    const stored = sessionStorage.getItem('predictflow_results');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="mb-4 text-gray-400">No model results found.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { model, forecast, scenarioInputs } = data;
  const isTimeSeries = model.model_type === 'time_series';
  const baseValue = isTimeSeries
    ? forecast.filter((f) => f.actual !== undefined).reduce((s, f) => s + (f.actual || 0), 0) /
      forecast.filter((f) => f.actual !== undefined).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Model Results</h1>
              <p className="text-sm text-gray-400">
                {model.model_type === 'time_series'
                  ? 'Time Series Forecast'
                  : model.model_type === 'classification'
                  ? 'Classification Analysis'
                  : 'Regression Analysis'}{' '}
                — Target: <span className="text-blue-400">{model.target_column}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-gray-600 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Model
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-8">
          <MetricsCard metrics={model.metrics} modelType={model.model_type} />
        </div>

        {/* Tabs for forecast vs scenario (time series only) */}
        {isTimeSeries && (
          <div className="mb-6 flex gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-1">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                activeTab === 'forecast'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Forecast & Analysis
            </button>
            <button
              onClick={() => setActiveTab('scenario')}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                activeTab === 'scenario'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Scenario Modeling
            </button>
          </div>
        )}

        {/* Forecast Tab */}
        {(activeTab === 'forecast' || !isTimeSeries) && (
          <div className="space-y-6">
            {/* Charts Row */}
            <div className={`grid gap-6 ${isTimeSeries ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
              {isTimeSeries && (
                <div className="lg:col-span-2">
                  <ForecastChart data={forecast} targetLabel={model.target_column} />
                </div>
              )}
              <div className={isTimeSeries ? '' : 'max-w-2xl mx-auto w-full'}>
                <FeatureImportanceChart data={model.feature_importance} />
              </div>
            </div>

            {/* Prediction Table (time series only) */}
            {isTimeSeries && (
              <PredictionTable data={forecast} targetLabel={model.target_column} />
            )}
          </div>
        )}

        {/* Scenario Tab */}
        {activeTab === 'scenario' && isTimeSeries && (
          <ScenarioModeling
            model={model}
            initialInputs={scenarioInputs}
            baseValue={baseValue}
          />
        )}
      </div>
    </div>
  );
}
