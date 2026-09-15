import "./App.css";

function App() {
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
          <a className="active">Dashboard</a>
          <a>Transactions</a>
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
            <h1>Fraud Detection Dashboard</h1>
            <p>Monitor transactions and identify suspicious activity.</p>
          </div>

          <div className="user-profile">
            <div className="avatar">A</div>
            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Transactions</span>
            <h2>12,480</h2>
            <p>+8.2% this month</p>
          </div>

          <div className="stat-card">
            <span>Fraud Detected</span>
            <h2>186</h2>
            <p>1.49% of transactions</p>
          </div>

          <div className="stat-card">
            <span>High Risk</span>
            <h2>74</h2>
            <p>Requires attention</p>
          </div>

          <div className="stat-card">
            <span>Fraud Prevented</span>
            <h2>₹8.4L</h2>
            <p>Estimated amount protected</p>
          </div>
        </section>

        {/* Dashboard Sections */}
        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Recent Transactions</h3>
                <p>Latest transaction activity</p>
              </div>
              <button>View All</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Risk</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>TXN-10021</td>
                    <td>₹2,450</td>
                    <td><span className="badge genuine">Genuine</span></td>
                    <td>Low</td>
                  </tr>

                  <tr>
                    <td>TXN-10022</td>
                    <td>₹80,000</td>
                    <td><span className="badge fraud">Fraud</span></td>
                    <td>High</td>
                  </tr>

                  <tr>
                    <td>TXN-10023</td>
                    <td>₹12,500</td>
                    <td><span className="badge review">Review</span></td>
                    <td>Medium</td>
                  </tr>

                  <tr>
                    <td>TXN-10024</td>
                    <td>₹1,200</td>
                    <td><span className="badge genuine">Genuine</span></td>
                    <td>Low</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Risk Overview</h3>
                <p>Current transaction risk levels</p>
              </div>
            </div>

            <div className="risk-item">
              <div>
                <span>Low Risk</span>
                <strong>82%</strong>
              </div>
              <div className="progress">
                <div className="progress-low"></div>
              </div>
            </div>

            <div className="risk-item">
              <div>
                <span>Medium Risk</span>
                <strong>12%</strong>
              </div>
              <div className="progress">
                <div className="progress-medium"></div>
              </div>
            </div>

            <div className="risk-item">
              <div>
                <span>High Risk</span>
                <strong>6%</strong>
              </div>
              <div className="progress">
                <div className="progress-high"></div>
              </div>
            </div>

            <div className="alert-box">
              <strong>⚠ Suspicious Activity</strong>
              <p>7 high-risk transactions require investigation.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
