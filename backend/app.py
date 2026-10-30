"""Minimal AegisAI backend API backed by a local SQLite database."""

import sqlite3
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request

app = Flask(__name__)
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
    """Create the transactions table and seed it once with sample rows."""
    connection = sqlite3.connect(DATABASE_PATH)
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


@app.get("/api/health")
def health_check():
    """Report that the backend process is responding."""
    return jsonify({"status": "ok", "service": "aegisai-backend"}), 200


@app.get("/api/transactions")
def get_transactions():
    """Return transaction rows stored in the local database."""
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
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
    """Return transactions with risk scores of 70 or higher for review."""
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
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
    """Validate and save a new illustrative transaction."""
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Send transaction details as JSON."}), 400

    customer = payload.get("customer")
    method = payload.get("method")
    amount = payload.get("amount")
    risk = payload.get("risk")

    if not isinstance(customer, str) or not customer.strip() or len(customer.strip()) > 40:
        return jsonify({"error": "Enter a customer ID of up to 40 characters."}), 400
    if method not in ALLOWED_METHODS:
        return jsonify({"error": "Choose UPI, Card, or Net Banking."}), 400
    if isinstance(amount, bool) or not isinstance(amount, int) or amount <= 0:
        return jsonify({"error": "Amount must be a positive whole number of rupees."}), 400
    if isinstance(risk, bool) or not isinstance(risk, int) or not 0 <= risk <= 100:
        return jsonify({"error": "Risk score must be a whole number from 0 to 100."}), 400

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

    connection = sqlite3.connect(DATABASE_PATH)
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
    except sqlite3.IntegrityError:
        return jsonify({"error": "Could not create a unique transaction ID. Try again."}), 409
    finally:
        connection.close()

    transaction_data = dict(zip(
        ("id", "customer", "amount", "date", "time", "method", "risk", "status"),
        transaction,
    ))
    return jsonify(transaction_data), 201

@app.patch("/api/transactions/<transaction_id>")
def update_transaction_status(transaction_id):
    """Update the workflow status for an existing transaction."""
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Send a status value as JSON."}), 400

    status = payload.get("status")
    if status not in ALLOWED_STATUSES:
        return jsonify({"error": "Choose Pending, Investigating, Reviewing, or Completed."}), 400

    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
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
            FROM transactions WHERE id = ?
            """,
            (transaction_id,),
        ).fetchone()
        return jsonify(dict(updated)), 200
    finally:
        connection.close()

initialize_database()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
