function Transactions() {
  const transactions = [
    {
      id: "TXN003",
      customer: "CUS001",
      amount: "₹80,000",
      date: "29 Oct 2026",
      time: "10:30 AM",
      method: "UPI",
      risk: 92,
      status: "Pending",
    },
    {
      id: "TXN005",
      customer: "CUS002",
      amount: "₹65,000",
      date: "29 Oct 2026",
      time: "11:15 AM",
      method: "Card",
      risk: 87,
      status: "Pending",
    },
    {
      id: "TXN012",
      customer: "CUS003",
      amount: "₹1,20,000",
      date: "29 Oct 2026",
      time: "12:45 PM",
      method: "Net Banking",
      risk: 96,
      status: "Investigating",
    },
    {
      id: "TXN018",
      customer: "CUS004",
      amount: "₹95,000",
      date: "29 Oct 2026",
      time: "02:20 PM",
      method: "UPI",
      risk: 89,
      status: "Reviewing",
    },
    {
      id: "TXN021",
      customer: "CUS005",
      amount: "₹2,450",
      date: "29 Oct 2026",
      time: "03:10 PM",
      method: "Card",
      risk: 12,
      status: "Completed",
    },
  ];

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
          <h2>12,480</h2>
          <p>All recorded transactions</p>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <h2>10,234</h2>
          <p className="green-text">Successfully processed</p>
        </div>

        <div className="summary-card">
          <h3>Under Review</h3>
          <h2>24</h2>
          <p>Awaiting attention</p>
        </div>

        <div className="summary-card">
          <h3>Flagged</h3>
          <h2>186</h2>
          <p>Require risk assessment</p>
        </div>
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>All Transactions</h2>
            <p>Transaction details and processing status</p>
          </div>
        </div>

      <div className="transactions-table">
        <div className="transactions-table-header">
            <span>Transaction ID</span>
            <span>Customer ID</span>
            <span>Amount</span>
            <span>Date & Time</span>
            <span>Method</span>
            <span>Risk Score</span>
            <span>Status</span>
          </div>

          {transactions.map((transaction) => (
            <div className="transactions-table-row" key={transaction.id}>
              <span>{transaction.id}</span>
              <span>{transaction.customer}</span>
              <span>{transaction.amount}</span>
              <span>{transaction.date}, {transaction.time}</span>
              <span>{transaction.method}</span>
              <span>{transaction.risk}</span>
              <span>{transaction.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
