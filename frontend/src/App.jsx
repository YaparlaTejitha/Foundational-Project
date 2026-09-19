import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Transactions from "./pages/Transactions";

function Dashboard() {
  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>AEGISAI</h2>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/alerts">Fraud Alerts</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
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
      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
