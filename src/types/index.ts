export interface ColumnSchema {
  name: string;
  dtype: 'numeric' | 'categorical' | 'datetime' | 'text';
  unique_count: number;
  null_count: number;
  sample_values: string[];
  min?: number;
  max?: number;
  mean?: number;
  std?: number;
}

export interface Dataset {
  id: string;
  filename: string;
  rows: number;
  columns: ColumnSchema[];
  preview: Record<string, string | number>[];
  uploaded_at: string;
}

export interface TrainingConfig {
  dataset_id: string;
  target_column: string;
  feature_columns: string[];
  model_type: 'time_series' | 'classification' | 'regression';
  date_column?: string;
  forecast_periods?: number;
}

export interface TrainingJob {
  id: string;
  dataset_id: string;
  status: 'pending' | 'preprocessing' | 'training' | 'evaluating' | 'completed' | 'failed';
  progress: number;
  error_message?: string;
  model_id?: string;
  started_at: string;
  completed_at?: string;
}

export interface ModelMetrics {
  mae?: number;
  rmse?: number;
  r2?: number;
  f1?: number;
  auc?: number;
  accuracy?: number;
  precision?: number;
  recall?: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface TrainedModel {
  id: string;
  dataset_id: string;
  model_type: string;
  metrics: ModelMetrics;
  feature_importance: FeatureImportance[];
  target_column: string;
  feature_columns: string[];
  trained_at: string;
}

export interface ForecastPoint {
  timestamp: string;
  actual?: number;
  predicted: number;
  confidence_lower: number;
  confidence_upper: number;
  error?: number;
}

export interface ScenarioInput {
  feature: string;
  value: number;
  min: number;
  max: number;
  step: number;
  original: number;
}
