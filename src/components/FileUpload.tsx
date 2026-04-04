'use client';

import { Upload, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  onSampleSelect: (type: 'sales' | 'churn') => void;
}

export default function FileUpload({ onUpload, onSampleSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) onUpload(file);
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
        }`}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
          <Upload className="h-8 w-8 text-blue-400" />
        </div>
        <p className="mb-1 text-lg font-semibold text-white">Drop your CSV file here</p>
        <p className="mb-4 text-sm text-gray-400">or click to browse files</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300">
          <FileSpreadsheet className="h-4 w-4" />
          Supports CSV files up to 50MB
        </div>
      </div>

      <div className="text-center">
        <p className="mb-3 text-sm text-gray-500">Or try with sample data</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onSampleSelect('sales')}
            className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-300 transition-all hover:border-blue-500/50 hover:bg-gray-800"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            Sales Forecast (730 days)
          </button>
          <button
            onClick={() => onSampleSelect('churn')}
            className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-300 transition-all hover:border-purple-500/50 hover:bg-gray-800"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            Churn Prediction (500 customers)
          </button>
        </div>
      </div>
    </div>
  );
}
