'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  BarChart3,
  Upload,
  Brain,
  TrendingUp,
  Sliders,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
  LineChart,
  GitBranch,
} from 'lucide-react';

const features = [
  {
    icon: <Upload className="h-6 w-6" />,
    title: 'Smart Data Ingestion',
    description: 'Upload CSV files and auto-detect column types, missing values, and data distributions.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'Auto ML Training',
    description: 'Select from Time Series (Prophet/ARIMA), Classification (XGBoost), or Regression (LightGBM).',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Forecast with Confidence',
    description: 'Get predictions with confidence intervals for 30, 90, or 365 days into the future.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Sliders className="h-6 w-6" />,
    title: 'Scenario Modeling',
    description: 'Adjust input variables with "What If" sliders and see real-time forecast changes.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Feature Importance',
    description: 'Understand which variables drive your predictions with visual importance rankings.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Model Metrics',
    description: 'Evaluate models with MAE, RMSE, R², F1, AUC — all displayed with quality indicators.',
    color: 'from-rose-500 to-red-500',
  },
];

const steps = [
  {
    step: '01',
    title: 'Upload Your Data',
    description: 'Drop a CSV file or choose from sample datasets. The system auto-analyzes your columns.',
    icon: <Upload className="h-5 w-5" />,
  },
  {
    step: '02',
    title: 'Configure & Train',
    description: 'Select your target variable, pick features, choose a model type, and hit train.',
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    step: '03',
    title: 'Analyze & Forecast',
    description: 'View predictions, metrics, feature importance, and explore what-if scenarios.',
    icon: <LineChart className="h-5 w-5" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Predictive Analytics
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Turn Data Into
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Predictions
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Upload your CSV, auto-detect columns, train ML models, and forecast sales, churn, demand
            — all from a single dashboard. No code required.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:from-blue-500 hover:to-purple-500"
            >
              Start Analyzing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-8 py-3.5 text-sm font-medium text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-800"
            >
              Try Sample Data
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
              Full ML Pipeline in Your Browser
            </h2>
            <p className="text-gray-400">
              From raw data to actionable forecasts — everything you need in one place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-gray-700 hover:bg-gray-900"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white`}
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="text-gray-400">Three simple steps to predictive insights.</p>
          </div>
          <div className="space-y-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-6"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg font-bold text-white">
                  {s.step}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/50 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Predict the Future?</h2>
          <p className="mb-8 text-gray-400">
            Upload your data and get AI-powered forecasts in minutes.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-purple-500"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600">
            <BarChart3 className="h-3.5 w-3.5 text-white" />
          </div>
          <span>PredictFlow</span>
        </div>
        <p className="mt-2">AI-Powered Predictive Analytics Dashboard</p>
      </footer>
    </div>
  );
}
