import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const STATUS_ORDER = ["Pending", "Investigating", "Reviewing", "Completed"];
const METHOD_ORDER = ["UPI", "Card", "Net Banking"];

function Analytics() {
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
        }
      } catch {
        if (isCurrent) {
          setError("Could not load analytics. Check that the backend is running.");
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

  const metrics = useMemo(() => {
    const completed = transactions.filter((item) => item.status === "Completed").length;
    const highRisk = transactions.filter((item) => Number(item.risk) >= 70).length;
    const averageRisk = transactions.length
      ? transactions.reduce((total, item) => total + Number(item.risk), 0) / transactions.length
      : null;
    return { completed, highRisk, averageRisk };
  }, [transactions]);

  const displayValue = (value) => (loading || error ? "—" : value);
  const analytics = [
    {
      title: "Total Transactions",
      value: displayValue(transactions.length.toLocaleString()),
      description: "Records in the local database",
    },
    {
      title: "Completed Transactions",
      value: displayValue(metrics.completed.toLocaleString()),
      description: "Status marked Completed",
    },
    {
      title: "High-Risk Review Items",
      value: displayValue(metrics.highRisk.toLocaleString()),
      description: "Scores of 70 or higher; review flags only",
    },
    {
      title: "Average Risk Score",
      value: displayValue(metrics.averageRisk === null ? "—" : metrics.averageRisk.toFixed(1)),
      description: "Out of 100, using saved scores",
    },
  ];

  const methodData = {
    labels: METHOD_ORDER,
    datasets: [{
      label: "Transactions",
      data: METHOD_ORDER.map((method) => transactions.filter((item) => item.method === method).length),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    }],
  };

  const statusData = {
    labels: STATUS_ORDER,
    datasets: [{
      label: "Transactions",
      data: STATUS_ORDER.map((status) => transactions.filter((item) => item.status === status).length),
      backgroundColor: ["#f59e0b", "#8b5cf6", "#3b82f6", "#22c55e"],
      borderRadius: 6,
    }],
  };

  const riskBuckets = [
    transactions.filter((item) => Number(item.risk) < 40).length,
    transactions.filter((item) => Number(item.risk) >= 40 && Number(item.risk) < 70).length,
    transactions.filter((item) => Number(item.risk) >= 70 && Number(item.risk) < 90).length,
    transactions.filter((item) => Number(item.risk) >= 90).length,
  ];
  const riskData = {
    labels: ["Low (0–39)", "Medium (40–69)", "High (70–89)", "Critical (90–100)"],
    datasets: [{
      data: riskBuckets,
      backgroundColor: ["#22c55e", "#f59e0b", "#ef4444", "#991b1b"],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="dashboard-page analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Summaries of transactions, workflow statuses, and saved risk scores.</p>
        </div>
      </div>

      {error && <p className="transaction-status-error" role="alert">{error}</p>}

      <div className="summary-cards">
        {analytics.map((item) => (
          <div className="summary-card" key={item.title}>
            <h3>{item.title}</h3>
            <h2>{item.value}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>Transaction Overview</h2>
            <p>Counts use the current local database; this page does not detect fraud.</p>
          </div>
        </div>
        <div className="analytics-info">
          <div>
            <h3>{displayValue(metrics.highRisk.toLocaleString())}</h3>
            <p>High-Risk Review Items (70+)</p>
          </div>
          <div>
            <h3>{displayValue(transactions.filter((item) => item.status === "Pending").length.toLocaleString())}</h3>
            <p>Pending Transactions</p>
          </div>
          <div>
            <h3>{displayValue(metrics.averageRisk === null ? "—" : metrics.averageRisk.toFixed(1))}</h3>
            <p>Average Saved Risk Score</p>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="dashboard-box">
          <div className="box-header"><h2>Transactions by Payment Method</h2></div>
          <div className="chart-container"><Bar data={methodData} options={chartOptions} /></div>
        </div>

        <div className="dashboard-box">
          <div className="box-header"><h2>Transactions by Workflow Status</h2></div>
          <div className="chart-container"><Bar data={statusData} options={chartOptions} /></div>
        </div>

        <div className="dashboard-box">
          <div className="box-header"><h2>Risk Score Distribution</h2></div>
          <div className="chart-container doughnut-chart"><Doughnut data={riskData} options={chartOptions} /></div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
