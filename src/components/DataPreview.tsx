'use client';

import { Dataset } from '@/types';
import { Database, Hash, Calendar, Type, AlertCircle } from 'lucide-react';

interface DataPreviewProps {
  dataset: Dataset;
}

const typeIcons = {
  numeric: <Hash className="h-3.5 w-3.5 text-blue-400" />,
  categorical: <Type className="h-3.5 w-3.5 text-purple-400" />,
  datetime: <Calendar className="h-3.5 w-3.5 text-green-400" />,
  text: <Type className="h-3.5 w-3.5 text-gray-400" />,
};

const typeColors = {
  numeric: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  categorical: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  datetime: 'bg-green-500/10 text-green-400 border-green-500/20',
  text: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function DataPreview({ dataset }: DataPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-xs text-gray-500">Rows</p>
          <p className="text-2xl font-bold text-white">{dataset.rows.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-xs text-gray-500">Columns</p>
          <p className="text-2xl font-bold text-white">{dataset.columns.length}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-xs text-gray-500">Numeric</p>
          <p className="text-2xl font-bold text-blue-400">
            {dataset.columns.filter((c) => c.dtype === 'numeric').length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-xs text-gray-500">Missing Values</p>
          <p className="text-2xl font-bold text-green-400">
            {dataset.columns.reduce((s, c) => s + c.null_count, 0)}
          </p>
        </div>
      </div>

      {/* Column Inspector */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-3">
          <Database className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-white">Column Inspector</h3>
        </div>
        <div className="divide-y divide-gray-800/50">
          {dataset.columns.map((col) => (
            <div key={col.name} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {typeIcons[col.dtype]}
                <span className="text-sm font-medium text-white">{col.name}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${typeColors[col.dtype]}`}
                >
                  {col.dtype}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{col.unique_count} unique</span>
                {col.null_count > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <AlertCircle className="h-3 w-3" />
                    {col.null_count} nulls
                  </span>
                )}
                {col.mean !== undefined && (
                  <span className="hidden sm:inline">
                    μ={col.mean.toFixed(1)} σ={col.std?.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="border-b border-gray-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Data Preview (First 10 Rows)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {dataset.columns.map((col) => (
                  <th key={col.name} className="whitespace-nowrap px-4 py-2 text-xs font-medium text-gray-400">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.preview.map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  {dataset.columns.map((col) => (
                    <td key={col.name} className="whitespace-nowrap px-4 py-2 text-gray-300">
                      {String(row[col.name] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
