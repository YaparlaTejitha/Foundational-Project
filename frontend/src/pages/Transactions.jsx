import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingIds, setUpdatingIds] = useState(() => new Set());
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError("");

    async function loadTransactions() {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const data = await response.json();
        if (isCurrent) {
          setTransactions(data);
        }
      } catch {
        if (isCurrent) {
          setError("Could not load transactions. Check that the backend is running.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadTransactions();
    return () => {
      isCurrent = false;
    };
  }, [refreshKey]);

  async function handleAddTransaction(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const transaction = {
      customer: values.get("customer").trim(),
      amount: Number(values.get("amount")),
      method: values.get("method"),
      risk: Number(values.get("risk")),
    };

    setSaving(true);
    setFormError("");
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not save the transaction.");
      }

      form.reset();
      setShowForm(false);
      setRefreshKey((key) => key + 1);
    } catch (submitError) {
      setFormError(submitError.message || "Could not save the transaction.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(transactionId, status) {
    setStatusError("");
    setUpdatingIds((current) => new Set(current).add(transactionId));
    try {
      const response = await fetch(`/api/transactions/${encodeURIComponent(transactionId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not update the transaction status.");
      }
      setTransactions((current) => current.map((transaction) => (
        transaction.id === transactionId ? result : transaction
      )));
    } catch (updateError) {
      setStatusError(updateError.message || "Could not update the transaction status.");
    } finally {
      setUpdatingIds((current) => {
        const next = new Set(current);
        next.delete(transactionId);
        return next;
      });
    }
  }
  const completedCount = transactions.filter((transaction) => transaction.status === "Completed").length;
  const reviewStatuses = new Set(["Pending", "Investigating", "Reviewing"]);
  const underReviewCount = transactions.filter((transaction) => reviewStatuses.has(transaction.status)).length;
  const flaggedCount = transactions.filter((transaction) => Number(transaction.risk) >= 70).length;
  const displayCount = (count) => (loading || error ? "—" : count.toLocaleString());

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>View and monitor all customer transactions.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <h2>{displayCount(transactions.length)}</h2>
          <p>Transactions returned by the backend</p>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <h2>{displayCount(completedCount)}</h2>
          <p className="green-text">Status marked completed</p>
        </div>

        <div className="summary-card">
          <h3>Under Review</h3>
          <h2>{displayCount(underReviewCount)}</h2>
          <p>Pending or in progress</p>
        </div>

        <div className="summary-card">
          <h3>Flagged</h3>
          <h2>{displayCount(flaggedCount)}</h2>
          <p>Risk score 70 or higher</p>
        </div>
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>All Transactions</h2>
            <p>Transaction details and processing status</p>
          </div>
          <button type="button" onClick={() => { setShowForm((isOpen) => !isOpen); setFormError(""); }}>
            {showForm ? "Cancel" : "Add Transaction"}
          </button>
        </div>

        {showForm && (
          <form className="transaction-entry-form" onSubmit={handleAddTransaction}>
            <label>
              Customer ID
              <input name="customer" type="text" placeholder="CUS006" maxLength="40" required />
            </label>
            <label>
              Amount (₹)
              <input name="amount" type="number" min="1" step="1" placeholder="1000" required />
            </label>
            <label>
              Payment method
              <select name="method" defaultValue="UPI" required>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </label>
            <label>
              Risk score (0–100)
              <input name="risk" type="number" min="0" max="100" step="1" defaultValue="50" required />
            </label>
            <div className="transaction-form-actions">
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Transaction"}</button>
            </div>
            {formError && <p className="transaction-form-error" role="alert">{formError}</p>}
            <p className="transaction-form-note">The backend creates the transaction ID, date, and Pending status.</p>
          </form>
        )}

        {statusError && <p className="transaction-status-error" role="alert">{statusError}</p>}
        <div className="transactions-table">
          <div className="transactions-table-header">
            <span>Transaction ID</span>
            <span>Customer ID</span>
            <span>Amount</span>
            <span>Date &amp; Time</span>
            <span>Method</span>
            <span>Risk Score</span>
            <span>Status</span>
          </div>

          {loading && (
            <div className="transactions-table-row">
              <span>Loading transactions...</span><span /><span /><span /><span /><span /><span />
            </div>
          )}

          {!loading && error && (
            <div className="transactions-table-row">
              <span>{error}</span><span /><span /><span /><span /><span /><span />
            </div>
          )}

          {!loading && !error && transactions.map((transaction) => (
            <div className="transactions-table-row" key={transaction.id}>
              <span>{transaction.id}</span>
              <span>{transaction.customer}</span>
              <span>{transaction.amount}</span>
              <span>{transaction.date}, {transaction.time}</span>
              <span>{transaction.method}</span>
              <span>{transaction.risk}</span>
              <span>
                <select
                  className="transaction-status-select"
                  aria-label={`Status for ${transaction.id}`}
                  value={transaction.status}
                  disabled={updatingIds.has(transaction.id)}
                  onChange={(event) => handleStatusChange(transaction.id, event.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Completed">Completed</option>
                </select>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
