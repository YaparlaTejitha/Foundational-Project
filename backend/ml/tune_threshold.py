import os
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    fbeta_score,
    roc_auc_score,
    confusion_matrix
)

# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_PATH = os.path.join(
    BASE_DIR, "dataset", "creditcard.csv"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

X = df.drop("Class", axis=1)
y = df["Class"]

# Split into training/validation and final testing
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Split training and validation
X_train, X_val, y_train, y_val = train_test_split(
    X_train_val,
    y_train_val,
    test_size=0.25,
    random_state=42,
    stratify=y_train_val
)

print("Training samples:", len(X_train))
print("Validation samples:", len(X_val))
print("Testing samples:", len(X_test))

# Train Random Forest
print("\nTraining Random Forest...")

model = RandomForestClassifier(
    n_estimators=150,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Validation probabilities
print("\nTuning prediction threshold...")

val_probabilities = model.predict_proba(X_val)[:, 1]

best_threshold = 0.5
best_f2 = 0

for threshold in np.arange(0.05, 0.96, 0.01):

    predictions = (
        val_probabilities >= threshold
    ).astype(int)

    f2 = fbeta_score(
        y_val,
        predictions,
        beta=2,
        zero_division=0
    )

    if f2 > best_f2:
        best_f2 = f2
        best_threshold = threshold

print("\nBest threshold:", round(best_threshold, 2))
print("Validation F2 Score:", round(best_f2, 4))

# Evaluate once on untouched test data
print("\nFinal test evaluation...")

test_probabilities = model.predict_proba(X_test)[:, 1]

test_predictions = (
    test_probabilities >= best_threshold
).astype(int)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, test_predictions))

print(
    "\nPrecision:",
    round(precision_score(y_test, test_predictions), 4)
)

print(
    "Recall:",
    round(recall_score(y_test, test_predictions), 4)
)

print(
    "F1 Score:",
    round(f1_score(y_test, test_predictions), 4)
)

print(
    "F2 Score:",
    round(fbeta_score(y_test, test_predictions, beta=2), 4)
)

print(
    "ROC-AUC:",
    round(roc_auc_score(y_test, test_probabilities), 4)
)

# Save final model
model_path = os.path.join(
    MODEL_DIR,
    "fraud_detection_model.pkl"
)

joblib.dump(model, model_path)

# Save threshold
threshold_path = os.path.join(
    MODEL_DIR,
    "model_config.json"
)

with open(threshold_path, "w") as file:
    json.dump(
        {"threshold": float(best_threshold)},
        file,
        indent=4
    )

print("\nModel saved successfully!")
print("Model:", model_path)
print("Configuration:", threshold_path)