'use client';

import { FeatureImportance } from '@/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { formatPercent } from '@/lib/utils';

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

const COLORS = ['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'];

export default function FeatureImportanceChart({ data }: FeatureImportanceChartProps) {
  const sorted = [...data].sort((a, b) => b.importance - a.importance);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-white">Feature Importance</h3>
      <p className="mb-4 text-xs text-gray-500">
        Which input variables have the most impact on predictions
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
            <XAxis
              type="number"
              stroke="#4b5563"
              fontSize={11}
              tickFormatter={(v: number) => formatPercent(v)}
              domain={[0, 'auto']}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="#4b5563"
              fontSize={11}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              formatter={(value) => [formatPercent(Number(value)), 'Importance']}
            />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]} barSize={24}>
              {sorted.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
