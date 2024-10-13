import React, { useState, useEffect } from "react";
import { getContract } from "../utils"; // Ensure this utility works correctly.

const BuyTicket = () => {
    const [events, setEvents] = useState([]); // Store fetched events
    const [selectedEventId, setSelectedEventId] = useState(""); // Track selected event ID
    const [loading, setLoading] = useState(false); // Track loading state

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const contract = await getContract();
                const eventCount = await contract.currentEventId(); // Get the total number of events
                const eventsList = [];

                // Loop through all events and store them in an array
                for (let i = 1; i <= eventCount; i++) {
                    try {
                        const event = await contract.events(i); // Fetch event details
                        console.log(`Fetched Event ${i}:`, event);
                        
                        // Format event with relevant details
                        const formattedEvent = {
                            eventId: i, // Add event ID
                            eventName: event.eventName, // Extract event name
                        };

                        eventsList.push(formattedEvent); // Add to events list
                    } catch (err) {
                        console.error(`Error fetching event ${i}:`, err);
                    }
                }

                console.log("Events List:", eventsList);
                setEvents(eventsList); // Update state with events
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, []);

    // Function to handle ticket purchase
    const buyTicket = async () => {
        try {
            if (!selectedEventId) {
                alert("Please select a valid event.");
                return;
            }

            const contract = await getContract();
            const eventID = Number(selectedEventId); // Convert to number

            console.log("Selected Event ID:", eventID);

            setLoading(true); // Start loading
            const txn = await contract.buyTicket(eventID); // Call the smart contract
            await txn.wait(); // Wait for the transaction to complete
            alert("Ticket bought successfully!");
        } catch (err) {
            console.error("Error buying ticket:", err);
            alert("Failed to buy ticket. Please check the console for details.");
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div>
            <h2>Buy Ticket</h2>
            <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
            >
                <option value="">Select an event</option> {/* Default option */}
                {events.map((event) => {
                    console.log(`Event Option: ${event.eventId} - ${event.eventName}`);
                    return (
                        <option key={event.eventId} value={event.eventId}>
                            {event.eventName}
                        </option>
                    );
                })}
            </select>

            <button onClick={buyTicket} disabled={loading || !selectedEventId}>
                {loading ? "Buying..." : "Buy Ticket"}
            </button>
        </div>
    );
};

export default BuyTicket;
