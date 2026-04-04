"""PredictFlow — FastAPI Backend for ML Pipeline"""

import os
import uuid
import json
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.data_analyzer import analyze_csv, load_csv
from app.trainer import train_model, get_job_status
from app.predictor import generate_forecast, run_scenario

app = FastAPI(
    title="PredictFlow API",
    description="AI-Powered Predictive Analytics Pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores (production would use Supabase)
datasets: dict = {}
models: dict = {}
jobs: dict = {}

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


class TrainRequest(BaseModel):
    target_column: str
    feature_columns: list[str]
    model_type: str  # time_series | classification | regression
    date_column: Optional[str] = None
    forecast_periods: int = 90


class ScenarioRequest(BaseModel):
    feature_values: dict[str, float]


class ForecastRequest(BaseModel):
    periods: int = 90


@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/datasets/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload CSV, auto-analyze columns, return schema."""
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    dataset_id = str(uuid.uuid4())[:8]
    file_path = os.path.join(UPLOAD_DIR, f"{dataset_id}_{file.filename}")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    try:
        analysis = analyze_csv(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Failed to analyze CSV: {str(e)}")

    dataset = {
        "id": dataset_id,
        "filename": file.filename,
        "file_path": file_path,
        "rows": analysis["rows"],
        "columns": analysis["columns"],
        "preview": analysis["preview"],
        "uploaded_at": datetime.utcnow().isoformat(),
    }
    datasets[dataset_id] = dataset

    return dataset


@app.post("/api/datasets/{dataset_id}/train")
async def start_training(
    dataset_id: str, request: TrainRequest, background_tasks: BackgroundTasks
):
    """Start model training (returns job ID)."""
    if dataset_id not in datasets:
        raise HTTPException(status_code=404, detail="Dataset not found")

    dataset = datasets[dataset_id]
    job_id = str(uuid.uuid4())[:8]

    job = {
        "id": job_id,
        "dataset_id": dataset_id,
        "status": "pending",
        "progress": 0,
        "error_message": None,
        "model_id": None,
        "started_at": datetime.utcnow().isoformat(),
        "completed_at": None,
    }
    jobs[job_id] = job

    background_tasks.add_task(
        train_model,
        job_id=job_id,
        file_path=dataset["file_path"],
        target_column=request.target_column,
        feature_columns=request.feature_columns,
        model_type=request.model_type,
        date_column=request.date_column,
        forecast_periods=request.forecast_periods,
        jobs_store=jobs,
        models_store=models,
    )

    return job


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    """Get training progress + results."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]


@app.get("/api/models/{model_id}/metrics")
def get_model_metrics(model_id: str):
    """Get model performance metrics."""
    if model_id not in models:
        raise HTTPException(status_code=404, detail="Model not found")
    model = models[model_id]
    return {
        "model_id": model_id,
        "model_type": model["model_type"],
        "metrics": model["metrics"],
        "feature_importance": model["feature_importance"],
        "target_column": model["target_column"],
        "trained_at": model["trained_at"],
    }


@app.post("/api/forecasts/{model_id}/predict")
def predict(model_id: str, request: ForecastRequest):
    """Generate forecast for next N periods."""
    if model_id not in models:
        raise HTTPException(status_code=404, detail="Model not found")
    model = models[model_id]
    forecast = generate_forecast(model, request.periods)
    return {"model_id": model_id, "periods": request.periods, "forecast": forecast}


@app.post("/api/forecasts/{model_id}/scenario")
def scenario(model_id: str, request: ScenarioRequest):
    """Scenario modeling (what-if predictions)."""
    if model_id not in models:
        raise HTTPException(status_code=404, detail="Model not found")
    model = models[model_id]
    result = run_scenario(model, request.feature_values)
    return {"model_id": model_id, "scenario": result}
