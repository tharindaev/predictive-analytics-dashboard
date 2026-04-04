'use client';

import { ForecastPoint } from '@/types';
import { formatCurrency, downloadCSV } from '@/lib/utils';
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useState } from 'react';

interface PredictionTableProps {
  data: ForecastPoint[];
  targetLabel: string;
}

export default function PredictionTable({ data, targetLabel }: PredictionTableProps) {
  const [showAll, setShowAll] = useState(false);
  const futureData = data.filter((d) => d.actual === undefined);
  const displayed = showAll ? futureData : futureData.slice(0, 15);

  const handleExport = () => {
    downloadCSV(
      futureData.map((d) => ({
        date: d.timestamp,
        predicted: d.predicted,
        confidence_lower: d.confidence_lower,
        confidence_upper: d.confidence_upper,
      })),
      `forecast_${targetLabel}_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">
          Prediction Details ({futureData.length} periods)
        </h3>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="px-4 py-2 text-xs font-medium text-gray-400">Date</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-400">Predicted</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-400">Lower Bound</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-400">Upper Bound</th>
              <th className="px-4 py-2 text-xs font-medium text-gray-400">Trend</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row, i) => {
              const prev = i > 0 ? displayed[i - 1].predicted : row.predicted;
              const trend = row.predicted - prev;
              return (
                <tr key={row.timestamp} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="whitespace-nowrap px-4 py-2 text-gray-300">{row.timestamp}</td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-white">
                    {formatCurrency(row.predicted)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                    {formatCurrency(row.confidence_lower)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-500">
                    {formatCurrency(row.confidence_upper)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    {trend >= 0 ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        +{formatCurrency(trend)}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <ArrowDownRight className="h-3.5 w-3.5" />
                        {formatCurrency(trend)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {futureData.length > 15 && (
        <div className="border-t border-gray-800 px-4 py-3 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showAll ? 'Show less' : `Show all ${futureData.length} predictions`}
          </button>
        </div>
      )}
    </div>
  );
}
