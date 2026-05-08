import { useState } from 'react';
import type { TripSetup, TripConstraints, TravelStyle } from '../types';

interface TripSetupFormProps {
  onSubmit: (setup: TripSetup) => void;
}

const TRAVEL_STYLES: { value: TravelStyle; label: string; icon: string }[] = [
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
  { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
  { value: 'backpacker', label: 'Backpacker', icon: '🎒' },
  { value: 'luxury', label: 'Luxury', icon: '💎' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
];

const CONSTRAINT_OPTIONS: { key: keyof TripConstraints; label: string; icon: string }[] = [
  { key: 'avoidCrowds', label: 'Avoid Crowds', icon: '🚶' },
  { key: 'budgetSensitive', label: 'Budget Sensitive', icon: '💰' },
  { key: 'wheelchairFriendly', label: 'Wheelchair Friendly', icon: '♿' },
  { key: 'rainSafe', label: 'Rain-Safe Only', icon: '☂️' },
  { key: 'familyFriendly', label: 'Family Friendly', icon: '👶' },
  { key: 'adventureHeavy', label: 'Adventure Heavy', icon: '⛷️' },
  { key: 'vegetarianOnly', label: 'Vegetarian Food', icon: '🥬' },
];

export default function TripSetupForm({ onSubmit }: TripSetupFormProps) {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState(15000);
  const [currency, setCurrency] = useState('INR');
  const [duration, setDuration] = useState(3);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('cultural');
  const [travelers, setTravelers] = useState(2);
  const [constraints, setConstraints] = useState<TripConstraints>({
    avoidCrowds: false,
    budgetSensitive: false,
    wheelchairFriendly: false,
    rainSafe: false,
    familyFriendly: false,
    adventureHeavy: false,
    vegetarianOnly: false,
  });

  const toggleConstraint = (key: keyof TripConstraints) => {
    setConstraints(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination, budget, currency, duration, travelStyle, travelers, constraints });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="Trip setup form">
      {/* Hero */}
      <div className="text-center space-y-3 pb-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Where to next? <span className="inline-block animate-bounce">✈️</span>
        </h2>
        <p className="text-text-muted max-w-lg mx-auto">
          Tell us about your dream trip. Our AI copilot will craft the perfect itinerary — and adapt it in real time.
        </p>
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label htmlFor="destination" className="block text-sm font-semibold text-text-muted uppercase tracking-wider">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="e.g. Manali, Goa, Tokyo..."
          required
          className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-lg placeholder:text-text-muted/50"
          aria-required="true"
        />
      </div>

      {/* Budget + Duration + Travelers row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="budget" className="block text-sm font-semibold text-text-muted uppercase tracking-wider">
            Budget
          </label>
          <div className="flex items-center gap-2">
            <select
              id="currency"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              aria-label="Currency"
              className="px-2 py-3 rounded-xl bg-surface-light border border-border focus:border-primary outline-none text-sm"
            >
              <option value="INR">₹</option>
              <option value="USD">$</option>
              <option value="EUR">€</option>
              <option value="GBP">£</option>
            </select>
            <input
              id="budget"
              type="number"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              min={500}
              className="flex-1 px-4 py-3 rounded-xl bg-surface-light border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="block text-sm font-semibold text-text-muted uppercase tracking-wider">
            Duration (days)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="duration"
              type="range"
              min={1}
              max={14}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-lg font-bold text-primary min-w-[2ch] text-center">{duration}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="travelers" className="block text-sm font-semibold text-text-muted uppercase tracking-wider">
            Travelers
          </label>
          <div className="flex items-center gap-3">
            <input
              id="travelers"
              type="range"
              min={1}
              max={10}
              value={travelers}
              onChange={e => setTravelers(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-lg font-bold text-primary min-w-[2ch] text-center">{travelers}</span>
          </div>
        </div>
      </div>

      {/* Travel Style */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Travel Style</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Travel style">
          {TRAVEL_STYLES.map(style => (
            <button
              key={style.value}
              type="button"
              role="radio"
              aria-checked={travelStyle === style.value}
              onClick={() => setTravelStyle(style.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                travelStyle === style.value
                  ? 'border-primary bg-primary/10 text-primary-light ring-2 ring-primary/30'
                  : 'border-border bg-surface-light hover:border-primary/50 text-text-muted'
              }`}
            >
              <span className="text-lg">{style.icon}</span>
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-text-muted uppercase tracking-wider">Constraints & Preferences</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CONSTRAINT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              type="button"
              role="switch"
              aria-checked={constraints[opt.key]}
              aria-label={opt.label}
              onClick={() => toggleConstraint(opt.key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                constraints[opt.key]
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-light text-text-muted hover:border-accent/40'
              }`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="generate-itinerary-btn"
        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
      >
        ✦ Generate AI Itinerary
      </button>
    </form>
  );
}
