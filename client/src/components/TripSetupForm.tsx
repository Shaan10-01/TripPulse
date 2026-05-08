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
    <form onSubmit={handleSubmit} className="space-y-10" aria-label="Trip setup form">
      {/* Hero */}
      <div className="text-center space-y-4 pb-4">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Where to next? <span className="inline-block animate-bounce">✈️</span>
        </h2>
        <p className="text-text-muted max-w-lg mx-auto text-base sm:text-lg">
          Tell us about your dream trip. Our AI copilot will craft the perfect itinerary — and adapt it in real time.
        </p>
      </div>

      {/* Destination */}
      <div className="space-y-3">
        <label htmlFor="destination" className="block text-xs font-semibold text-text-muted uppercase tracking-widest">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="e.g. Manali, Goa, Tokyo..."
          required
          className="w-full px-5 py-4 rounded-2xl bg-surface-light border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all text-lg placeholder:text-text-muted/40"
          aria-required="true"
        />
      </div>

      {/* Budget + Duration + Travelers row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label htmlFor="budget" className="block text-xs font-semibold text-text-muted uppercase tracking-widest">
            Budget
          </label>
          <div className="flex items-center gap-2">
            <select
              id="currency"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              aria-label="Currency"
              className="px-3 py-4 rounded-2xl bg-surface-light border border-border focus:border-primary outline-none text-sm font-medium"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
            <input
              id="budget"
              type="number"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              min={500}
              className="flex-1 px-4 py-4 rounded-2xl bg-surface-light border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="duration" className="block text-xs font-semibold text-text-muted uppercase tracking-widest">
            Duration
          </label>
          <div className="flex items-center gap-4 bg-surface-light border border-border rounded-2xl px-4 py-3.5">
            <input
              id="duration"
              type="range"
              min={1}
              max={14}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xl font-bold text-primary min-w-[3ch] text-center">{duration}<span className="text-xs font-normal text-text-muted ml-0.5">d</span></span>
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="travelers" className="block text-xs font-semibold text-text-muted uppercase tracking-widest">
            Travelers
          </label>
          <div className="flex items-center gap-4 bg-surface-light border border-border rounded-2xl px-4 py-3.5">
            <input
              id="travelers"
              type="range"
              min={1}
              max={10}
              value={travelers}
              onChange={e => setTravelers(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xl font-bold text-primary min-w-[3ch] text-center">{travelers}<span className="text-xs font-normal text-text-muted ml-0.5">👤</span></span>
          </div>
        </div>
      </div>

      {/* Travel Style */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Travel Style</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Travel style">
          {TRAVEL_STYLES.map(style => (
            <button
              key={style.value}
              type="button"
              role="radio"
              aria-checked={travelStyle === style.value}
              onClick={() => setTravelStyle(style.value)}
              className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 transition-all text-sm font-semibold ${
                travelStyle === style.value
                  ? 'border-primary bg-primary/10 text-primary-light shadow-lg shadow-primary/10'
                  : 'border-border bg-surface-light hover:border-primary/40 hover:bg-surface-hover text-text-muted'
              }`}
            >
              <span className="text-xl">{style.icon}</span>
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Constraints & Preferences</p>
        <div className="flex flex-wrap gap-2.5">
          {CONSTRAINT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              type="button"
              role="switch"
              aria-checked={constraints[opt.key]}
              aria-label={opt.label}
              onClick={() => toggleConstraint(opt.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                constraints[opt.key]
                  ? 'border-accent bg-accent/10 text-accent shadow-md shadow-accent/10'
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
        className="w-full py-4.5 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98] cursor-pointer"
      >
        ✦ Generate AI Itinerary
      </button>
    </form>
  );
}
