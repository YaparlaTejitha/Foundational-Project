
function FraudAlerts() {
  const alerts = [
    {
      id: "FA001",
      transaction: "TXN003",
      amount: "₹80,000",
      risk: "High",
      status: "Pending",
    },
    {
      id: "FA002",
      transaction: "TXN007",
      amount: "₹50,000",
      risk: "Medium",
      status: "Reviewing",
    },
    {
      id: "FA003",
      transaction: "TXN012",
      amount: "₹1,20,000",
      risk: "High",
      status: "Investigating",
    },
  ];

  return (
    <div className="fraud-alerts-page">

      <div className="page-header">
        <h1>Fraud Alerts</h1>
        <p>Monitor and review suspicious transactions.</p>
      </div>

      <div className="summary-cards">

        <div className="summary-card">
          <h3>Total Alerts</h3>
          <h2>186</h2>
          <p>Detected alerts</p>
        </div>

        <div className="summary-card">
          <h3>High Risk</h3>
          <h2>74</h2>
          <p>Require attention</p>
        </div>

        <div className="summary-card">
          <h3>Pending</h3>
          <h2>24</h2>
          <p>Awaiting review</p>
        </div>

        <div className="summary-card">
          <h3>Investigating</h3>
          <h2>12</h2>
          <p>Under investigation</p>
        </div>

      </div>

      <div className="dashboard-box">

        <div className="box-header">
          <div>
            <h2>Recent Fraud Alerts</h2>
            <p>Suspicious transactions requiring attention</p>
          </div>
        </div>

        <div className="alerts-table">

          <div className="alerts-header">
            <span>Alert ID</span>
            <span>Transaction ID</span>
            <span>Amount</span>
            <span>Risk Level</span>
            <span>Status</span>
          </div>

          {alerts.map((alert) => (
            <div className="alerts-row" key={alert.id}>
              <span>{alert.id}</span>
              <span>{alert.transaction}</span>
              <span>{alert.amount}</span>
              <span className={
                alert.risk === "High"
                  ? "risk-high"
                  : "risk-medium"
              }>
                {alert.risk}
              </span>
              <span className="alert-status">
                {alert.status}
              </span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default FraudAlerts;
