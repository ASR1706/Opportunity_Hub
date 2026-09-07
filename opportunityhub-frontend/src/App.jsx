import { useState } from "react";

import Dashboard from "./Dashboard";
import Opportunities from "./Opportunities";
import Applications from "./Applications";
import Profile from "./Profile";
import SavedOpportunities from "./SavedOpportunities";
import Recommendations from "./Recommendations";
import DeadlineAlerts from "./DeadlineAlerts";

import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // ROUTES
  // =====================================================

  if (window.location.pathname === "/dashboard") return <Dashboard />;
  if (window.location.pathname === "/opportunities") return <Opportunities />;
  if (window.location.pathname === "/applications") return <Applications />;
  if (window.location.pathname === "/profile") return <Profile />;
  if (window.location.pathname === "/saved") return <SavedOpportunities />;
  if (window.location.pathname === "/recommendations") return <Recommendations />;
  if (window.location.pathname === "/deadlines") return <DeadlineAlerts />;

  // =====================================================
  // LOGIN / REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    const url = isLogin
        ? "https://opportunityhub-backend-shiw.onrender.com/api/auth/login"
        : "https://opportunityhub-backend-shiw.onrender.com/api/auth/register";

    const data = isLogin
        ? { email, password }
        : { name, email, password };

    try {
      setLoading(true);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      if (response.ok && isLogin) {
        console.log("Login response:", result);

        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        if (result.role) {
          localStorage.setItem("role", result.role);
        }

        // IMPORTANT: keep user-data isolation.
        // The backend returns the logged-in user's database id as "id".
        if (result.id !== undefined && result.id !== null) {
          localStorage.setItem("userId", String(result.id));
        } else {
          localStorage.removeItem("userId");
        }

        localStorage.setItem("email", email);

        alert("Login successful");
        window.location.href = "/dashboard";
        return;
      }

      // =================================================
      // REGISTRATION SUCCESS
      // =================================================

      if (response.ok && !isLogin) {
        alert(
            typeof result === "string"
                ? result
                : result.message || "Student registered successfully"
        );

        setIsLogin(true);
        setName("");
        setPassword("");
        return;
      }

      // =================================================
      // ERROR
      // =================================================

      alert(
          typeof result === "string"
              ? result
              : result.message || "Something went wrong"
      );
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGIN / REGISTER UI
  // =====================================================

  return (
      <div className="auth-page">
        <div className="background-shape shape-one"></div>
        <div className="background-shape shape-two"></div>
        <div className="background-shape shape-three"></div>

        <div className="auth-container">
          {/* LEFT BRANDING SECTION */}
          <div className="auth-brand">
            <div className="brand-logo">
              <span>O</span>
            </div>

            <h1>
              Opportunity<span>Hub</span>
            </h1>

            <p className="brand-tagline">
              Your career journey starts here.
            </p>

            <div className="brand-features">
              <div className="feature">
                <span>🔎</span>
                <div>
                  <strong>Find Opportunities</strong>
                  <small>Discover jobs and internships</small>
                </div>
              </div>

              <div className="feature">
                <span>📌</span>
                <div>
                  <strong>Build Your Career</strong>
                  <small>Take the next step toward your goals</small>
                </div>
              </div>

              <div className="feature">
                <span>🎯</span>
                <div>
                  <strong>One Place, Every Opportunity</strong>
                  <small>Manage your career journey easily</small>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN CARD */}
          <div className="auth-card">
            <div className="mobile-logo">
              <div className="brand-logo">
                <span>O</span>
              </div>
            </div>

            <div className="auth-heading">
              <h2>
                {isLogin ? "Welcome back!" : "Create your account"}
              </h2>

              <p>
                {isLogin
                    ? "Login to continue your career journey"
                    : "Create your OpportunityHub account and start discovering opportunities."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
              )}

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {isLogin && (
                  <div className="forgot-password">
                    🔐 Your information is securely protected.
                  </div>
              )}

              <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
              >
                {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Please wait...</span>
                    </>
                ) : (
                    <>
                      <span>{isLogin ? "Login" : "Create Account"}</span>
                      <span>→</span>
                    </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <p className="switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword("");
                  }}
              >
                {isLogin ? "Create Account" : "Login"}
              </button>
            </p>
          </div>
        </div>

        <div className="auth-footer">
          © 2026 OpportunityHub · Your future starts here 🚀
        </div>
      </div>
  );
}

export default App;
