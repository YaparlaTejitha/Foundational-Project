function FraudAlerts() {
  return (
    <div className="fraud-alerts-page">

      <h1>Fraud Alerts</h1>

      <p className="subtitle">
        Monitor and review suspicious transactions
      </p>

      <div className="alerts-table">

        <div className="alerts-header">
          <span>Alert ID</span>
          <span>Transaction ID</span>
          <span>Amount</span>
          <span>Risk</span>
          <span>Status</span>
        </div>

        <div className="alerts-row">
          <span>FA001</span>
          <span>TXN003</span>
          <span>₹80,000</span>
          <span className="risk-high">High</span>
          <span className="status-pending">Pending</span>
        </div>

        <div className="alerts-row">
          <span>FA002</span>
          <span>TXN007</span>
          <span>₹50,000</span>
          <span className="risk-medium">Medium</span>
          <span className="status-reviewing">Reviewing</span>
        </div>

        <div className="alerts-row">
          <span>FA003</span>
          <span>TXN012</span>
          <span>₹1,20,000</span>
          <span className="risk-high">High</span>
          <span className="status-investigating">Investigating</span>
        </div>

      </div>

    </div>
  );
}

export default FraudAlerts;
