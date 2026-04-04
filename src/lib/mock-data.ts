import { Dataset, ColumnSchema, TrainedModel, ForecastPoint, TrainingJob, ScenarioInput } from '@/types';

// Generate sample sales data
function generateSalesData(): Record<string, string | number>[] {
  const data: Record<string, string | number>[] = [];
  const startDate = new Date('2022-01-01');
  for (let i = 0; i < 730; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    const seasonal = Math.sin((month / 12) * 2 * Math.PI) * 2000;
    const trend = i * 5;
    const weekendEffect = (dayOfWeek === 0 || dayOfWeek === 6) ? -1500 : 0;
    const noise = (Math.random() - 0.5) * 3000;
    const revenue = Math.max(5000, 15000 + trend + seasonal + weekendEffect + noise);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue),
      orders: Math.round(revenue / 50 + (Math.random() - 0.5) * 20),
      avg_order_value: Math.round((50 + Math.random() * 30) * 100) / 100,
      marketing_spend: Math.round(1000 + Math.random() * 2000),
      day_of_week: dayOfWeek,
      month: month + 1,
    });
  }
  return data;
}

// Generate churn data
function generateChurnData(): Record<string, string | number>[] {
  const data: Record<string, string | number>[] = [];
  for (let i = 0; i < 500; i++) {
    const tenure = Math.round(Math.random() * 72);
    const monthlyCharges = Math.round((20 + Math.random() * 80) * 100) / 100;
    const totalCharges = Math.round(monthlyCharges * tenure * 100) / 100;
    const support_tickets = Math.round(Math.random() * 10);
    const churnProb = 0.1 + (support_tickets > 5 ? 0.3 : 0) + (tenure < 6 ? 0.2 : 0) + (monthlyCharges > 70 ? 0.15 : 0);
    data.push({
      customer_id: `CUST-${String(i + 1).padStart(4, '0')}`,
      tenure_months: tenure,
      monthly_charges: monthlyCharges,
      total_charges: totalCharges,
      contract_type: Math.random() > 0.5 ? 'month-to-month' : Math.random() > 0.5 ? 'one_year' : 'two_year',
      support_tickets,
      usage_gb: Math.round(Math.random() * 500),
      satisfaction_score: Math.round((1 + Math.random() * 4) * 10) / 10,
      churned: Math.random() < churnProb ? 1 : 0,
    });
  }
  return data;
}

const salesPreview = generateSalesData().slice(0, 10);
const churnPreview = generateChurnData().slice(0, 10);

