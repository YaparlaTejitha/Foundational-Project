function Transactions() {
  const transactions = [
    {
      id: "TXN-10021",
      amount: "₹2,450",
      type: "Online Payment",
      status: "Genuine",
      risk: "Low",
      score: "12",
    },
    {
      id: "TXN-10022",
      amount: "₹80,000",
      type: "Bank Transfer",
      status: "Fraud",
      risk: "High",
      score: "94",
    },
    {
      id: "TXN-10023",
      amount: "₹12,500",
      type: "Online Payment",
      status: "Review",
      risk: "Medium",
      score: "61",
    },
    {
      id: "TXN-10024",
      amount: "₹1,200",
      type: "UPI Payment",
      status: "Genuine",
      risk: "Low",
      score: "8",
    },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">A</div>
          <div>
            <h2>AegisAI</h2>
            <span>Fraud Detection</span>
          </div>
        </div>

        <nav>
          <a href="/">Dashboard</a>
          <a className="active" href="/transactions">
            Transactions
          </a>
          <a>Fraud Alerts</a>
          <a>Risk Monitoring</a>
          <a>Investigation</a>
          <a>Fraud Cases</a>
          <a>Analytics</a>
          <a>AI Insights</a>
        </nav>

        <div className="sidebar-bottom">
          <a>Settings</a>
          <a>Logout</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Transactions</h1>
            <p>View and analyze all transactions processed by AegisAI.</p>
          </div>
        </header>

        {/* Transaction Table */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Transaction Intelligence</h3>
              <p>Analyze transaction activity and fraud risk.</p>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Risk Level</th>
                  <th>Fraud Score</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.type}</td>

                    <td>
                      <span
                        className={`badge ${
                          transaction.status === "Fraud"
                            ? "fraud"
                            : transaction.status === "Review"
                            ? "review"
                            : "genuine"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td>{transaction.risk}</td>

                    <td>
                      <strong>{transaction.score}/100</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Transactions;