import type { Itinerary, Activity } from '../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  previousItinerary: Itinerary | null;
}

function ActivityCard({ activity }: { activity: Activity }) {
  const isReplaced = activity.replaced;
  const typeColors: Record<string, string> = {
    activity: 'bg-primary/15 text-primary-light border-primary/30',
    food: 'bg-warning/15 text-warning border-warning/30',
    travel: 'bg-accent/15 text-accent border-accent/30',
    rest: 'bg-success/15 text-success border-success/30',
  };

  const typeIcons: Record<string, string> = {
    activity: '🎯',
    food: '🍽️',
    travel: '🚌',
    rest: '💤',
  };

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all ${
        isReplaced
          ? 'border-success/40 bg-success/5 ring-1 ring-success/20'
          : 'border-border bg-surface-light/60 hover:bg-surface-hover/40'
      }`}
      role="article"
      aria-label={`${activity.time} - ${activity.title}`}
    >
      {/* Replaced badge */}
      {isReplaced && (
        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-success text-surface text-xs font-bold">
          ✦ UPDATED
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Time */}
        <div className="text-xs font-mono text-text-muted min-w-[52px] pt-1">{activity.time}</div>

        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center text-sm ${typeColors[activity.type] || ''}`}>
          {typeIcons[activity.type] || '📍'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-tight">{activity.title}</h4>
          <p className="text-xs text-text-muted mt-1 line-clamp-2">{activity.description}</p>

          {/* Replacement info */}
          {isReplaced && activity.original && (
            <div className="mt-2 text-xs">
              <span className="line-through text-danger/70">❌ {activity.original}</span>
              {activity.replacementReason && (
                <span className="block text-success/80 mt-0.5">↳ {activity.replacementReason}</span>
              )}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-2">
            {activity.location && (
              <span className="text-xs text-text-muted">📍 {activity.location}</span>
            )}
            {activity.estimatedCost > 0 && (
              <span className="text-xs font-medium text-accent">₹{activity.estimatedCost.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryView({ itinerary, previousItinerary }: ItineraryViewProps) {
  return (
    <section aria-label="Your Itinerary" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {itinerary.destination}
            <span className="text-text-muted font-normal text-base ml-2">
              {itinerary.totalDays} days
            </span>
          </h2>
          {previousItinerary && (
            <p className="text-xs text-success mt-0.5 font-medium">
              ✦ Itinerary updated (v{itinerary.version}) — changes highlighted below
            </p>
          )}
        </div>
        <span className="text-sm text-text-muted">
          v{itinerary.version}
        </span>
      </div>

      {/* Days */}
      {itinerary.days.map(day => (
        <div key={day.day} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
              {day.day}
            </div>
            <div>
              <h3 className="font-bold text-lg">Day {day.day}</h3>
              <p className="text-xs text-text-muted">{day.theme} • ~₹{day.estimatedCost.toLocaleString()}</p>
            </div>
          </div>

          <div className="ml-5 border-l-2 border-border pl-5 space-y-3">
            {day.activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
