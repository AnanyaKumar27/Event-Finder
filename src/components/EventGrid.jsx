import EventCard from "./EventCard";

export default function EventGrid({ events, registered, handleRegister }) {
  if (events.length === 0) return <p>No events found</p>;

  return (
    <div className="grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isRegistered={registered[event.id]}
          onRegister={() => handleRegister(event.id)}
        />
      ))}
    </div>
  );
}