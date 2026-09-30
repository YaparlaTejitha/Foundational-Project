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
          <span>Completed</span>
          <span>Low</span>
        </div>

        <div className="table-row">
          <span>TXN002</span>
          <span>₹25,000</span>
          <span>Completed</span>
          <span>Medium</span>
        </div>

        <div className="table-row">
          <span>TXN003</span>
          <span>₹80,000</span>
          <span>Flagged</span>
          <span>High</span>
        </div>

      </div>
    </div>
  );
}

export default Transactions;
