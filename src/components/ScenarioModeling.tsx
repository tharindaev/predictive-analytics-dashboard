'use client';

import { ScenarioInput, TrainedModel } from '@/types';
import { computeScenarioPrediction } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Sliders, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ScenarioModelingProps {
  model: TrainedModel;
  initialInputs: ScenarioInput[];
  baseValue: number;
}

export default function ScenarioModeling({ model, initialInputs, baseValue }: ScenarioModelingProps) {
  const [inputs, setInputs] = useState<ScenarioInput[]>(initialInputs);

  const prediction = useMemo(
    () => computeScenarioPrediction(baseValue, inputs, model.feature_importance),
    [inputs, baseValue, model.feature_importance]
  );

  const change = prediction - baseValue;
  const changePct = (change / baseValue) * 100;

  const updateInput = (feature: string, value: number) => {
    setInputs((prev) =>
      prev.map((inp) => (inp.feature === feature ? { ...inp, value } : inp))
    );
  };

  const resetAll = () => setInputs(initialInputs);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Scenario Modeling</h3>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:border-gray-600 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <p className="mb-6 text-xs text-gray-500">
        Adjust input variables to see how they affect the predicted outcome in real-time.
      </p>

      {/* Prediction Result */}
      <div className="mb-8 rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center">
        <p className="mb-1 text-xs text-gray-500">Predicted {model.target_column}</p>
        <p className="text-4xl font-bold text-white">{formatCurrency(prediction)}</p>
        <div className={`mt-2 flex items-center justify-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {change >= 0 ? '+' : ''}{formatCurrency(change)} ({changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}%)
          <span className="ml-1 text-xs text-gray-500">vs baseline</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {inputs.map((input) => {
          const imp = model.feature_importance.find((f) => f.feature === input.feature);
          const changed = input.value !== input.original;
          return (
            <div key={input.feature}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{input.feature}</span>
                  {imp && (
                    <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500">
                      impact: {(imp.importance * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <span className={`text-sm font-mono ${changed ? 'text-blue-400' : 'text-gray-400'}`}>
                  {input.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-right text-xs text-gray-600">{input.min}</span>
                <input
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={input.value}
                  onChange={(e) => updateInput(input.feature, parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-blue-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <span className="w-12 text-xs text-gray-600">{input.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
