import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard({ token, onLogout }) {
  const tabs = ["Home", "About", "CEO Connect", "Values and Ethics", "Unit News"];
  const apps = ["Timesheet", "iEvolve", "2Office", "My Allocation"];

  const [activeTab, setActiveTab] = useState("Home");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        const response = await fetch("http://localhost:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (isActive) {
            setError(data.error || "Could not load the dashboard.");
          }
          return;
        }

        if (isActive) {
          setMessage(data.message);
        }
      } catch {
        if (isActive) {
          setError("Could not connect to the server. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [token]);

  if (isLoading) {
    return <main className="body">Checking your login...</main>;
  }

  if (error) {
    return (
      <main className="body">
        <p role="alert">{error}</p>
        <button className="logout" onClick={onLogout}>
          Return to login
        </button>
      </main>
    );
  }

  return (
    <div>
      <div className="header">
        <h1 className="header-title">Ultimatix</h1>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="body">
        <h2 className="hero">{message}</h2>
        <p className="date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>

        <div className="content-row">
          <div className="buttons">
            {apps.map((app) => (
              <button key={app} className="button">
                {app}
              </button>
            ))}
          </div>

          <div className="news-section">
            <h3>News</h3>
            <div className="news-content">
              <p>Latest news and updates will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;