"""AEGISAI backend API backed by a local SQLite database."""

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request, session
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)

app.config.update(
    SECRET_KEY=os.environ.get("AEGISAI_SECRET_KEY", "dev-secret-change-before-deployment"),
    SESSION_TYPE="filesystem",
    SESSION_PERMANENT=False,
    SESSION_USE_SIGNER=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)

Session(app)

DATABASE_PATH = Path(__file__).with_name("aegisai.db")
DATABASE_PATH = Path(__file__).with_name("aegisai.db")

SAMPLE_TRANSACTIONS = [
    ("TXN003", "CUS001", "₹80,000", "29 Oct 2026", "10:30 AM", "UPI", 92, "Pending"),
    ("TXN005", "CUS002", "₹65,000", "29 Oct 2026", "11:15 AM", "Card", 87, "Pending"),
    ("TXN012", "CUS003", "₹1,20,000", "29 Oct 2026", "12:45 PM", "Net Banking", 96, "Investigating"),
    ("TXN018", "CUS004", "₹95,000", "29 Oct 2026", "02:20 PM", "UPI", 89, "Reviewing"),
    ("TXN021", "CUS005", "₹2,450", "29 Oct 2026", "03:10 PM", "Card", 12, "Completed"),
]

ALLOWED_METHODS = {"UPI", "Card", "Net Banking"}
ALLOWED_STATUSES = {"Pending", "Investigating", "Reviewing", "Completed"}


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def format_rupees(amount):
    """Format a whole rupee amount with Indian digit grouping."""
    digits = str(amount)

    if len(digits) <= 3:
        return f"₹{digits}"

    last_three = digits[-3:]
    leading_digits = digits[:-3]
    groups = []

    while leading_digits:
        groups.insert(0, leading_digits[-2:])
        leading_digits = leading_digits[:-2]

    return f"₹{','.join(groups + [last_three])}"


def initialize_database():
    """Create database tables and seed sample transactions once."""

    connection = get_connection()

    try:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                customer TEXT NOT NULL,
                amount TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                method TEXT NOT NULL,
                risk INTEGER NOT NULL,
                status TEXT NOT NULL
            )
            """
        )

        # Store actual machine learning prediction results.
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_predictions (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                prediction TEXT NOT NULL,
                is_fraud INTEGER NOT NULL,
                fraud_probability REAL NOT NULL,
                risk_score REAL NOT NULL,
                risk_level TEXT NOT NULL,
                threshold REAL NOT NULL,
                transaction_features TEXT NOT NULL
            )
            """
        )

        existing_count = connection.execute(
            "SELECT COUNT(*) FROM transactions"
        ).fetchone()[0]

        if existing_count == 0:
            connection.executemany(
                """
                INSERT INTO transactions
                    (id, customer, amount, date, time, method, risk, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                SAMPLE_TRANSACTIONS,
            )

        connection.commit()

    finally:
        connection.close()

@app.post("/api/admin/login")

def admin_login():
    payload = request.get_json(silent=True) or {}

    email = os.environ.get("AEGISAI_ADMIN_EMAIL", "admin@aegisai.com")
    password_hash = os.environ.get("AEGISAI_ADMIN_PASSWORD_HASH")

    entered_email = payload.get("email", "")
    entered_password = payload.get("password", "")

    print("LOGIN DEBUG:")
    print("LOGIN DEBUG:")
    print("Email matches:", entered_email.strip().lower() == email.lower())
    print("Hash configured:", bool(password_hash))
    print("Password matches:", bool(password_hash) and check_password_hash(password_hash, entered_password))

    if not password_hash:
        return jsonify({"error": "Admin credentials are not configured."}), 500

    if (
        not isinstance(entered_email, str)
        or not isinstance(entered_password, str)
        or entered_email.strip().lower() != email.lower()
        or not check_password_hash(password_hash, entered_password)
    ):
        return jsonify({"error": "Invalid email or password."}), 401

    session.clear()
    session["admin_logged_in"] = True
    session["admin_email"] = email

    return jsonify({"message": "Login successful", "email": email}), 200

    if not isinstance(payload, dict):
        return jsonify({"error": "Invalid login details."}), 400

    email = os.environ.get("AEGISAI_ADMIN_EMAIL", "admin@aegisai.com")
    password_hash = os.environ.get("AEGISAI_ADMIN_PASSWORD_HASH")
    print("LOGIN EMAIL:", repr(email))
    print("HASH EXISTS:", bool(password_hash))
    print("ENTERED EMAIL:", repr(payload.get("email")))
    print("PASSWORD MATCH:", check_password_hash(password_hash, payload.get("password", "")) if password_hash else False)

    if not password_hash:
        return jsonify({"error": "Admin credentials are not configured."}), 500

    entered_email = payload.get("email", "")
    entered_password = payload.get("password", "")

    if not isinstance(entered_email, str) or not isinstance(entered_password, str):
        return jsonify({"error": "Invalid login details."}), 400

    if (
        entered_email.strip().lower() != email.lower()
        or not check_password_hash(password_hash, entered_password)
    ):
        return jsonify({"error": "Invalid email or password."}), 401

    session.clear()
    session["admin_logged_in"] = True
    session["admin_email"] = email

    return jsonify({"message": "Login successful", "email": email}), 200


@app.get("/api/admin/me")
def admin_me():
    if not session.get("admin_logged_in"):
        return jsonify({"error": "Not logged in"}), 401

    return jsonify({
        "logged_in": True,
        "email": session.get("admin_email")
    }), 200


@app.post("/api/admin/logout")
def admin_logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200


@app.get("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "service": "aegisai-backend"
    }), 200


@app.get("/api/transactions")
def get_transactions():
    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT id, customer, amount, date, time, method, risk, status
            FROM transactions
            ORDER BY rowid
            """
        ).fetchall()

        return jsonify([dict(row) for row in rows]), 200

    finally:
        connection.close()


