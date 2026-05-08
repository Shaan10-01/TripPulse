import type { Itinerary, Activity } from '../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  previousItinerary: Itinerary | null;
}

function getMapsUrl(location: string, destination: string): string {
  const query = encodeURIComponent(`${location}, ${destination}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function ActivityCard({ activity, destination }: { activity: Activity; destination: string }) {
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
      className={`relative p-4 rounded-2xl border-2 transition-all ${
        isReplaced
          ? 'border-success/50 bg-success/5 ring-1 ring-success/20'
          : 'border-border bg-surface-light/50 hover:bg-surface-hover/30 hover:border-border'
      }`}
      role="article"
      aria-label={`${activity.time} - ${activity.title}`}
    >
      {/* Replaced badge */}
      {isReplaced && (
        <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-success text-surface text-xs font-bold tracking-wide">
          ✦ AI UPDATED
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Time */}
        <div className="text-xs font-mono text-text-muted/70 min-w-[52px] pt-1.5">{activity.time}</div>

        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center text-base ${typeColors[activity.type] || ''}`}>
          {typeIcons[activity.type] || '📍'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-snug">{activity.title}</h4>
          <p className="text-xs text-text-muted mt-1.5 leading-relaxed">{activity.description}</p>

          {/* Replacement info */}
          {isReplaced && activity.original && (
            <div className="mt-2.5 p-2 rounded-lg bg-surface/50 text-xs space-y-1">
              <span className="line-through text-danger/70">❌ {activity.original}</span>
              {activity.replacementReason && (
                <span className="block text-success/80">↳ {activity.replacementReason}</span>
              )}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-3 mt-2.5">
            {activity.location && (
              <a
                href={getMapsUrl(activity.location, destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-dark hover:underline transition-colors"
                aria-label={`View ${activity.location} on Google Maps`}
              >
                📍 {activity.location}
                <span className="text-[10px] opacity-60">↗</span>
              </a>
            )}
            {activity.estimatedCost > 0 && (
              <span className="text-xs font-semibold text-primary-light bg-primary/10 px-2 py-0.5 rounded-full">
                ₹{activity.estimatedCost.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryView({ itinerary, previousItinerary }: ItineraryViewProps) {
  return (
    <section aria-label="Your Itinerary" className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            📍 {itinerary.destination}
            <span className="text-text-muted font-normal text-base ml-3">
              {itinerary.totalDays} days
            </span>
          </h2>
          {previousItinerary && (
            <p className="text-sm text-success mt-1 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Itinerary updated (v{itinerary.version}) — changes highlighted below
            </p>
          )}
        </div>
        <span className="text-xs text-text-muted bg-surface-light px-3 py-1.5 rounded-full border border-border font-mono">
          v{itinerary.version}
        </span>
      </div>

      {/* Days */}
      {itinerary.days.map(day => {
        const hasChanges = day.activities.some(a => a.replaced);
        return (
          <div key={day.day} className="space-y-4">
            <div className={`flex items-center gap-4 p-3 rounded-2xl ${hasChanges ? 'bg-success/5 border border-success/20' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-base font-extrabold text-white shadow-lg shadow-primary/20">
                {day.day}
              </div>
              <div>
                <h3 className="font-bold text-lg">Day {day.day}</h3>
                <p className="text-xs text-text-muted">{day.theme} • ₹{day.estimatedCost.toLocaleString()}</p>
              </div>
              {hasChanges && (
                <span className="ml-auto text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  ⚡ Modified
                </span>
              )}
            </div>

            <div className="ml-6 border-l-2 border-border/50 pl-6 space-y-3">
              {day.activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} destination={itinerary.destination} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
