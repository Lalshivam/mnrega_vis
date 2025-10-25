import React from "react";
import BiharDashboard from "./components/BiharDashboard";

function App() {
  return (
    <div>
      <header style={{ textAlign: "center", background: "#4caf50", color: "white", padding: "1rem" }}>
        <h1>MGNREGA Bihar Dashboard</h1>
      </header>
      <main>
        <BiharDashboard />
      </main>
    </div>
  );
}

export default App;
