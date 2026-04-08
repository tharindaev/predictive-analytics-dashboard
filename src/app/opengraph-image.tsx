import { ImageResponse } from 'next/og';

export const alt = 'PredictFlow — ML-Powered Predictive Analytics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 30% 20%, rgba(79,70,229,0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(6,182,212,0.3), transparent 50%), #0a0a0f',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 64,
              fontWeight: 800,
              color: 'white',
            }}
          >
            P
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
            PredictFlow
          </div>
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: -2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span>Predict the Future with&nbsp;</span>
          <span
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            ML
          </span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          Time-series forecasting · Anomaly detection · Trend analysis
        </div>
      </div>
    ),
    { ...size }
  );
}
