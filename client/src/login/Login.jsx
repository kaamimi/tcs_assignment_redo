import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (username === "" || password === "") {
      setError("Please enter username and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      onLogin(data.token);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="left"></div>

      <div className="right">
        <h1 className="title">Ultimatix</h1>

        <div className="form-area">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="proceed" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Proceed"}
            </button>

            <a href="#" className="forgot">
              Forgot Account Details?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;