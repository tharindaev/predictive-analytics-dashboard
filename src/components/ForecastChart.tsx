'use client';

import { ForecastPoint } from '@/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ForecastChartProps {
  data: ForecastPoint[];
  targetLabel: string;
}

export default function ForecastChart({ data, targetLabel }: ForecastChartProps) {
  const lastActualIdx = data.findIndex((d) => d.actual === undefined) - 1;
  const dividerDate = lastActualIdx >= 0 ? data[lastActualIdx].timestamp : undefined;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-white">
        Forecast — {targetLabel}
      </h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="timestamp"
              stroke="#4b5563"
              fontSize={11}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              stroke="#4b5563"
              fontSize={11}
              tickFormatter={(v: number) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value, name) => [
                formatCurrency(Number(value)),
                String(name) === 'actual' ? 'Actual' : String(name) === 'predicted' ? 'Predicted' : String(name),
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
            />
            <Area
              type="monotone"
              dataKey="confidence_upper"
              stroke="none"
              fill="url(#confidenceGrad)"
              name="Confidence Band"
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="confidence_lower"
              stroke="none"
              fill="#111827"
              name="confidence_lower"
              legendType="none"
            />
            {dividerDate && (
              <ReferenceLine
                x={dividerDate}
                stroke="#6366f1"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                label={{
                  value: 'Forecast Start',
                  fill: '#6366f1',
                  fontSize: 11,
                  position: 'top',
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="actual"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#818cf8"
              strokeWidth={2}
              dot={false}
              name="predicted"
              strokeDasharray="4 2"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 bg-emerald-500" />
          <span>Historical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-b-2 border-dashed border-indigo-400" />
          <span>Predicted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-4 rounded bg-indigo-500/15" />
          <span>Confidence Interval</span>
        </div>
      </div>
    </div>
  );
}
