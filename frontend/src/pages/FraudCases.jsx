
function FraudCases() {
  const cases = [
    {
      id: "FC001",
      transactionId: "TXN003",
      amount: "₹80,000",
      risk: "Critical",
      reason: "Unusually large transaction",
      status: "Open",
    },
    {
      id: "FC002",
      transactionId: "TXN005",
      amount: "₹65,000",
      risk: "High",
      reason: "Suspicious transaction pattern",
      status: "Under Review",
    },
    {
      id: "FC003",
      transactionId: "TXN012",
      amount: "₹1,20,000",
      risk: "Critical",
      reason: "Unusual transaction amount",
      status: "Escalated",
    },
    {
      id: "FC004",
      transactionId: "TXN018",
      amount: "₹95,000",
      risk: "High",
      reason: "Multiple suspicious activities",
      status: "Closed",
    },
  ];

  const openCases = cases.filter((item) => item.status === "Open").length;
  const reviewCases = cases.filter(
    (item) => item.status === "Under Review"
  ).length;
  const escalatedCases = cases.filter(
    (item) => item.status === "Escalated"
  ).length;

  return (
    <div className="dashboard-page fraud-cases-page">
      <div className="page-header">
        <div>
          <h1>Fraud Cases</h1>
          <p>Manage and track detected fraud cases.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <p>Total Cases</p>
          <h2>{cases.length}</h2>
          <span>All recorded fraud cases</span>
        </div>

        <div className="summary-card">
          <p>Open Cases</p>
          <h2>{openCases}</h2>
          <span>Awaiting investigation</span>
        </div>

        <div className="summary-card">
          <p>Under Review</p>
          <h2>{reviewCases}</h2>
          <span>Currently being reviewed</span>
        </div>

        <div className="summary-card">
          <p>Escalated Cases</p>
          <h2>{escalatedCases}</h2>
          <span>Require further attention</span>
        </div>
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>Fraud Case Records</h2>
            <p>Details of detected and reported fraud cases.</p>
          </div>
        </div>

        <div className="fraud-cases-table-wrapper">
          <table className="fraud-cases-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Risk Level</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.transactionId}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={`case-risk risk-${item.risk.toLowerCase()}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td>{item.reason}</td>
                  <td>
                    <span className={`case-status status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FraudCases;
