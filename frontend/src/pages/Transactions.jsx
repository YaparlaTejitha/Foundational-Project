function Transactions() {
  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      <p className="subtitle">
        Monitor and analyze financial transactions
      </p>

      <div className="transaction-table">

        <div className="table-header">
          <span>Transaction ID</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Risk</span>
        </div>

        <div className="table-row">
          <span>TXN001</span>
          <span>₹5,000</span>
          <span className="status-completed">Completed</span>
          <span className="risk-low">Low</span>
        </div>

        <div className="table-row">
          <span>TXN002</span>
          <span>₹25,000</span>
          <span className="status-completed">Completed</span>
          <span className="risk-medium">Medium</span>
        </div>

        <div className="table-row">
          <span>TXN003</span>
          <span>₹80,000</span>
          <span className="status-flagged">Flagged</span>
          <span className="risk-high">High</span>
        </div>

      </div>

    </div>
  );
}

export default Transactions;
