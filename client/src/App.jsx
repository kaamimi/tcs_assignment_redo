import { useState } from "react";
import Login from "./login/Login";
import Dashboard from "./dashboard/Dashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || ""
  );

  function handleLogin(authToken) {
    sessionStorage.setItem("token", authToken);
    setToken(authToken);
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    setToken("");
  }

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
}

export default App;