export const sampleDatasets: Record<string, { data: Record<string, string | number>[]; columns: ColumnSchema[] }> = {
  sales: {
    data: generateSalesData(),
    columns: [
      { name: 'date', dtype: 'datetime', unique_count: 730, null_count: 0, sample_values: ['2022-01-01', '2022-01-02', '2022-01-03'] },
      { name: 'revenue', dtype: 'numeric', unique_count: 720, null_count: 0, sample_values: ['15234', '14891', '16102'], min: 5000, max: 25000, mean: 16800, std: 3200 },
      { name: 'orders', dtype: 'numeric', unique_count: 200, null_count: 0, sample_values: ['305', '298', '322'], min: 100, max: 600, mean: 336, std: 64 },
      { name: 'avg_order_value', dtype: 'numeric', unique_count: 500, null_count: 0, sample_values: ['55.2', '62.1', '48.9'], min: 50, max: 80, mean: 65, std: 8.5 },
      { name: 'marketing_spend', dtype: 'numeric', unique_count: 600, null_count: 0, sample_values: ['1500', '2200', '1800'], min: 1000, max: 3000, mean: 2000, std: 580 },
      { name: 'day_of_week', dtype: 'numeric', unique_count: 7, null_count: 0, sample_values: ['0', '1', '2'], min: 0, max: 6, mean: 3, std: 2 },
      { name: 'month', dtype: 'numeric', unique_count: 12, null_count: 0, sample_values: ['1', '2', '3'], min: 1, max: 12, mean: 6.5, std: 3.45 },
    ],
  },
  churn: {
    data: generateChurnData(),
    columns: [
      { name: 'customer_id', dtype: 'text', unique_count: 500, null_count: 0, sample_values: ['CUST-0001', 'CUST-0002'] },
      { name: 'tenure_months', dtype: 'numeric', unique_count: 73, null_count: 0, sample_values: ['24', '6', '48'], min: 0, max: 72, mean: 36, std: 20.8 },
      { name: 'monthly_charges', dtype: 'numeric', unique_count: 480, null_count: 0, sample_values: ['45.5', '72.3', '29.9'], min: 20, max: 100, mean: 60, std: 23.1 },
      { name: 'total_charges', dtype: 'numeric', unique_count: 498, null_count: 0, sample_values: ['1092', '433.8', '1435.2'], min: 0, max: 7200, mean: 2160, std: 1890 },
      { name: 'contract_type', dtype: 'categorical', unique_count: 3, null_count: 0, sample_values: ['month-to-month', 'one_year', 'two_year'] },
      { name: 'support_tickets', dtype: 'numeric', unique_count: 11, null_count: 0, sample_values: ['2', '7', '0'], min: 0, max: 10, mean: 5, std: 2.9 },
      { name: 'usage_gb', dtype: 'numeric', unique_count: 450, null_count: 0, sample_values: ['234', '89', '412'], min: 0, max: 500, mean: 250, std: 144 },
      { name: 'satisfaction_score', dtype: 'numeric', unique_count: 40, null_count: 0, sample_values: ['3.5', '2.1', '4.8'], min: 1, max: 5, mean: 3, std: 1.15 },
      { name: 'churned', dtype: 'numeric', unique_count: 2, null_count: 0, sample_values: ['0', '1'], min: 0, max: 1, mean: 0.35, std: 0.48 },
    ],
  },
};

export function createDataset(type: 'sales' | 'churn'): Dataset {
  const sample = sampleDatasets[type];
  return {
    id: `ds-${Date.now()}`,
    filename: type === 'sales' ? 'daily_sales_2022_2023.csv' : 'customer_churn_data.csv',
    rows: sample.data.length,
    columns: sample.columns,
    preview: sample.data.slice(0, 10),
    uploaded_at: new Date().toISOString(),
  };
}

export function simulateTraining(onProgress: (job: TrainingJob) => void): Promise<TrainedModel> {
  return new Promise((resolve) => {
    const jobId = `job-${Date.now()}`;
    const stages: { status: TrainingJob['status']; progress: number; duration: number }[] = [
      { status: 'preprocessing', progress: 15, duration: 800 },
      { status: 'preprocessing', progress: 30, duration: 600 },
      { status: 'training', progress: 45, duration: 1000 },
      { status: 'training', progress: 60, duration: 1200 },
      { status: 'training', progress: 75, duration: 800 },
      { status: 'evaluating', progress: 90, duration: 600 },
      { status: 'completed', progress: 100, duration: 400 },
    ];

    let i = 0;
    function next() {
      if (i < stages.length) {
        const stage = stages[i];
        onProgress({
          id: jobId,
          dataset_id: 'ds-1',
          status: stage.status,
          progress: stage.progress,
          started_at: new Date().toISOString(),
        });
        i++;
        setTimeout(next, stage.duration);
      } else {
        resolve(createMockModel());
      }
    }
    next();
  });
}

function createMockModel(): TrainedModel {
  return {
    id: `model-${Date.now()}`,
    dataset_id: 'ds-1',
    model_type: 'time_series',
    metrics: {
      mae: 1245.67,
      rmse: 1589.32,
      r2: 0.847,
    },
    feature_importance: [
      { feature: 'marketing_spend', importance: 0.32 },
      { feature: 'month', importance: 0.24 },
      { feature: 'day_of_week', importance: 0.18 },
      { feature: 'orders', importance: 0.14 },
      { feature: 'avg_order_value', importance: 0.08 },
      { feature: 'trend', importance: 0.04 },
    ],
    target_column: 'revenue',
    feature_columns: ['marketing_spend', 'month', 'day_of_week', 'orders', 'avg_order_value'],
    trained_at: new Date().toISOString(),
  };
}

