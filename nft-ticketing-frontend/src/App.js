import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventList from "./components/EventList";
import CreateEvent from "./components/CreateEvent";
import BuyTicket from "./components/BuyTicket";
import Dashboard from "./components/Dashboard";
import Attendance from "./components/Attendance";
import { connectWallet } from "./utils";
import './styles.css';

const App = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const { address } = await connectWallet();
        setAccount(address);
      } catch (err) {
        console.error("Failed to connect wallet:", err);
        setError("Failed to connect wallet. Please try again.");
      }
    };

    initializeWallet();
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="container">
        <h1>NFT Ticketing DApp</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {account ? <p>Connected as: {account}</p> : <p>Not connected</p>}

        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/buy" element={<BuyTicket />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
