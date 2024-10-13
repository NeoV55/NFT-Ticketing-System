import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Updated import statement
import { getContract } from "../utils";

const Attendance = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const contract = await getContract();
            const eventCount = await contract.currentEventId();
            const eventsList = [];

            for (let i = 1; i <= eventCount; i++) {
                try {
                    const event = await contract.events(i);
                    eventsList.push({ id: i, name: event.eventName });
                } catch (err) {
                    console.error(`Error fetching event ${i}:`, err);
                }
            }

            setEvents(eventsList);
        };

        fetchEvents();
    }, []);

    const verifyAttendance = async (eventId) => {
        try {
            const contract = await getContract();
            const txn = await contract.verifyAttendance(eventId);
            await txn.wait(); // Wait for the transaction to be mined
            alert("Attendance verified!");
        } catch (err) {
            console.error("Error verifying attendance:", err);
            alert("Failed to verify attendance.");
        }
    };

    return (
        <div>
            <h2>Verify Attendance</h2>
            {events.map((event) => (
                <div key={event.id}>
                    <h3>{event.name}</h3>
                    <QRCodeCanvas
                        value={JSON.stringify({ eventId: event.id })}
                        size={128}
                        onClick={() => verifyAttendance(event.id)} // Trigger verification on click (or any event)
                    />
                </div>
            ))}
        </div>
    );
};

export default Attendance;
