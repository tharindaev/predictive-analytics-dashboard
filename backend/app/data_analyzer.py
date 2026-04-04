"""CSV data analysis and column type detection."""

import pandas as pd
import numpy as np
from typing import Any


def analyze_csv(file_path: str) -> dict[str, Any]:
    """Analyze a CSV file and return column schema + preview."""
    df = pd.read_csv(file_path)

    columns = []
    for col in df.columns:
        col_info = detect_column_type(df[col], col)
        columns.append(col_info)

    preview = df.head(10).fillna("").to_dict(orient="records")

    return {
        "rows": len(df),
        "columns": columns,
        "preview": preview,
    }


def detect_column_type(series: pd.Series, name: str) -> dict[str, Any]:
    """Auto-detect column data type and compute statistics."""
    dtype = "text"
    stats: dict[str, Any] = {}

    # Try datetime
    if series.dtype == "object":
        try:
            parsed = pd.to_datetime(series, infer_datetime_format=True)
            if parsed.notna().sum() > len(series) * 0.8:
                dtype = "datetime"
        except (ValueError, TypeError):
            pass

    # Numeric check
    if dtype == "text":
        if pd.api.types.is_numeric_dtype(series):
            dtype = "numeric"
            clean = series.dropna()
            stats = {
                "min": float(clean.min()),
                "max": float(clean.max()),
                "mean": round(float(clean.mean()), 2),
                "std": round(float(clean.std()), 2) if len(clean) > 1 else 0.0,
            }
        elif series.nunique() < 20 and series.dtype == "object":
            dtype = "categorical"

    sample_values = [str(v) for v in series.dropna().head(3).tolist()]

    result = {
        "name": name,
        "dtype": dtype,
        "unique_count": int(series.nunique()),
        "null_count": int(series.isna().sum()),
        "sample_values": sample_values,
    }
    result.update(stats)
    return result


def load_csv(file_path: str) -> pd.DataFrame:
    """Load CSV into DataFrame with basic preprocessing."""
    df = pd.read_csv(file_path)

    # Auto-parse date columns
    for col in df.columns:
        if df[col].dtype == "object":
            try:
                df[col] = pd.to_datetime(df[col], infer_datetime_format=True)
            except (ValueError, TypeError):
                pass

    return df
