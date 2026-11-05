import os
import json
import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# --------------------------------
# PROJECT PATHS
# --------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR, "models", "fraud_detection_model.pkl"
)

CONFIG_PATH = os.path.join(
    BASE_DIR, "models", "model_config.json"
)


# --------------------------------
# LOAD ML MODEL
# --------------------------------

model = joblib.load(MODEL_PATH)

with open(CONFIG_PATH, "r") as file:
    config = json.load(file)

THRESHOLD = config["threshold"]

FEATURE_NAMES = list(model.feature_names_in_)


# --------------------------------
# FASTAPI APPLICATION
# --------------------------------

app = FastAPI(
    title="AEGISAI",
    description="AI-Powered Fraud Detection and Risk Platform",
    version="1.0.0"
)


# --------------------------------
# CORS CONFIGURATION
# --------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------
# TRANSACTION INPUT SCHEMA
# --------------------------------

class TransactionFeatures(BaseModel):

    Time: float = Field(..., ge=0)
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float = Field(..., ge=0)


# --------------------------------
# HOME ROUTE
# --------------------------------

@app.get("/")
def home():

    return {
        "message": "Welcome to AEGISAI",
        "status": "Backend running successfully"
    }


# --------------------------------
# HEALTH CHECK
# --------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "application": "AEGISAI",
        "model": "Random Forest",
        "threshold": THRESHOLD
    }


# --------------------------------
# FRAUD PREDICTION API
# --------------------------------

@app.post("/api/predict")
def predict_fraud(transaction: TransactionFeatures):

    transaction_data = transaction.model_dump()

    input_data = pd.DataFrame(
        [[transaction_data[name] for name in FEATURE_NAMES]],
        columns=FEATURE_NAMES
    )

    fraud_probability = float(
        model.predict_proba(input_data)[0][1]
    )

    prediction = (
        fraud_probability >= THRESHOLD
    )

    risk_score = round(fraud_probability * 100, 2)

    return {
        "prediction": "FRAUD" if prediction else "LEGITIMATE",
        "is_fraud": bool(prediction),
        "fraud_probability": round(fraud_probability, 4),
        "risk_score": risk_score,
        "risk_level": "HIGH" if prediction else "LOW",
        "threshold": THRESHOLD
    }