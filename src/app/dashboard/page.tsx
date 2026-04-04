'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import ColumnMapping from '@/components/ColumnMapping';
import TrainingProgress from '@/components/TrainingProgress';
import { Dataset, TrainingConfig, TrainingJob } from '@/types';
import { createDataset, simulateTraining, sampleDatasets, generateForecast, generateScenarioInputs, createMockClassificationModel } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';

type Step = 'upload' | 'preview' | 'configure' | 'training';

export default function DashboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [trainingJob, setTrainingJob] = useState<TrainingJob | null>(null);

  const handleUpload = useCallback(() => {
    // Simulate with sales data for uploaded files
    const ds = createDataset('sales');
    setDataset(ds);
    setStep('preview');
  }, []);

  const handleSampleSelect = useCallback((type: 'sales' | 'churn') => {
    const ds = createDataset(type);
    setDataset(ds);
    setStep('preview');
  }, []);

  const handleStartTraining = useCallback(
    async (config: TrainingConfig) => {
      setStep('training');
      const isClassification = config.model_type === 'classification';

      const model = await simulateTraining((job) => setTrainingJob(job));

      // Use classification model if that's what was selected
      const finalModel = isClassification ? createMockClassificationModel() : model;

      // Store results in sessionStorage for the results page
      const sampleType = dataset?.filename.includes('churn') ? 'churn' : 'sales';
      const fullData = sampleDatasets[sampleType].data;
      const forecast = isClassification ? [] : generateForecast(fullData, config.forecast_periods || 90);
      const scenarioInputs = generateScenarioInputs(finalModel);

      sessionStorage.setItem(
        'predictflow_results',
        JSON.stringify({
          model: finalModel,
          forecast,
          scenarioInputs,
          dataset: dataset,
        })
      );

      // Navigate to results after short delay
      setTimeout(() => router.push('/results'), 500);
    },
    [dataset, router]
  );

  const stepLabels: Record<Step, string> = {
    upload: 'Upload Data',
    preview: 'Data Preview',
    configure: 'Configure Model',
    training: 'Training',
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          {(['upload', 'preview', 'configure', 'training'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <span
                className={
                  s === step
                    ? 'font-medium text-white'
                    : ['upload', 'preview', 'configure', 'training'].indexOf(s) <
                      ['upload', 'preview', 'configure', 'training'].indexOf(step)
                    ? 'text-blue-400'
                    : ''
                }
              >
                {stepLabels[s]}
              </span>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          {step !== 'upload' && step !== 'training' && (
            <button
              onClick={() =>
                setStep(step === 'configure' ? 'preview' : step === 'preview' ? 'upload' : 'upload')
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {step === 'upload' && 'Upload Your Data'}
              {step === 'preview' && dataset?.filename}
              {step === 'configure' && 'Configure Your Model'}
              {step === 'training' && 'Training in Progress'}
            </h1>
            <p className="text-sm text-gray-400">
              {step === 'upload' && 'Start by uploading a CSV file or choosing sample data'}
              {step === 'preview' && `${dataset?.rows.toLocaleString()} rows · ${dataset?.columns.length} columns`}
              {step === 'configure' && 'Select target variable, features, and model type'}
              {step === 'training' && 'Your model is being trained...'}
            </p>
          </div>
        </div>

        {/* Content */}
        {step === 'upload' && (
          <FileUpload onUpload={handleUpload} onSampleSelect={handleSampleSelect} />
        )}

        {step === 'preview' && dataset && (
          <>
            <DataPreview dataset={dataset} />
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep('configure')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-blue-500 hover:to-purple-500"
              >
                Configure Model
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {step === 'configure' && dataset && (
          <ColumnMapping dataset={dataset} onStartTraining={handleStartTraining} />
        )}

        {step === 'training' && trainingJob && <TrainingProgress job={trainingJob} />}
      </div>
    </div>
  );
}
