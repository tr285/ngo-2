import { Calendar, MapPin, Users } from 'lucide-react';

const UpcomingEvents = ({ events }) => (
  <div className="card">
    <div className="mb-4">
      <h3 className="font-semibold">Upcoming Events</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Scheduled NGO events and drives
      </p>
    </div>
    <ul className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id || event._id}
          className="rounded-lg border border-gray-100 p-4 dark:border-gray-800"
        >
          <h4 className="font-medium">{event.title}</h4>
          <div className="mt-2 space-y-1.5">
            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {event.date}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {event.location}
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-3.5 w-3.5 shrink-0" />
              {event.volunteers} volunteers registered
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingEvents;
