function AIInsights() {
  const insights = [
    {
      title: "Unusual Transaction Amount",
      description:
        "A transaction significantly higher than the customer's usual spending pattern was detected.",
      risk: "High",
      category: "Amount Analysis",
    },
    {
      title: "Unusual Transaction Location",
      description:
        "A transaction from an unfamiliar location was identified and requires verification.",
      risk: "High",
      category: "Location Analysis",
    },
    {
      title: "Multiple Transactions Detected",
      description:
        "Several transactions occurred within a short period, indicating a potentially unusual pattern.",
      risk: "Medium",
      category: "Transaction Pattern",
    },
    {
      title: "Unusual Transaction Timing",
      description:
        "A transaction was recorded at an unusual time compared with the customer's normal activity.",
      risk: "Medium",
      category: "Time Analysis",
    },
  ];

  return (
    <div className="dashboard-page ai-insights-page">

      <div className="page-header">
        <div>
          <h1>AI Insights</h1>
          <p>
            Identify unusual transaction patterns and understand potential fraud risks.
          </p>
        </div>
      </div>

      <div className="summary-cards">

        <div className="summary-card">
          <h3>Total Insights</h3>
          <h2>24</h2>
          <p>Insights generated</p>
        </div>

        <div className="summary-card">
          <h3>High Risk Insights</h3>
          <h2>08</h2>
          <p>Require attention</p>
        </div>

        <div className="summary-card">
          <h3>Medium Risk Insights</h3>
          <h2>10</h2>
          <p>Need monitoring</p>
        </div>

        <div className="summary-card">
          <h3>Low Risk Insights</h3>
          <h2>06</h2>
          <p>For observation</p>
        </div>

      </div>

      <div className="dashboard-box">

        <div className="box-header">
          <div>
            <h2>AI Generated Insights</h2>
            <p>Unusual patterns identified in transaction activity.</p>
          </div>
        </div>

        <div className="insights-list">

          {insights.map((item, index) => (
            <div className="insight-card" key={index}>

              <div className="insight-content">
                <span className="insight-category">
                  {item.category}
                </span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>

              <span
                className={`insight-risk ${
                  item.risk === "High"
                    ? "insight-high"
                    : "insight-medium"
                }`}
              >
                {item.risk} Risk
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default AIInsights;
