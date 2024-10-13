import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <h2>NFT Ticketing System</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create">Create Event</Link></li>
                <li><Link to="/buy">Buy Ticket</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/attendance">Attendance</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
