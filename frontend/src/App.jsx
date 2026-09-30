import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Transactions from "./pages/Transactions";

function Dashboard() {
  return (
    <div className="dashboard-content">
      <h1>Dashboard</h1>

      <p className="subtitle">
        AI-Powered Fraud Detection & Risk Platform
      </p>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Transactions</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Fraud Detected</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>High Risk</h3>
          <p>0</p>
        </div>

        <div className="card">
          <h3>Risk Score</h3>
          <p>0%</p>
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

          <h2>AEGISAI</h2>

          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/alerts">Fraud Alerts</Link>
            <Link to="/risk-monitoring">Risk Monitoring</Link>
            <Link to="/investigation">Investigation</Link>
            <Link to="/fraud-cases">Fraud Cases</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/ai-insights">AI Insights</Link>
          </nav>

          {/* Bottom Sidebar */}
          <div className="sidebar-bottom">
            <Link to="/settings">Settings</Link>
            <Link to="/logout">Logout</Link>
          </div>

        </aside>

        {/* Page Content */}
        <main className="main-content">

          {/* Administrator */}
          <div className="top-bar">
            <span>Administrator 👤</span>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;
