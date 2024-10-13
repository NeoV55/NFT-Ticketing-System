// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicketSystem is ERC721, Ownable {
    uint256 public currentTicketId;
    uint256 public currentEventId;

    enum EventStatus {
        Active,
        SoldOut,
        Completed
    } // Event status management

    struct Event {
        string eventName;
        string eventDate;
        string location;
        string eventImage; // This stores the image link as a string.
        uint256 totalTickets;
        address eventOwner;
        uint256 attendanceCount;
        EventStatus status; // Status to track if the event is sold out or completed
    }

    struct Ticket {
        uint256 eventId;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    mapping(address => uint256[]) public userEvents;

    event EventCreated(uint256 eventId, string eventName);
    event TicketBought(uint256 ticketId, uint256 eventId, address buyer);
    event TicketTransferred(uint256 ticketId, address from, address to);
    event AttendanceVerified(uint256 eventId, uint256 attendeeCount);
    event EventStatusUpdated(uint256 eventId, EventStatus status);

    constructor(address _owner) ERC721("EventTicket", "ETK") Ownable(_owner) {}

    function createEvent(
        string memory _eventName,
        string memory _eventDate,
        string memory _location,
        string memory _eventImage,
        uint256 _totalTickets
    ) public {
        currentEventId++;
        events[currentEventId] = Event(
            _eventName,
            _eventDate,
            _location,
            _eventImage,
            _totalTickets,
            msg.sender,
            0,
            EventStatus.Active // Set event to Active upon creation
        );
        userEvents[msg.sender].push(currentEventId);
        emit EventCreated(currentEventId, _eventName);
    }

    function buyTicket(uint256 _eventId) public {
        require(
            events[_eventId].status == EventStatus.Active,
            "Event is not active"
        );
        require(events[_eventId].totalTickets > 0, "No tickets left");

        currentTicketId++;
        tickets[currentTicketId] = Ticket(_eventId);
        _safeMint(msg.sender, currentTicketId);
        userTickets[msg.sender].push(currentTicketId);

        events[_eventId].totalTickets--;
        emit TicketBought(currentTicketId, _eventId, msg.sender);

        // Update event status if sold out
        if (events[_eventId].totalTickets == 0) {
            events[_eventId].status = EventStatus.SoldOut;
            emit EventStatusUpdated(_eventId, EventStatus.SoldOut); // Emit status update event
        }
    }

    function transferTicket(uint256 _ticketId, address _to) public {
        require(
            ownerOf(_ticketId) == msg.sender,
            "Not the owner of the ticket"
        );
        _transfer(msg.sender, _to, _ticketId);

        userTickets[_to].push(_ticketId);
        emit TicketTransferred(_ticketId, msg.sender, _to);
    }

    function verifyAttendance(uint256 _eventId) public {
        require(
            events[_eventId].eventOwner == msg.sender,
            "Not the event owner"
        );
        events[_eventId].attendanceCount++;
        emit AttendanceVerified(_eventId, events[_eventId].attendanceCount);
    }

    function finalizeEvent(uint256 _eventId) public {
        require(
            events[_eventId].eventOwner == msg.sender,
            "Not the event owner"
        );
        require(
            events[_eventId].status == EventStatus.Active,
            "Event already finalized"
        );
        events[_eventId].status = EventStatus.Completed;
        emit EventStatusUpdated(_eventId, EventStatus.Completed); // Emit status update event
    }

    function getUserEvents(
        address _user
    ) public view returns (uint256[] memory) {
        return userEvents[_user];
    }

    function getUserTickets(
        address _user
    ) public view returns (uint256[] memory) {
        return userTickets[_user];
    }

    function getRemainingTickets(
        uint256 _eventId
    ) public view returns (uint256) {
        return events[_eventId].totalTickets;
    }
}
