import React, { useState, useEffect } from "react";
import { getContract, connectWallet } from "../utils";

const Dashboard = () => {
    const [eventsCreated, setEventsCreated] = useState([]);
    const [ticketsBought, setTicketsBought] = useState([]);
    const [eventDetails, setEventDetails] = useState({}); // State to hold event details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Ensure wallet is connected
                const { signer } = await connectWallet(); // Connect wallet

                const contract = await getContract(); // Get contract with signer
                const userAddress = await signer.getAddress(); // Get user address

                const createdEvents = await contract.getUserEvents(userAddress);
                const boughtTickets = await contract.getUserTickets(userAddress);

                setEventsCreated(createdEvents);
                setTicketsBought(boughtTickets);

                // Fetch event details for each created event
                const details = {};
                for (const eventId of createdEvents) {
                    const event = await contract.events(eventId);
                    details[eventId] = event.eventName; // Store event name by ID
                }
                setEventDetails(details); // Update event details state
            } catch (err) {
                setError(`Error fetching user data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Your Dashboard</h2>
            <h3>Events Created</h3>
            <ul>
                {eventsCreated.map((eventId) => (
                    <li key={eventId}>
                        Event ID: {eventId.toString()} - {eventDetails[eventId] || "Loading..."}
                    </li>
                ))}
            </ul>
            <h3>Tickets Bought</h3>
            <ul>
                {ticketsBought.map((ticketId) => (
                    <li key={ticketId}>Ticket ID: {ticketId.toString()}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
