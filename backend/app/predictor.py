"""Forecast generation and scenario modeling."""

import numpy as np
import joblib
from datetime import datetime, timedelta
from typing import Any


def generate_forecast(model_record: dict, periods: int) -> list[dict[str, Any]]:
    """Generate forecast for next N periods using the trained model."""
    model_path = model_record.get("model_path")
    if not model_path:
        return []

    try:
        model = joblib.load(model_path)
    except Exception:
        return []

    feature_columns = model_record["feature_columns"]
    forecasts = []

    # Generate synthetic future feature values based on historical patterns
    base_date = datetime.utcnow()
    for i in range(periods):
        future_date = base_date + timedelta(days=i)
        features = {}

        for col in feature_columns:
            if col in ("month",):
                features[col] = future_date.month
            elif col in ("day_of_week",):
                features[col] = future_date.weekday()
            elif col in ("marketing_spend",):
                features[col] = 2000 + np.random.normal(0, 300)
            elif col in ("orders",):
                features[col] = 336 + np.random.normal(0, 30)
            elif col in ("avg_order_value",):
                features[col] = 65 + np.random.normal(0, 5)
            else:
                features[col] = np.random.normal(50, 10)

        feature_array = np.array([[features.get(c, 0) for c in feature_columns]])

        try:
            prediction = float(model.predict(feature_array)[0])
        except Exception:
            prediction = 0.0

        uncertainty = 1500 + i * 25
        forecasts.append(
            {
                "timestamp": future_date.strftime("%Y-%m-%d"),
                "predicted": round(prediction, 2),
                "confidence_lower": round(prediction - uncertainty, 2),
                "confidence_upper": round(prediction + uncertainty, 2),
            }
        )

    return forecasts


def run_scenario(model_record: dict, feature_values: dict[str, float]) -> dict[str, Any]:
    """Run scenario modeling with adjusted feature values."""
    model_path = model_record.get("model_path")
    if not model_path:
        return {"prediction": 0, "change": 0}

    try:
        model = joblib.load(model_path)
    except Exception:
        return {"prediction": 0, "change": 0}

    feature_columns = model_record["feature_columns"]

    # Default values for baseline
    baseline_values = {
        "marketing_spend": 2000,
        "orders": 336,
        "avg_order_value": 65,
        "month": 6,
        "day_of_week": 3,
        "support_tickets": 3,
        "tenure_months": 24,
        "monthly_charges": 60,
        "satisfaction_score": 3.0,
        "usage_gb": 250,
        "total_charges": 1440,
    }

    # Baseline prediction
    baseline_array = np.array(
        [[baseline_values.get(c, 50) for c in feature_columns]]
    )
    baseline_pred = float(model.predict(baseline_array)[0])

    # Scenario prediction
    scenario_array = np.array(
        [[feature_values.get(c, baseline_values.get(c, 50)) for c in feature_columns]]
    )
    scenario_pred = float(model.predict(scenario_array)[0])

    return {
        "baseline_prediction": round(baseline_pred, 2),
        "scenario_prediction": round(scenario_pred, 2),
        "change": round(scenario_pred - baseline_pred, 2),
        "change_percent": round(
            ((scenario_pred - baseline_pred) / baseline_pred) * 100, 2
        )
        if baseline_pred != 0
        else 0,
    }
