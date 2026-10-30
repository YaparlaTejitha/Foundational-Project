import { useEffect, useState } from "react";

const WORKFLOW_STATUSES = ["Pending", "Investigating", "Reviewing", "Completed"];

function Investigation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updatingIds, setUpdatingIds] = useState(() => new Set());

  useEffect(() => {
    let isCurrent = true;

    async function loadReviewItems() {
      try {
        const response = await fetch("/api/alerts");
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data = await response.json();
        if (isCurrent) {
          setItems(data);
        }
      } catch {
        if (isCurrent) {
          setError("Could not load the review queue. Check that the backend is running.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadReviewItems();
    return () => {
      isCurrent = false;
    };
  }, []);

  async function updateStatus(transactionId, status) {
    setStatusError("");
    setUpdatingIds((current) => new Set(current).add(transactionId));
    try {
      const response = await fetch(`/api/transactions/${encodeURIComponent(transactionId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await response.json();
      if (!response.ok) {
        throw new Error(updated.error || "Could not update the transaction status.");
      }
      setItems((current) => current.map((item) => item.id === transactionId ? updated : item));
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

  const countByStatus = (status) => items.filter((item) => item.status === status).length;
  const displayCount = (count) => (loading || error ? "—" : count.toLocaleString());

  return (
    <div className="dashboard-page investigation-page">
      <div className="page-header">
        <div>
          <h1>Investigation</h1>
          <p>Review transactions scoring 70 or higher. A high score is a review flag, not proof of fraud.</p>
        </div>
      </div>

      <div className="summary-cards investigation-summary">
        <div className="summary-card">
          <p>High-Risk Items</p>
          <h2>{displayCount(items.length)}</h2>
          <span>In the review queue</span>
        </div>
        <div className="summary-card">
          <p>Pending</p>
          <h2>{displayCount(countByStatus("Pending"))}</h2>
          <span>Awaiting review</span>
        </div>
        <div className="summary-card">
          <p>Investigating</p>
          <h2>{displayCount(countByStatus("Investigating"))}</h2>
          <span>Currently being reviewed</span>
        </div>
        <div className="summary-card">
          <p>Reviewing</p>
          <h2>{displayCount(countByStatus("Reviewing"))}</h2>
          <span>Further checks in progress</span>
        </div>
      </div>

      <div className="dashboard-box investigation-box">
        <div className="box-header">
          <div>
            <h2>High-Risk Review Queue</h2>
            <p>Workflow status changes are saved to the transaction database.</p>
          </div>
          <span className="investigation-count">{displayCount(items.length)} Items</span>
        </div>

        {statusError && <p className="transaction-status-error" role="alert">{statusError}</p>}

        <div className="investigation-table-wrapper">
          <table className="investigation-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer ID</th>
                <th>Amount</th>
                <th>Risk Score</th>
                <th>Method</th>
                <th>Workflow Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="6">Loading review queue...</td></tr>}
              {!loading && error && <tr><td colSpan="6">{error}</td></tr>}
              {!loading && !error && items.length === 0 && <tr><td colSpan="6">No transactions meet the review threshold.</td></tr>}
              {!loading && !error && items.map((item) => (
                <tr key={item.id}>
                  <td className="investigation-id">{item.id}</td>
                  <td>{item.customer}</td>
                  <td className="investigation-amount">{item.amount}</td>
                  <td><span className="investigation-risk risk-high">{item.risk}/100</span></td>
                  <td>{item.method}</td>
                  <td>
                    <select
                      className="investigation-action"
                      value={item.status}
                      disabled={updatingIds.has(item.id)}
                      onChange={(event) => updateStatus(item.id, event.target.value)}
                      aria-label={`Update workflow status for ${item.id}`}
                    >
                      {WORKFLOW_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-box investigation-guidelines">
        <div className="box-header">
          <div>
            <h2>Review Guidance</h2>
            <p>These are manual review steps; the app does not determine fraud.</p>
          </div>
        </div>
        <div className="investigation-guidelines-grid">
          <div className="guideline-card">
            <div className="guideline-number">01</div>
            <h3>Review the Record</h3>
            <p>Check the transaction amount, payment method, risk score, and current status.</p>
          </div>
          <div className="guideline-card">
            <div className="guideline-number">02</div>
            <h3>Check Available Context</h3>
            <p>Use the customer and transaction information available in the project.</p>
          </div>
          <div className="guideline-card">
            <div className="guideline-number">03</div>
            <h3>Update Workflow Status</h3>
            <p>Record whether the item is pending, being investigated, reviewed, or completed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Investigation;
