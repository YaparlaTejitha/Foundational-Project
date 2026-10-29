import { useState } from "react";

function Investigation() {
  const [investigations, setInvestigations] = useState([
    {
      id: "INV001",
      transactionId: "TXN003",
      amount: "₹80,000",
      riskScore: 92,
      reason: "Unusually large transaction",
      assignedTo: "Investigation Team",
      status: "Under Investigation",
    },
    {
      id: "INV002",
      transactionId: "TXN005",
      amount: "₹65,000",
      riskScore: 87,
      reason: "Suspicious transaction pattern",
      assignedTo: "Investigation Team",
      status: "Pending",
    },
    {
      id: "INV003",
      transactionId: "TXN012",
      amount: "₹1,20,000",
      riskScore: 96,
      reason: "Unusual transaction amount",
      assignedTo: "Risk Team",
      status: "Escalated",
    },
    {
      id: "INV004",
      transactionId: "TXN018",
      amount: "₹95,000",
      riskScore: 89,
      reason: "Multiple suspicious activities",
      assignedTo: "Risk Team",
      status: "Resolved",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setInvestigations((previousInvestigations) =>
      previousInvestigations.map((investigation) =>
        investigation.id === id
          ? { ...investigation, status: newStatus }
          : investigation
      )
    );
  };

  const pendingCount = investigations.filter(
    (item) => item.status === "Pending"
  ).length;

  const investigatingCount = investigations.filter(
    (item) => item.status === "Under Investigation"
  ).length;

  const escalatedCount = investigations.filter(
    (item) => item.status === "Escalated"
  ).length;

  const resolvedCount = investigations.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="dashboard-page investigation-page">
      <div className="page-header">
        <div>
          <h1>Investigation</h1>
          <p>
            Review suspicious transactions and manage fraud investigations.
          </p>
        </div>
      </div>

      {/* Investigation Summary */}
      <div className="summary-cards investigation-summary">
        <div className="summary-card">
          <p>Total Investigations</p>
          <h2>{investigations.length}</h2>
          <span>All investigation records</span>
        </div>

        <div className="summary-card">
          <p>Pending</p>
          <h2>{pendingCount}</h2>
          <span>Awaiting review</span>
        </div>

        <div className="summary-card">
          <p>Under Investigation</p>
          <h2>{investigatingCount}</h2>
          <span>Currently being reviewed</span>
        </div>

        <div className="summary-card">
          <p>Escalated</p>
          <h2>{escalatedCount}</h2>
          <span>Requires further attention</span>
        </div>
      </div>

      {/* Investigation Records */}
      <div className="dashboard-box investigation-box">
        <div className="box-header">
          <div>
            <h2>Investigation Records</h2>
            <p>Review transaction details and update investigation status.</p>
          </div>
          <span className="investigation-count">
            {investigations.length} Records
          </span>
        </div>

        <div className="investigation-table-wrapper">
          <table className="investigation-table">
            <thead>
              <tr>
                <th>Investigation ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Risk Score</th>
                <th>Reason</th>
                <th>Assigned Team</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {investigations.map((investigation) => (
                <tr key={investigation.id}>
                  <td className="investigation-id">{investigation.id}</td>
                  <td>{investigation.transactionId}</td>
                  <td className="investigation-amount">
                    {investigation.amount}
                  </td>
                  <td>
                    <span
                      className={`investigation-risk ${
                        investigation.riskScore >= 90
                          ? "risk-critical"
                          : "risk-high"
                      }`}
                    >
                      {investigation.riskScore}/100
                    </span>
                  </td>
                  <td>{investigation.reason}</td>
                  <td>{investigation.assignedTo}</td>
                  <td>
                    <span
                      className={`investigation-status status-${investigation.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {investigation.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="investigation-action"
                      value={investigation.status}
                      onChange={(event) =>
                        updateStatus(investigation.id, event.target.value)
                      }
                      aria-label={`Update status for ${investigation.id}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Investigation">
                        Under Investigation
                      </option>
                      <option value="Escalated">Escalated</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Guidelines */}
      <div className="dashboard-box investigation-guidelines">
        <div className="box-header">
          <div>
            <h2>Investigation Guidelines</h2>
            <p>Recommended steps when reviewing suspicious transactions.</p>
          </div>
        </div>

        <div className="investigation-guidelines-grid">
          <div className="guideline-card">
            <div className="guideline-number">01</div>
            <h3>Review Transaction</h3>
            <p>
              Check the transaction amount, risk score, and reason for the
              alert.
            </p>
          </div>

          <div className="guideline-card">
            <div className="guideline-number">02</div>
            <h3>Investigate Activity</h3>
            <p>
              Examine available transaction history and identify unusual
              patterns.
            </p>
          </div>

          <div className="guideline-card">
            <div className="guideline-number">03</div>
            <h3>Update Status</h3>
            <p>
              Mark the case as under investigation, escalated, or resolved
              after review.
            </p>
          </div>
        </div>
      </div>

      {/* Investigation Overview */}
      <div className="dashboard-box investigation-overview">
        <div>
          <h2>Investigation Overview</h2>
          <p>
            Keep track of suspicious activity and make sure high-risk cases
            receive appropriate attention.
          </p>
        </div>

        <div className="overview-stat">
          <span>Resolved Investigations</span>
          <strong>{resolvedCount}</strong>
        </div>
      </div>
    </div>
  );
}

export default Investigation;