
import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score
)

# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "creditcard.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# Load dataset
print("Loading transaction dataset...")
df = pd.read_csv(DATASET_PATH)

print("Dataset shape:", df.shape)

# Separate features and target
X = df.drop("Class", axis=1)
y = df["Class"]

# Split dataset while preserving fraud distribution
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Create ML pipeline
model = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(
        class_weight="balanced",
        max_iter=1000,
        random_state=42
    ))
])

# Train model
print("\nTraining fraud detection model...")
model.fit(X_train, y_train)

# Evaluate model
print("\nEvaluating model...")
predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, 1]

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))

print("\nClassification Report:")
print(classification_report(
    y_test,
    predictions,
    target_names=["Legitimate", "Fraud"]
))

print("ROC-AUC Score:", roc_auc_score(y_test, probabilities))

# Save trained model
model_path = os.path.join(MODEL_DIR, "fraud_detection_model.pkl")
joblib.dump(model, model_path)

print("\nModel saved successfully!")
print("Saved at:", model_path)
