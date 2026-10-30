import { useEffect, useState } from "react";
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
import Investigation from "./pages/Investigation";
import FraudCases from "./pages/FraudCases";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";


function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadTransactions() {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const data = await response.json();
        if (isCurrent) {
          setTransactions(data);
          setError("");
        }
      } catch {
        if (isCurrent) {
          setError("Could not load dashboard data. Check that the backend is running.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadTransactions();
    return () => {
      isCurrent = false;
    };
  }, []);

  const highRiskCount = transactions.filter((transaction) => Number(transaction.risk) >= 70).length;
  const lowRiskCount = transactions.filter((transaction) => Number(transaction.risk) < 40).length;
  const mediumRiskCount = transactions.filter((transaction) => Number(transaction.risk) >= 40 && Number(transaction.risk) < 70).length;
  const percentage = (count) => transactions.length ? Math.round((count / transactions.length) * 100) : 0;
  const lowRiskPercentage = percentage(lowRiskCount);
  const mediumRiskPercentage = percentage(mediumRiskCount);
  const highRiskPercentage = percentage(highRiskCount);
  const displayCount = (count) => (loading || error ? "—" : count.toLocaleString());
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Fraud Detection Dashboard</h1>
          <p>Monitor transactions and identify suspicious activity.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <h2>{displayCount(transactions.length)}</h2>
          <p>Transactions in the database</p>
        </div>

        <div className="summary-card">
          <h3>Fraud Detected</h3>
          <h2>—</h2>
          <p>Detection rules not configured</p>
        </div>

        <div className="summary-card">
          <h3>High Risk</h3>
          <h2>{displayCount(highRiskCount)}</h2>
          <p>Risk score 70 or higher</p>
        </div>

        <div className="summary-card">
          <h3>Fraud Prevented</h3>
          <h2>—</h2>
          <p>Prevention data not available</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-box">
          <div className="box-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Latest transaction activity</p>
            </div>
            <Link to="/transactions"><button>View All</button></Link>
          </div>

          <div className="transaction-header">
            <span>Transaction ID</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Risk</span>
          </div>

          {loading && (
            <div className="transaction-item">
              <span>Loading transactions...</span><span /><span /><span />
            </div>
          )}

          {!loading && error && (
            <div className="transaction-item">
              <span>{error}</span><span /><span /><span />
            </div>
          )}

          {!loading && !error && recentTransactions.map((transaction) => (
            <div className="transaction-item" key={transaction.id}>
              <span>{transaction.id}</span>
              <span>{transaction.amount}</span>
              <span>{transaction.status}</span>
              <span>{Number(transaction.risk) >= 70 ? "High" : Number(transaction.risk) >= 40 ? "Medium" : "Low"}</span>
            </div>
          ))}
        </div>

        <div className="dashboard-box">
          <div className="box-header">
            <div>
              <h2>Risk Overview</h2>
              <p>Low &lt;40, medium 40–69, high 70+</p>
            </div>
          </div>

          <div className="risk-item">
            <div className="risk-title"><span>Low Risk</span><strong>{loading || error ? "—" : `${lowRiskPercentage}%`}</strong></div>
            <div className="progress-bar"><div className="progress-low" style={{ width: `${lowRiskPercentage}%` }} /></div>
          </div>

          <div className="risk-item">
            <div className="risk-title"><span>Medium Risk</span><strong>{loading || error ? "—" : `${mediumRiskPercentage}%`}</strong></div>
            <div className="progress-bar"><div className="progress-medium" style={{ width: `${mediumRiskPercentage}%` }} /></div>
          </div>

          <div className="risk-item">
            <div className="risk-title"><span>High Risk</span><strong>{loading || error ? "—" : `${highRiskPercentage}%`}</strong></div>
            <div className="progress-bar"><div className="progress-high" style={{ width: `${highRiskPercentage}%` }} /></div>
          </div>

          <div className="suspicious-box">
            <h3>⚠ High Risk Transactions</h3>
            <p>{loading || error ? "Risk summary unavailable." : `${highRiskCount} transaction(s) have a risk score of 70 or higher.`}</p>
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

            <Route
              path="/investigation"
              element={<Investigation />}
            />
            <Route
              path="/fraud-cases"
              element={<FraudCases />}
            />
            <Route
              path="/analytics"
              element={<Analytics />}
            />
            <Route
              path="/ai-insights"
              element={<AIInsights />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}


export default App;
