import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      navigate("/", { replace: true });

    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-glow glow-one"></div>
      <div className="login-glow glow-two"></div>

      <div className="login-container">

        <div className="login-brand">

          <div className="brand-icon">
            🛡
          </div>

          <h1>AEGIS<span>AI</span></h1>

          <p>INTELLIGENT FRAUD DETECTION PLATFORM</p>

        </div>

        <div className="login-card">

          <div className="login-heading">
            <span className="welcome-tag">WELCOME BACK</span>

            <h2>Admin Login</h2>

            <p>
              Sign in to access your fraud detection dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="login-input-group">

              <label>Email Address</label>

              <div className="login-input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

            </div>

            <div className="login-input-group">

              <label>Password</label>

              <div className="login-input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
              {!loading && <span> →</span>}
            </button>

          </form>

          <div className="login-security">
            <span>🔐</span>
            Secure Admin Authentication
          </div>

        </div>

        <div className="login-footer">
          <p>© 2026 AEGISAI. All rights reserved.</p>
          <span>AI-POWERED FINANCIAL SECURITY</span>
        </div>

      </div>

    </div>
  );
}

export default Login;