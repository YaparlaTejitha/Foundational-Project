function RiskMonitoring() {
  return (
    <div className="risk-monitoring-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Risk Monitoring</h1>
          <p>
            Monitor transaction risk levels and identify potential threats.
          </p>
        </div>
      </div>


      {/* Risk Summary Cards */}
      <div className="summary-cards">

        <div className="summary-card">
          <h3>Low Risk</h3>
          <h2>82%</h2>
          <p className="green-text">
            10,234 transactions
          </p>
        </div>

        <div className="summary-card">
          <h3>Medium Risk</h3>
          <h2>12%</h2>
          <p className="green-text">
            1,498 transactions
          </p>
        </div>

        <div className="summary-card">
          <h3>High Risk</h3>
          <h2>6%</h2>
          <p className="green-text">
            748 transactions
          </p>
        </div>

        <div className="summary-card">
          <h3>Critical Risk</h3>
          <h2>24</h2>
          <p className="green-text">
            Requires immediate action
          </p>
        </div>

      </div>


      {/* Risk Distribution */}
      <div className="dashboard-box risk-distribution-box">

        <div className="box-header">
          <div>
            <h2>Risk Distribution</h2>
            <p>
              Current distribution of transaction risk levels
            </p>
          </div>
        </div>


        {/* Low Risk */}
        <div className="risk-item">

          <div className="risk-title">
            <span>Low Risk</span>
            <strong>82%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-low"></div>
          </div>

        </div>


        {/* Medium Risk */}
        <div className="risk-item">

          <div className="risk-title">
            <span>Medium Risk</span>
            <strong>12%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-medium"></div>
          </div>

        </div>


        {/* High Risk */}
        <div className="risk-item">

          <div className="risk-title">
            <span>High Risk</span>
            <strong>6%</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-high"></div>
          </div>

        </div>


        {/* Critical Risk */}
        <div className="risk-item">

          <div className="risk-title">
            <span>Critical Risk</span>
            <strong>24 transactions</strong>
          </div>

          <div className="progress-bar">
            <div className="progress-critical"></div>
          </div>

        </div>

      </div>


      {/* High Risk Transactions */}
      <div className="dashboard-box high-risk-box">

        <div className="box-header">
          <div>
            <h2>High-Risk Transactions</h2>
            <p>
              Transactions requiring immediate attention
            </p>
          </div>

          <button>View All</button>
        </div>


        <div className="risk-table">

          {/* Table Header */}
          <div className="risk-table-header">
            <span>Transaction ID</span>
            <span>Amount</span>
            <span>Risk Score</span>
            <span>Risk Level</span>
            <span>Status</span>
          </div>


          {/* Transaction 1 */}
          <div className="risk-table-row">
            <span>TXN003</span>
            <span>₹80,000</span>
            <span>92</span>
            <span className="risk-high">High</span>
            <span className="status-pending">
              Pending
            </span>
          </div>


          {/* Transaction 2 */}
          <div className="risk-table-row">
            <span>TXN005</span>
            <span>₹65,000</span>
            <span>87</span>
            <span className="risk-high">High</span>
            <span className="status-pending">
              Pending
            </span>
          </div>


          {/* Transaction 3 */}
          <div className="risk-table-row">
            <span>TXN012</span>
            <span>₹1,20,000</span>
            <span>96</span>
            <span className="risk-high">High</span>
            <span className="status-investigating">
              Investigating
            </span>
          </div>


          {/* Transaction 4 */}
          <div className="risk-table-row">
            <span>TXN018</span>
            <span>₹95,000</span>
            <span>89</span>
            <span className="risk-high">High</span>
            <span className="status-reviewing">
              Reviewing
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RiskMonitoring;