@app.get("/api/alerts")
def get_high_risk_alerts():
    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT id, customer, amount, date, time, method, risk, status
            FROM transactions
            WHERE risk >= 70
            ORDER BY risk DESC, rowid
            """
        ).fetchall()

        return jsonify([dict(row) for row in rows]), 200

    finally:
        connection.close()


@app.post("/api/transactions")
def create_transaction():
    """Create an illustrative dashboard transaction."""

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({"error": "Send transaction details as JSON."}), 400

    customer = payload.get("customer")
    method = payload.get("method")
    amount = payload.get("amount")
    risk = payload.get("risk")

    if not isinstance(customer, str) or not customer.strip() or len(customer.strip()) > 40:
        return jsonify({"error": "Enter a valid customer ID."}), 400

    if method not in ALLOWED_METHODS:
        return jsonify({"error": "Choose UPI, Card, or Net Banking."}), 400

    if isinstance(amount, bool) or not isinstance(amount, int) or amount <= 0:
        return jsonify({"error": "Amount must be a positive whole number."}), 400

    if isinstance(risk, bool) or not isinstance(risk, int) or not 0 <= risk <= 100:
        return jsonify({"error": "Risk score must be between 0 and 100."}), 400

    now = datetime.now()

    transaction = (
        f"TXN-{uuid4().hex[:8].upper()}",
        customer.strip(),
        format_rupees(amount),
        now.strftime("%d %b %Y"),
        now.strftime("%I:%M %p").lstrip("0"),
        method,
        risk,
        "Pending",
    )

    connection = get_connection()

    try:
        connection.execute(
            """
            INSERT INTO transactions
                (id, customer, amount, date, time, method, risk, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            transaction,
        )

        connection.commit()

    finally:
        connection.close()

    return jsonify(dict(zip(
        ("id", "customer", "amount", "date", "time", "method", "risk", "status"),
        transaction,
    ))), 201


