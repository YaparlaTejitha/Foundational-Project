import { useState } from "react";

function AIInsights() {
  // Actual legitimate transaction from the credit card dataset
  const sampleTransaction = {
    Time: 0,
    V1: -1.359807,
    V2: -0.072781,
    V3: 2.536347,
    V4: 1.378155,
    V5: -0.338321,
    V6: 0.462388,
    V7: 0.239599,
    V8: 0.098698,
    V9: 0.363787,
    V10: 0.090794,
    V11: -0.5516,
    V12: -0.617801,
    V13: -0.99139,
    V14: -0.311169,
    V15: 1.468177,
    V16: -0.470401,
    V17: 0.207971,
    V18: 0.025791,
    V19: 0.403993,
    V20: 0.251412,
    V21: -0.018307,
    V22: 0.277838,
    V23: -0.110474,
    V24: 0.066928,
    V25: 0.128539,
    V26: -0.189115,
    V27: 0.133558,
    V28: -0.021053,
    Amount: 149.62,
  };

  const [transaction, setTransaction] = useState(
    JSON.stringify(sampleTransaction, null, 2)
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const analyzeTransaction = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    setSaveMessage("");

    try {
      const features = JSON.parse(transaction);

      // Step 1: Get prediction from FastAPI ML model
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Prediction failed"
        );
      }

      setResult(data);

      // Step 2: Save prediction in Flask backend / SQLite database
      try {
        const saveResponse = await fetch("/api/ai-predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            transaction_features: features,
          }),
        });

        const saveData = await saveResponse.json();

        if (!saveResponse.ok) {
          throw new Error(
            saveData.error || "Could not save prediction"
          );
        }

        setSaveMessage(
          "✓ Prediction generated and saved successfully!"
        );
      } catch (saveError) {
        setSaveMessage(
          "Prediction generated, but saving failed: " +
            saveError.message
        );
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const insights = [
    {
      title: "Unusual Transaction Amount",
      description:
        "A transaction significantly higher than usual spending may require verification.",
      risk: "High",
      category: "Amount Analysis",
    },
    {
      title: "Unusual Transaction Location",
      description:
        "Transactions from unfamiliar locations may require additional verification.",
      risk: "High",
      category: "Location Analysis",
    },
    {
      title: "Multiple Transactions Detected",
      description:
        "Several transactions within a short period may indicate unusual activity.",
      risk: "Medium",
      category: "Transaction Pattern",
    },
    {
      title: "Unusual Transaction Timing",
      description:
        "Transactions at unusual times may require further investigation.",
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
            Analyze transactions using the AEGISAI machine learning model.
          </p>
        </div>
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>AI Fraud Detection</h2>
            <p>
              Submit transaction features to the trained Random Forest model.
            </p>
          </div>
        </div>

        <p>
          The example below is an actual legitimate transaction from the
          credit card dataset. You can also paste another transaction
          containing all 30 required features.
        </p>

        <textarea
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          rows={15}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontFamily: "monospace",
            fontSize: "13px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={analyzeTransaction}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Analyzing..." : "Analyze Transaction"}
        </button>

        {error && (
          <div style={{ color: "red", marginTop: "15px" }}>
            Error: {error}
          </div>
        )}

        {result && (
          <div className="dashboard-box" style={{ marginTop: "20px" }}>
            <h2>Prediction Results</h2>

            <h3>Prediction: {result.prediction}</h3>

            <p>
              Fraud Probability:{" "}
              {(result.fraud_probability * 100).toFixed(2)}%
            </p>

            <p>Risk Score: {result.risk_score}</p>

            <p>Risk Level: {result.risk_level}</p>

            <p>Detection Threshold: {result.threshold}</p>

            <h3
              style={{
                color: result.is_fraud ? "red" : "green",
              }}
            >
              {result.is_fraud
                ? "⚠ Potential Fraud Detected"
                : "✓ Transaction Classified as Legitimate"}
            </h3>

            {saveMessage && (
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: saveMessage.startsWith("✓")
                    ? "green"
                    : "#d97706",
                }}
              >
                {saveMessage}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-box">
        <div className="box-header">
          <div>
            <h2>Example Fraud Risk Patterns</h2>
            <p>
              Illustrative patterns for understanding transaction risks.
            </p>
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