export function createMockClassificationModel(): TrainedModel {
  return {
    id: `model-${Date.now()}`,
    dataset_id: 'ds-2',
    model_type: 'classification',
    metrics: {
      accuracy: 0.873,
      f1: 0.841,
      auc: 0.912,
      precision: 0.856,
      recall: 0.827,
    },
    feature_importance: [
      { feature: 'support_tickets', importance: 0.28 },
      { feature: 'tenure_months', importance: 0.22 },
      { feature: 'monthly_charges', importance: 0.19 },
      { feature: 'satisfaction_score', importance: 0.15 },
      { feature: 'usage_gb', importance: 0.09 },
      { feature: 'total_charges', importance: 0.07 },
    ],
    target_column: 'churned',
    feature_columns: ['support_tickets', 'tenure_months', 'monthly_charges', 'satisfaction_score', 'usage_gb', 'total_charges'],
    trained_at: new Date().toISOString(),
  };
}

export function generateForecast(historical: Record<string, string | number>[], periods: number = 90): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const lastValues = historical.slice(-60);
  
  // Historical points
  lastValues.forEach((row) => {
    const revenue = Number(row.revenue);
    const predicted = revenue + (Math.random() - 0.5) * 1500;
    points.push({
      timestamp: String(row.date),
      actual: revenue,
      predicted: Math.round(predicted),
      confidence_lower: Math.round(predicted - 2500),
      confidence_upper: Math.round(predicted + 2500),
      error: Math.round(Math.abs(revenue - predicted)),
    });
  });

  // Future predictions
  const lastDate = new Date(String(historical[historical.length - 1].date));
  const avgRevenue = lastValues.reduce((sum, r) => sum + Number(r.revenue), 0) / lastValues.length;
  
  for (let i = 1; i <= periods; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);
    const month = date.getMonth();
    const seasonal = Math.sin((month / 12) * 2 * Math.PI) * 2000;
    const trend = i * 8;
    const noise = (Math.random() - 0.5) * 1500;
    const predicted = avgRevenue + trend + seasonal + noise;
    const uncertainty = 1500 + i * 30;
    
    points.push({
      timestamp: date.toISOString().split('T')[0],
      predicted: Math.round(predicted),
      confidence_lower: Math.round(predicted - uncertainty),
      confidence_upper: Math.round(predicted + uncertainty),
    });
  }

  return points;
}

export function generateScenarioInputs(model: TrainedModel): ScenarioInput[] {
  const defaults: Record<string, { value: number; min: number; max: number; step: number }> = {
    marketing_spend: { value: 2000, min: 500, max: 5000, step: 100 },
    orders: { value: 336, min: 100, max: 600, step: 10 },
    avg_order_value: { value: 65, min: 30, max: 120, step: 5 },
    month: { value: 6, min: 1, max: 12, step: 1 },
    day_of_week: { value: 3, min: 0, max: 6, step: 1 },
    support_tickets: { value: 3, min: 0, max: 10, step: 1 },
    tenure_months: { value: 24, min: 0, max: 72, step: 1 },
    monthly_charges: { value: 60, min: 20, max: 100, step: 5 },
    satisfaction_score: { value: 3.0, min: 1, max: 5, step: 0.1 },
    usage_gb: { value: 250, min: 0, max: 500, step: 10 },
    total_charges: { value: 1440, min: 0, max: 7200, step: 100 },
  };

  return model.feature_columns.map((f) => {
    const d = defaults[f] || { value: 50, min: 0, max: 100, step: 1 };
    return { feature: f, ...d, original: d.value };
  });
}

export function computeScenarioPrediction(
  baseValue: number,
  inputs: ScenarioInput[],
  importances: FeatureImportance[]
): number {
  let delta = 0;
  inputs.forEach((input) => {
    const imp = importances.find((i) => i.feature === input.feature);
    if (imp) {
      const pctChange = (input.value - input.original) / (input.max - input.min);
      delta += pctChange * imp.importance * baseValue * 0.5;
    }
  });
  return Math.round(baseValue + delta);
}

type FeatureImportance = { feature: string; importance: number };
