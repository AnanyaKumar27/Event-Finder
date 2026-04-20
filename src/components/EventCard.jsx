export default function EventCard({ event, isRegistered, onRegister }) {
    const isPast = event.date < new Date();

    return (
        <div className="card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>

            <p> {event.date}</p>
            <p>📍 {event.location}</p>

            <button
                disabled={isPast}
                onClick={onRegister}
                className={isRegistered ? "registered" : ""}
            >
                {isPast ? "Ended" : isRegistered ? "Registered" : "Register"}
            </button>
        </div>
    );
}