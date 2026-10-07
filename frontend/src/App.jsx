import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link
} from "react-router-dom";

import "./App.css";
import Transactions from "./pages/Transactions";
import FraudAlerts from "./pages/FraudAlerts";
import RiskMonitoring from "./pages/RiskMonitoring";

function Dashboard() {
  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <h1>Fraud Detection Dashboard</h1>
          <p>Monitor transactions and identify suspicious activity.</p>
        </div>
      </div>


      {/* Summary Cards */}
      <div className="summary-cards">

        <div className="summary-card">
          <h3>Total Transactions</h3>
          <h2>12,480</h2>
          <p className="green-text">+8.2% this month</p>
        </div>

        <div className="summary-card">
          <h3>Fraud Detected</h3>
          <h2>186</h2>
          <p className="green-text">1.49% of transactions</p>
        </div>

        <div className="summary-card">
          <h3>High Risk</h3>
          <h2>74</h2>
          <p className="green-text">Requires attention</p>
        </div>

        <div className="summary-card">
          <h3>Fraud Prevented</h3>
          <h2>₹8.4L</h2>
          <p className="green-text">Estimated amount protected</p>
        </div>

      </div>


      {/* Dashboard Lower Section */}
      <div className="dashboard-grid">


        {/* Recent Transactions */}
        <div className="dashboard-box">

          <div className="box-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Latest transaction activity</p>
            </div>

            <button>View All</button>
          </div>


          <div className="transaction-header">
            <span>Transaction ID</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Risk</span>
          </div>


          <div className="transaction-item">
            <span>TXN-10021</span>
            <span>₹2,450</span>
            <span className="status-genuine">Genuine</span>
            <span>Low</span>
          </div>

          <div className="transaction-item">
            <span>TXN-10022</span>
            <span>₹80,000</span>
            <span className="status-fraud">Fraud</span>
            <span>High</span>
          </div>

          <div className="transaction-item">
            <span>TXN-10023</span>
            <span>₹12,500</span>
            <span className="status-review">Review</span>
            <span>Medium</span>
          </div>

          <div className="transaction-item">
            <span>TXN-10024</span>
            <span>₹1,200</span>
            <span className="status-genuine">Genuine</span>
            <span>Low</span>
          </div>

        </div>


        {/* Risk Overview */}
        <div className="dashboard-box">

          <div className="box-header">
            <div>
              <h2>Risk Overview</h2>
              <p>Current transaction risk levels</p>
            </div>
          </div>


          <div className="risk-item">

            <div className="risk-title">
              <span>Low Risk</span>
              <strong>82%</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-low"></div>
            </div>

          </div>


          <div className="risk-item">

            <div className="risk-title">
              <span>Medium Risk</span>
              <strong>12%</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-medium"></div>
            </div>

          </div>


          <div className="risk-item">

            <div className="risk-title">
              <span>High Risk</span>
              <strong>6%</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-high"></div>
            </div>

          </div>


          <div className="suspicious-box">
            <h3>⚠ Suspicious Activity</h3>
            <p>7 high-risk transactions require investigation.</p>
          </div>

        </div>

      </div>

    </div>
  );
}



function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">


        {/* Sidebar */}
        <aside className="sidebar">


          {/* Logo */}
          <div className="logo-section">

            <div className="logo-box">
              A
            </div>

            <div>
              <h2>AegisAI</h2>
              <p>Fraud Detection</p>
            </div>

          </div>


          {/* Navigation */}
          <nav>

            <NavLink to="/" end>
              Dashboard
            </NavLink>

            <NavLink to="/transactions">
              Transactions
            </NavLink>

            <NavLink to="/alerts">
              Fraud Alerts
            </NavLink>

            <NavLink to="/risk-monitoring">
              Risk Monitoring
            </NavLink>

            <NavLink to="/investigation">
              Investigation
            </NavLink>

            <NavLink to="/fraud-cases">
              Fraud Cases
            </NavLink>

            <NavLink to="/analytics">
              Analytics
            </NavLink>

            <NavLink to="/ai-insights">
              AI Insights
            </NavLink>

          </nav>


          {/* Bottom Navigation */}
          <div className="sidebar-bottom">

            <Link to="/settings">
              Settings
            </Link>

            <Link to="/logout">
              Logout
            </Link>

          </div>

        </aside>


        {/* Main Content */}
        <main className="main-content">


          {/* Top Bar */}
          <div className="top-bar">

            <div className="admin-profile">

              <div className="admin-icon">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>


          {/* Pages */}
          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/alerts"
              element={<FraudAlerts />}
            />

            <Route
              path="/risk-monitoring"
              element={<RiskMonitoring />}
            />
          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}


export default App;