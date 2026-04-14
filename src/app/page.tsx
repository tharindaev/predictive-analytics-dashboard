'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Target,
  LineChart,
  BarChart3,
  Download,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Upload,
  Brain,
  Eye,
  Menu,
  X,
  DollarSign,
  Truck,
  Cpu,
  Briefcase,
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Time-Series Forecasting',
    description:
      'Project future values for sales, demand, traffic, or any temporal signal with state-of-the-art models.',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly Detection',
    description:
      'Surface outliers and unusual patterns in real time so you can respond before issues escalate.',
  },
  {
    icon: Target,
    title: 'Confidence Intervals',
    description:
      'Quantify uncertainty with statistically sound prediction bands at 80%, 90%, and 95%.',
  },
  {
    icon: LineChart,
    title: 'Trend Analysis',
    description:
      'Decompose seasonality, cycles, and long-term momentum to understand what drives your data.',
  },
  {
    icon: BarChart3,
    title: 'Interactive Charts',
    description:
      'Explore predictions visually with zoomable, hover-enabled charts built for fast iteration.',
  },
  {
    icon: Download,
    title: 'Export & Reports',
    description:
      'Ship results downstream with CSV, JSON, and shareable reports your whole team can use.',
  },
];

const trustStats = [
  { label: 'ML-Powered', sub: 'Modern algorithms' },
  { label: 'Time Series', sub: 'Forecast horizons' },
  { label: 'Anomaly Detection', sub: 'Real-time alerts' },
  { label: 'Real-time', sub: 'Streaming insights' },
];

const steps = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Data',
    description: 'Drop a CSV or connect a sample dataset. Columns are auto-detected.',
  },
  {
    num: '02',
    icon: Brain,
    title: 'Train Model',
    description: 'Pick a target, choose a model family, and let PredictFlow do the heavy lifting.',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Generate Forecast',
    description: 'Produce point predictions and confidence intervals over your chosen horizon.',
  },
  {
    num: '04',
    icon: Eye,
    title: 'Visualize',
    description: 'Explore charts, anomalies, and trends — then export to your stack.',
  },
];

const useCases = [
  {
    icon: DollarSign,
    title: 'Finance',
    description: 'Forecast revenue, cash flow, and market signals with confidence bands.',
  },
  {
    icon: Truck,
    title: 'Supply Chain',
    description: 'Predict demand, optimize inventory, and anticipate disruptions before they hit.',
  },
  {
    icon: Cpu,
    title: 'IoT Monitoring',
    description: 'Detect sensor anomalies and equipment drift in real-time telemetry streams.',
  },
  {
    icon: Briefcase,
    title: 'Business Intelligence',
    description: 'Turn historical KPIs into forward-looking dashboards your team can act on.',
  },
];

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#use-cases', label: 'Use cases' },
  { href: '/dashboard', label: 'Dashboard' },
];

function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-gray-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">PredictFlow</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
          >
            Launch app
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 hover:bg-white/5 hover:text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-gray-950/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-base font-semibold text-white"
            >
              Launch app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />
          <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              ML-Powered Analytics
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Predict the Future with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ML
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base text-gray-400 sm:text-lg lg:text-xl">
              Time-series forecasting, anomaly detection, and trend analysis powered by machine
              learning — all from one dashboard. No code required.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/dashboard"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 sm:w-auto"
              >
                Start Forecasting
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-gray-200 transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto"
              >
                Explore Features
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Trust bar — contained */}
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur sm:p-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {trustStats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                      {s.label}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 sm:text-sm">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Everything you need to forecast
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              A complete ML toolkit built for analysts, engineers, and operators.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-blue-500/30 hover:bg-white/[0.04]"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-400">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative border-t border-white/5 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              How it works
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              From raw data to deployed forecast in four steps.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-purple-500/30"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-extrabold text-transparent">
                      {s.num}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="relative border-t border-white/5 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Built for every team
            </h2>
            <p className="text-base text-gray-400 sm:text-lg">
              Whatever you measure, PredictFlow can forecast it.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u) => {
              const Icon = u.icon;
              return (
                <div
                  key={u.title}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-blue-500/30 hover:bg-white/[0.04]"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{u.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{u.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-gray-900 to-cyan-500/20 p-8 text-center sm:p-12 lg:p-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
              </div>
              <div className="relative">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Start forecasting today
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-base text-gray-300 sm:text-lg">
                  Upload your data and get ML-powered forecasts in minutes — no setup required.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50"
                >
                  Launch the dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <Link href="/" className="flex items-center gap-2.5 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">PredictFlow</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm text-gray-400">
                ML-powered predictive analytics for forecasting, anomaly detection, and trend
                analysis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div>
                <div className="mb-4 text-sm font-semibold text-white">Quick links</div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <Link href="#features" className="hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#how" className="hover:text-white">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link href="#use-cases" className="hover:text-white">
                      Use cases
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mb-4 text-sm font-semibold text-white">Resources</div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <Link href="/dashboard" className="hover:text-white">
                      Get started
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-white">
                      Sample data
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-white">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} PredictFlow. All rights reserved.</div>
            <div>Built with Next.js · Deployed on Vercel</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
