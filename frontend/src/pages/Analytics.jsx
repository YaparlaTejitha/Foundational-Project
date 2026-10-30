
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const analytics = [
    {
      title: "Total Transactions",
      value: "12,480",
      description: "Total transactions processed",
    },
    {
      title: "Successful Transactions",
      value: "11,920",
      description: "Transactions completed",
    },
    {
      title: "Fraud Detected",
      value: "186",
      description: "Suspicious transactions identified",
    },
    {
      title: "Fraud Rate",
      value: "1.49%",
      description: "Percentage of fraudulent transactions",
    },
  ];

  const transactionData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Transactions",
        data: [1200, 1500, 1800, 2100, 2500, 2800],
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const fraudData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Fraud Cases",
        data: [12, 18, 15, 25, 20, 30],
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const riskData = {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="dashboard-page analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Analyze transaction performance and fraud trends.</p>
        </div>
      </div>

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
            <h2>Fraud Analysis Overview</h2>
            <p>Summary of detected fraudulent activities.</p>
          </div>
        </div>

        <div className="analytics-info">
          <div>
            <h3>186</h3>
            <p>Fraud Cases Detected</p>
          </div>

          <div>
            <h3>74</h3>
            <p>High Risk Transactions</p>
          </div>

          <div>
            <h3>₹8.4L</h3>
            <p>Estimated Fraud Prevented</p>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="dashboard-box">
          <div className="box-header">
            <h2>Monthly Transaction Trends</h2>
          </div>
          <div className="chart-container">
            <Bar data={transactionData} options={chartOptions} />
          </div>
        </div>

        <div className="dashboard-box">
          <div className="box-header">
            <h2>Fraud Detection Trends</h2>
          </div>
          <div className="chart-container">
            <Line data={fraudData} options={chartOptions} />
          </div>
        </div>

        <div className="dashboard-box">
          <div className="box-header">
            <h2>Risk Distribution</h2>
          </div>
          <div className="chart-container doughnut-chart">
            <Doughnut data={riskData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;

