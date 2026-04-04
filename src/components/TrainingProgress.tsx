'use client';

import { TrainingJob } from '@/types';
import { Loader2, CheckCircle2, Database, Brain, BarChart2 } from 'lucide-react';

interface TrainingProgressProps {
  job: TrainingJob;
}

const stageInfo: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Initializing...', icon: <Loader2 className="h-5 w-5 animate-spin" />, color: 'text-gray-400' },
  preprocessing: { label: 'Preprocessing Data', icon: <Database className="h-5 w-5" />, color: 'text-blue-400' },
  training: { label: 'Training Model', icon: <Brain className="h-5 w-5" />, color: 'text-purple-400' },
  evaluating: { label: 'Evaluating Performance', icon: <BarChart2 className="h-5 w-5" />, color: 'text-amber-400' },
  completed: { label: 'Training Complete!', icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-green-400' },
};

export default function TrainingProgress({ job }: TrainingProgressProps) {
  const stage = stageInfo[job.status] || stageInfo.pending;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 ${stage.color}`}>{stage.icon}</div>
        <h3 className="mb-1 text-lg font-semibold text-white">{stage.label}</h3>
        <p className="mb-6 text-sm text-gray-400">
          {job.status === 'completed'
            ? 'Your model is ready for predictions'
            : 'This may take a few moments...'}
        </p>

        {/* Progress Bar */}
        <div className="mb-2 h-3 w-full max-w-md overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-400">{job.progress}%</span>

        {/* Stage Steps */}
        <div className="mt-8 flex w-full max-w-md justify-between">
          {['preprocessing', 'training', 'evaluating', 'completed'].map((s, i) => {
            const isActive = job.status === s;
            const isPast =
              ['preprocessing', 'training', 'evaluating', 'completed'].indexOf(job.status) > i;
            return (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isPast
                      ? 'bg-green-500/20 text-green-400'
                      : isActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  {isPast ? '✓' : i + 1}
                </div>
                <span className="text-xs capitalize text-gray-500">{s === 'completed' ? 'Done' : s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
