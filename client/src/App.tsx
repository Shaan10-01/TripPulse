import { useState } from 'react';
import type { TripSetup, Itinerary, BudgetSummary } from './types';
import { generateItinerary, replanItinerary } from './api';
import type { Disruption } from './types';
import Header from './components/Header';
import TripSetupForm from './components/TripSetupForm';
import ItineraryView from './components/ItineraryView';
import DisruptionPanel from './components/DisruptionPanel';
import BudgetPanel from './components/BudgetPanel';
import LoadingOverlay from './components/LoadingOverlay';

type AppPhase = 'setup' | 'loading' | 'itinerary';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('setup');
  const [tripSetup, setTripSetup] = useState<TripSetup | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [originalBudget, setOriginalBudget] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('Generating your itinerary...');
  const [previousItinerary, setPreviousItinerary] = useState<Itinerary | null>(null);

  const handleGenerate = async (setup: TripSetup) => {
    setTripSetup(setup);
    setOriginalBudget(setup.budget);
    setPhase('loading');
    setLoadingMsg('🧠 AI is crafting your perfect itinerary...');
    setError(null);

    try {
      const result = await generateItinerary({ tripSetup: setup });
      setItinerary(result);
      setPreviousItinerary(null);
      setPhase('itinerary');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('setup');
    }
  };

  const handleDisruption = async (disruption: Disruption, affectedDay?: number) => {
    if (!itinerary || !tripSetup) return;
    setLoadingMsg(`⚡ Replanning for: ${disruption.label}...`);
    setPhase('loading');
    setError(null);

    try {
      const result = await replanItinerary({
        itinerary,
        disruption,
        tripSetup,
        affectedDay,
      });
      setPreviousItinerary(itinerary);
      setItinerary(result);
      setPhase('itinerary');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Replanning failed');
      setPhase('itinerary');
    }
  };

  const handleReset = () => {
    setPhase('setup');
    setItinerary(null);
    setPreviousItinerary(null);
    setTripSetup(null);
    setError(null);
  };

  const budget: BudgetSummary | null = itinerary
    ? {
        originalBudget,
        currentEstimate: itinerary.totalEstimatedCost,
        saved: originalBudget - itinerary.totalEstimatedCost,
        currency: itinerary.currency,
      }
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <Header onReset={phase === 'itinerary' ? handleReset : undefined} />

      {error && (
        <div
          role="alert"
          className="mx-auto max-w-4xl mt-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm"
        >
          ⚠️ {error}
        </div>
      )}

      {phase === 'loading' && <LoadingOverlay message={loadingMsg} />}

      {phase === 'setup' && (
        <main className="mx-auto max-w-3xl px-4 py-8">
          <TripSetupForm onSubmit={handleGenerate} />
        </main>
      )}

      {phase === 'itinerary' && itinerary && (
        <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            <ItineraryView
              itinerary={itinerary}
              previousItinerary={previousItinerary}
            />
          </div>
          <aside className="space-y-6">
            {budget && <BudgetPanel budget={budget} />}
            <DisruptionPanel
              onDisrupt={handleDisruption}
              totalDays={itinerary.totalDays}
            />
          </aside>
        </main>
      )}
    </div>
  );
}
