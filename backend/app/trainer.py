"""ML model training pipeline."""

import os
import time
import uuid
import json
from datetime import datetime
from typing import Optional

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    f1_score,
    roc_auc_score,
    accuracy_score,
    precision_score,
    recall_score,
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def update_job(jobs_store: dict, job_id: str, **kwargs):
    """Update job status."""
    if job_id in jobs_store:
        jobs_store[job_id].update(kwargs)


def train_model(
    job_id: str,
    file_path: str,
    target_column: str,
    feature_columns: list[str],
    model_type: str,
    date_column: Optional[str],
    forecast_periods: int,
    jobs_store: dict,
    models_store: dict,
):
    """Train an ML model based on the specified type."""
    try:
        # Stage 1: Preprocessing
        update_job(jobs_store, job_id, status="preprocessing", progress=10)
        df = pd.read_csv(file_path)
        time.sleep(0.5)  # Simulate processing time

        # Handle missing values
        numeric_cols = df[feature_columns].select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

        categorical_cols = df[feature_columns].select_dtypes(include=["object"]).columns
        label_encoders = {}
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].fillna("unknown"))
            label_encoders[col] = le

        update_job(jobs_store, job_id, status="preprocessing", progress=25)
        time.sleep(0.5)

        # Stage 2: Training
        update_job(jobs_store, job_id, status="training", progress=40)

        if model_type == "time_series":
            model_obj, metrics, importances = train_time_series(
                df, target_column, feature_columns, date_column, forecast_periods
            )
        elif model_type == "classification":
            model_obj, metrics, importances = train_classification(
                df, target_column, feature_columns
            )
        else:
            model_obj, metrics, importances = train_regression(
                df, target_column, feature_columns
            )

        update_job(jobs_store, job_id, status="training", progress=70)
        time.sleep(0.5)

        # Stage 3: Evaluation
        update_job(jobs_store, job_id, status="evaluating", progress=85)
        time.sleep(0.5)

        # Save model
        model_id = str(uuid.uuid4())[:8]
        model_path = os.path.join(MODEL_DIR, f"{model_id}.joblib")
        joblib.dump(model_obj, model_path)

        model_record = {
            "id": model_id,
            "dataset_id": jobs_store[job_id]["dataset_id"],
            "model_type": model_type,
            "model_path": model_path,
            "metrics": metrics,
            "feature_importance": importances,
            "target_column": target_column,
            "feature_columns": feature_columns,
            "date_column": date_column,
            "forecast_periods": forecast_periods,
            "trained_at": datetime.utcnow().isoformat(),
        }
        models_store[model_id] = model_record

        update_job(
            jobs_store,
            job_id,
            status="completed",
            progress=100,
            model_id=model_id,
            completed_at=datetime.utcnow().isoformat(),
        )

    except Exception as e:
        update_job(
            jobs_store,
            job_id,
            status="failed",
            error_message=str(e),
            completed_at=datetime.utcnow().isoformat(),
        )


def train_time_series(
    df: pd.DataFrame,
    target_column: str,
    feature_columns: list[str],
    date_column: Optional[str],
    forecast_periods: int,
) -> tuple:
    """Train a time series model using gradient boosting as fallback."""
    from sklearn.ensemble import GradientBoostingRegressor

    X = df[feature_columns].select_dtypes(include=[np.number])
    y = df[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    model = GradientBoostingRegressor(
        n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
        "r2": round(float(r2_score(y_test, y_pred)), 4),
    }

    importances = [
        {"feature": f, "importance": round(float(imp), 4)}
        for f, imp in sorted(
            zip(X.columns, model.feature_importances_), key=lambda x: -x[1]
        )
    ]

    return model, metrics, importances


def train_classification(
    df: pd.DataFrame, target_column: str, feature_columns: list[str]
) -> tuple:
    """Train a classification model using XGBoost."""
    try:
        from xgboost import XGBClassifier

        X = df[feature_columns].select_dtypes(include=[np.number])
        y = df[target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        model = XGBClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.1,
            random_state=42,
            eval_metric="logloss",
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]

        metrics = {
            "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
            "f1": round(float(f1_score(y_test, y_pred, average="weighted")), 4),
            "auc": round(float(roc_auc_score(y_test, y_proba)), 4),
            "precision": round(
                float(precision_score(y_test, y_pred, average="weighted")), 4
            ),
            "recall": round(
                float(recall_score(y_test, y_pred, average="weighted")), 4
            ),
        }

        importances = [
            {"feature": f, "importance": round(float(imp), 4)}
            for f, imp in sorted(
                zip(X.columns, model.feature_importances_), key=lambda x: -x[1]
            )
        ]

        return model, metrics, importances

    except ImportError:
        # Fallback to sklearn if xgboost not available
        from sklearn.ensemble import GradientBoostingClassifier

        X = df[feature_columns].select_dtypes(include=[np.number])
        y = df[target_column]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        model = GradientBoostingClassifier(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = {
            "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
            "f1": round(float(f1_score(y_test, y_pred, average="weighted")), 4),
        }
        importances = [
            {"feature": f, "importance": round(float(imp), 4)}
            for f, imp in sorted(
                zip(X.columns, model.feature_importances_), key=lambda x: -x[1]
            )
        ]
        return model, metrics, importances


def train_regression(
    df: pd.DataFrame, target_column: str, feature_columns: list[str]
) -> tuple:
    """Train a regression model using LightGBM."""
    try:
        import lightgbm as lgb

        X = df[feature_columns].select_dtypes(include=[np.number])
        y = df[target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = lgb.LGBMRegressor(
            n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42, verbose=-1
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        metrics = {
            "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
            "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
            "r2": round(float(r2_score(y_test, y_pred)), 4),
        }

        importances = [
            {"feature": f, "importance": round(float(imp), 4)}
            for f, imp in sorted(
                zip(X.columns, model.feature_importances_), key=lambda x: -x[1]
            )
        ]

        return model, metrics, importances

    except ImportError:
        from sklearn.ensemble import GradientBoostingRegressor

        X = df[feature_columns].select_dtypes(include=[np.number])
        y = df[target_column]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        model = GradientBoostingRegressor(n_estimators=200, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = {
            "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
            "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
            "r2": round(float(r2_score(y_test, y_pred)), 4),
        }
        importances = [
            {"feature": f, "importance": round(float(imp), 4)}
            for f, imp in sorted(
                zip(X.columns, model.feature_importances_), key=lambda x: -x[1]
            )
        ]
        return model, metrics, importances
