# PredictFlow — AI-Powered Predictive Analytics Dashboard

Upload CSV → Auto-detect columns → Train ML models → Forecast the future.

Full machine learning pipeline in a modern dashboard — no code required.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Python](https://img.shields.io/badge/Python-3.12-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Smart Data Ingestion** — Upload CSV, auto-detect column types (numeric, categorical, datetime), preview data
- **Multiple ML Models** — Time Series (Prophet/ARIMA), Classification (XGBoost), Regression (LightGBM)
- **Auto Column Mapping** — Auto-detect target variable, select features, configure model type
- **Training Pipeline** — Real-time progress tracking with preprocessing → training → evaluation stages
- **Forecast Visualization** — Historical + predicted values with confidence intervals (Recharts)
- **Feature Importance** — Visual ranking of which input variables drive predictions
- **Model Metrics** — MAE, RMSE, R², F1, AUC, Precision, Recall with quality indicators
- **Scenario Modeling** — "What If" sliders for real-time forecast adjustments
- **Export Predictions** — Download forecast as CSV
- **Dark Professional Theme** — Responsive design, mobile-friendly

## Tech Stack

### Frontend
- **Next.js 15** — App Router, TypeScript, Server Components
- **Tailwind CSS 4** — Dark theme, responsive design
- **Recharts** — Interactive charts (line, bar, area, composed)
- **Lucide React** — Icon system

### Backend
- **FastAPI** — REST API with auto-docs
- **Pandas / NumPy** — Data processing and analysis
- **scikit-learn** — Model training and evaluation
- **XGBoost** — Classification models
- **LightGBM** — Regression models
- **Prophet / statsmodels** — Time series forecasting
- **joblib** — Model serialization

## Getting Started

### Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
pip install -r requirements.txt
python data/generate_samples.py  # Generate sample CSVs
uvicorn app.main:app --reload --port 8000
```

API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/datasets/upload` | Upload CSV, auto-analyze columns |
| POST | `/api/datasets/{id}/train` | Start model training |
| GET | `/api/jobs/{id}` | Get training progress |
| POST | `/api/forecasts/{model_id}/predict` | Generate forecast |
| POST | `/api/forecasts/{model_id}/scenario` | Scenario modeling |
| GET | `/api/models/{id}/metrics` | Model performance metrics |

## Sample Datasets

- **Sales Forecast** — 730 days of daily revenue (time series)
- **Churn Prediction** — 500 customers with features (classification)
- **Demand Forecast** — Product sales by region (regression)

## ML Pipeline

1. **Data Analysis** — Auto-detect column types, missing values, distributions
2. **Preprocessing** — Handle nulls, encode categoricals, normalize features
3. **Model Selection** — Time Series / Classification / Regression
4. **Training** — 80/20 train/test split, cross-validation
5. **Evaluation** — MAE, RMSE, R², F1, AUC metrics
6. **Forecasting** — Predictions with confidence intervals

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/page.tsx    # Upload + configure + train
│   │   └── results/page.tsx      # Results dashboard
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── FileUpload.tsx
│   │   ├── DataPreview.tsx
│   │   ├── ColumnMapping.tsx
│   │   ├── TrainingProgress.tsx
│   │   ├── MetricsCard.tsx
│   │   ├── ForecastChart.tsx
│   │   ├── FeatureImportanceChart.tsx
│   │   ├── PredictionTable.tsx
│   │   └── ScenarioModeling.tsx
│   ├── lib/
│   │   ├── mock-data.ts          # Client-side demo data
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app
│   │   ├── data_analyzer.py      # CSV analysis
│   │   ├── trainer.py            # ML training pipeline
│   │   └── predictor.py          # Forecast + scenario
│   ├── data/
│   │   ├── generate_samples.py   # Sample data generator
│   │   └── sample/               # Generated CSVs
│   └── requirements.txt
└── README.md
```

## License

MIT
