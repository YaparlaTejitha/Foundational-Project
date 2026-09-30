import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-layout">

      <aside className="sidebar">
        <h2>AEGISAI</h2>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/alerts">Fraud Alerts</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;
