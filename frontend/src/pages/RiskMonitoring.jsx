import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RiskMonitoring() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

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
          setError("Could not load risk information. Check that the backend is running.");
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
  }, []);

  const lowRisk = transactions.filter((item) => Number(item.risk) < 40);
  const mediumRisk = transactions.filter((item) => Number(item.risk) >= 40 && Number(item.risk) < 70);
  const highRisk = transactions.filter((item) => Number(item.risk) >= 70 && Number(item.risk) < 90);
  const criticalRisk = transactions.filter((item) => Number(item.risk) >= 90);
  const reviewItems = transactions
    .filter((item) => Number(item.risk) >= 70)
    .sort((a, b) => Number(b.risk) - Number(a.risk));
  const pendingReviewCount = reviewItems.filter((item) => item.status === "Pending").length;
  const averageRisk = transactions.length
    ? transactions.reduce((total, item) => total + Number(item.risk), 0) / transactions.length
    : null;
  const percentage = (items) => transactions.length
    ? Math.round((items.length / transactions.length) * 100)
    : 0;
  const displayCount = (count) => (loading || error ? "—" : count.toLocaleString());
  const displayPercentage = (items) => (loading || error ? "—" : `${percentage(items)}%`);
  const displayBarWidth = (items) => (loading || error ? "0%" : `${percentage(items)}%`);

  return (
    <div className="risk-monitoring-page">
      <div className="page-header">
        <div>
          <h1>Risk Monitoring</h1>
          <p>Risk categories are based on the scores saved with each transaction; they do not confirm fraud.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Low Risk</h3>
          <h2>{displayPercentage(lowRisk)}</h2>
          <p>{displayCount(lowRisk.length)} transactions · score under 40</p>
        </div>
        <div className="summary-card">
          <h3>Medium Risk</h3>
          <h2>{displayPercentage(mediumRisk)}</h2>
          <p>{displayCount(mediumRisk.length)} transactions · scores 40–69</p>
        </div>
        <div className="summary-card">
          <h3>High Risk</h3>
          <h2>{displayPercentage(highRisk)}</h2>
          <p>{displayCount(highRisk.length)} transactions · scores 70–89</p>
        </div>
        <div className="summary-card">
          <h3>Critical Risk</h3>
          <h2>{displayCount(criticalRisk.length)}</h2>
          <p>{displayCount(criticalRisk.length)} transactions · scores 90–100</p>
        </div>
      </div>

      <div className="dashboard-box risk-distribution-box">
        <div className="box-header">
          <div>
            <h2>Risk Distribution</h2>
            <p>Share of transactions in each score range</p>
          </div>
        </div>

        <div className="risk-item">
          <div className="risk-title"><span>Low Risk</span><strong>{displayPercentage(lowRisk)}</strong></div>
          <div className="progress-bar"><div className="progress-low" style={{ width: displayBarWidth(lowRisk) }} /></div>
        </div>
        <div className="risk-item">
          <div className="risk-title"><span>Medium Risk</span><strong>{displayPercentage(mediumRisk)}</strong></div>
          <div className="progress-bar"><div className="progress-medium" style={{ width: displayBarWidth(mediumRisk) }} /></div>
        </div>
        <div className="risk-item">
          <div className="risk-title"><span>High Risk</span><strong>{displayPercentage(highRisk)}</strong></div>
          <div className="progress-bar"><div className="progress-high" style={{ width: displayBarWidth(highRisk) }} /></div>
        </div>
        <div className="risk-item">
          <div className="risk-title"><span>Critical Risk</span><strong>{displayPercentage(criticalRisk)}</strong></div>
          <div className="progress-bar"><div className="progress-critical" style={{ width: displayBarWidth(criticalRisk) }} /></div>
        </div>
      </div>

      <div className="dashboard-box high-risk-box">
        <div className="box-header">
          <div>
            <h2>High-Risk Transactions</h2>
            <p>Risk scores of 70 or higher, for review</p>
          </div>
          <Link to="/alerts"><button type="button">View Alerts</button></Link>
        </div>

        <div className="risk-table">
          <div className="risk-table-header">
            <span>Transaction ID</span>
            <span>Amount</span>
            <span>Risk Score</span>
            <span>Risk Level</span>
            <span>Status</span>
          </div>

          {loading && <div className="risk-table-row"><span>Loading...</span><span /><span /><span /><span /></div>}
          {!loading && error && <div className="risk-table-row"><span>{error}</span><span /><span /><span /><span /></div>}
          {!loading && !error && reviewItems.length === 0 && <div className="risk-table-row"><span>No transactions meet the review threshold.</span><span /><span /><span /><span /></div>}
          {!loading && !error && reviewItems.map((item) => (
            <div className="risk-table-row" key={item.id}>
              <span>{item.id}</span>
              <span>{item.amount}</span>
              <span>{item.risk}</span>
              <span className={Number(item.risk) >= 90 ? "risk-critical" : "risk-high"}>
                {Number(item.risk) >= 90 ? "Critical" : "High"}
              </span>
              <span>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-box risk-score-box">
        <div className="box-header">
          <div>
            <h2>Risk Score Overview</h2>
            <p>Average of the scores currently saved in the database</p>
          </div>
        </div>
        <div className="score-overview">
          <div className="score-main">
            <span>Average Risk Score</span>
            <strong>{loading || error || averageRisk === null ? "—" : averageRisk.toFixed(1)}</strong>
            <p>Out of 100</p>
          </div>
          <div className="score-details">
            <div className="score-item"><span>Low Risk Score</span><strong>0–39</strong></div>
            <div className="score-item"><span>Medium Risk Score</span><strong>40–69</strong></div>
            <div className="score-item"><span>High Risk Score</span><strong>70–89</strong></div>
            <div className="score-item"><span>Critical Risk Score</span><strong>90–100</strong></div>
          </div>
        </div>
      </div>

      <div className="dashboard-box risk-insights-box">
        <div className="box-header">
          <div>
            <h2>Risk Monitoring Insights</h2>
            <p>Counts calculated from current sample records</p>
          </div>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>High-Risk Review Items</h3>
            <p>{loading || error ? "Risk information unavailable." : `${reviewItems.length} transaction(s) have scores of 70 or higher. These are review flags only.`}</p>
          </div>
          <div className="insight-card">
            <h3>Critical Scores</h3>
            <p>{loading || error ? "Risk information unavailable." : `${criticalRisk.length} transaction(s) have scores of 90 or higher.`}</p>
          </div>
          <div className="insight-card">
            <h3>Pending Review</h3>
            <p>{loading || error ? "Risk information unavailable." : `${pendingReviewCount} high-risk transaction(s) are still marked Pending.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskMonitoring;
