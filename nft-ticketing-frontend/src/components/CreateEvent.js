import React, { useState } from "react";
import { getContract } from "../utils";

const CreateEvent = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [eventImage, setEventImage] = useState("");
    const [totalTickets, setTotalTickets] = useState(0);

    const createEvent = async (e) => {
        e.preventDefault();
        const contract = await getContract();
        await contract.createEvent(eventName, eventDate, location, eventImage, totalTickets);
        alert("Event created!");
    };

    return (
        <form onSubmit={createEvent}>
            <h2>Create Event</h2>
            <input type="text" placeholder="Event Name" onChange={(e) => setEventName(e.target.value)} required />
            <input type="text" placeholder="Event Date" onChange={(e) => setEventDate(e.target.value)} required />
            <input type="text" placeholder="Location" onChange={(e) => setLocation(e.target.value)} required />
            <input type="text" placeholder="Image URL" onChange={(e) => setEventImage(e.target.value)} required />
            <input type="number" placeholder="Total Tickets" onChange={(e) => setTotalTickets(e.target.value)} required />
            <button type="submit">Create Event</button>
        </form>
    );
};

export default CreateEvent;
