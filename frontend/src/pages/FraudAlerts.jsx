import { useEffect, useState } from "react";

function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadAlerts() {
      try {
        const response = await fetch("/api/alerts");
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data = await response.json();
        if (isCurrent) {
          setAlerts(data);
        }
      } catch {
        if (isCurrent) {
          setError("Could not load high-risk items. Check that the backend is running.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadAlerts();
    return () => {
      isCurrent = false;
    };
  }, []);

  const pendingCount = alerts.filter((alert) => alert.status === "Pending").length;
  const investigatingCount = alerts.filter((alert) => alert.status === "Investigating").length;
  const displayCount = (count) => (loading || error ? "—" : count.toLocaleString());

  return (
    <div className="fraud-alerts-page">
      <div className="page-header">
        <h1>Fraud Alerts</h1>
        <p>Transactions scoring 70 or higher are listed for review. These flags do not confirm fraud.</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>High-Risk Review Flags</h3>
          <h2>{displayCount(alerts.length)}</h2>
          <p>Transactions with scores of 70+</p>
        </div>

        <div className="summary-card">
          <h3>Pending</h3>
          <h2>{displayCount(pendingCount)}</h2>
          <p>Awaiting review</p>
        </div>

        <div className="summary-card">
          <h3>Investigating</h3>
          <h2>{displayCount(investigatingCount)}</h2>
          <p>Under investigation</p>
        </div>

        <div className="summary-card">
          <h3>Review Threshold</h3>
          <h2>70+</h2>
          <p>Risk score out of 100</p>
        </div>
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>High-Risk Items for Review</h2>
            <p>Scores use the current sample risk values.</p>
          </div>
        </div>

        <div className="alerts-table">
          <div className="alerts-header">
            <span>Review Flag</span>
            <span>Transaction ID</span>
            <span>Amount</span>
            <span>Risk Score</span>
            <span>Status</span>
          </div>

          {loading && (
            <div className="alerts-row">
              <span>Loading...</span><span /><span /><span /><span />
            </div>
          )}

          {!loading && error && (
            <div className="alerts-row">
              <span>{error}</span><span /><span /><span /><span />
            </div>
          )}

          {!loading && !error && alerts.length === 0 && (
            <div className="alerts-row">
              <span>No transactions meet the review threshold.</span><span /><span /><span /><span />
            </div>
          )}

          {!loading && !error && alerts.map((alert) => (
            <div className="alerts-row" key={alert.id}>
              <span className="risk-high">High risk</span>
              <span>{alert.id}</span>
              <span>{alert.amount}</span>
              <span className="risk-high">{alert.risk}</span>
              <span className={`alert-status ${alert.status.toLowerCase()}`}>{alert.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FraudAlerts;