@app.patch("/api/transactions/<transaction_id>")
def update_transaction_status(transaction_id):
    """Update the workflow status of an existing transaction."""

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({"error": "Send a status value as JSON."}), 400

    status = payload.get("status")

    if status not in ALLOWED_STATUSES:
        return jsonify({"error": "Invalid transaction status."}), 400

    connection = get_connection()

    try:
        existing = connection.execute(
            "SELECT id FROM transactions WHERE id = ?",
            (transaction_id,),
        ).fetchone()

        if existing is None:
            return jsonify({"error": "Transaction not found."}), 404

        connection.execute(
            "UPDATE transactions SET status = ? WHERE id = ?",
            (status, transaction_id),
        )

        connection.commit()

        updated = connection.execute(
            """
            SELECT id, customer, amount, date, time, method, risk, status
            FROM transactions
            WHERE id = ?
            """,
            (transaction_id,),
        ).fetchone()

        return jsonify(dict(updated)), 200

    finally:
        connection.close()


@app.post("/api/ai-predictions")
def save_ai_prediction():
    """Save a prediction returned by the FastAPI ML service."""

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({"error": "Send prediction details as JSON."}), 400

    prediction = payload.get("prediction")
    is_fraud = payload.get("is_fraud")
    probability = payload.get("fraud_probability")
    risk_score = payload.get("risk_score")
    risk_level = payload.get("risk_level")
    threshold = payload.get("threshold")
    features = payload.get("transaction_features")

    if prediction not in {"FRAUD", "LEGITIMATE"}:
        return jsonify({"error": "Invalid prediction."}), 400

    if not isinstance(is_fraud, bool):
        return jsonify({"error": "is_fraud must be true or false."}), 400

    if is_fraud != (prediction == "FRAUD"):
        return jsonify({"error": "Prediction and fraud flag do not match."}), 400

    numeric_values = (probability, risk_score, threshold)

    if any(
        isinstance(value, bool) or not isinstance(value, (int, float))
        for value in numeric_values
    ):
        return jsonify({"error": "Invalid numeric prediction values."}), 400

    if not (
        0 <= probability <= 1
        and 0 <= risk_score <= 100
        and 0 <= threshold <= 1
    ):
        return jsonify({"error": "Prediction values are out of range."}), 400

    if risk_level not in {"HIGH", "LOW"}:
        return jsonify({"error": "Invalid risk level."}), 400

    if not isinstance(features, dict):
        return jsonify({"error": "Transaction features must be a JSON object."}), 400

    prediction_id = f"AI-{uuid4().hex[:10].upper()}"
    created_at = datetime.now().isoformat(timespec="seconds")

    connection = get_connection()

    try:
        connection.execute(
            """
            INSERT INTO ai_predictions (
                id, created_at, prediction, is_fraud,
                fraud_probability, risk_score, risk_level,
                threshold, transaction_features
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                prediction_id,
                created_at,
                prediction,
                int(is_fraud),
                probability,
                risk_score,
                risk_level,
                threshold,
                json.dumps(features),
            ),
        )

        connection.commit()

    finally:
        connection.close()

    return jsonify({
        "message": "AI prediction saved successfully.",
        "id": prediction_id,
        "created_at": created_at,
        "prediction": prediction,
        "fraud_probability": probability,
        "risk_score": risk_score,
        "risk_level": risk_level,
    }), 201


@app.get("/api/ai-predictions")
def get_ai_predictions():
    """Return saved AI prediction history."""

    connection = get_connection()

    try:
        rows = connection.execute(
            """
            SELECT id, created_at, prediction, is_fraud,
                   fraud_probability, risk_score, risk_level,
                   threshold, transaction_features
            FROM ai_predictions
            ORDER BY created_at DESC
            """
        ).fetchall()

        results = []

        for row in rows:
            item = dict(row)
            item["is_fraud"] = bool(item["is_fraud"])
            item["transaction_features"] = json.loads(
                item["transaction_features"]
            )
            results.append(item)

        return jsonify(results), 200

    finally:
        connection.close()


initialize_database()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)