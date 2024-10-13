import React, { useState, useEffect } from "react";
import { getContract } from "../utils";
import './EventList.css'; // Import the CSS file

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const contract = await getContract();
            const eventCount = await contract.currentEventId();
            const eventsList = [];

            for (let i = 1; i <= eventCount; i++) {
                const event = await contract.events(i);
                eventsList.push(event);
            }

            setEvents(eventsList);
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <h2>All Events</h2>
            <div className="event-list">
                {events.map((event, index) => (
                    <div className="event-item" key={index}>
                        <h3>{event.eventName}</h3>
                        <p>{event.eventDate}</p>
                        <p>{event.location}</p>
                        <img className="event-image" src={event.eventImage} alt={event.eventName} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;
