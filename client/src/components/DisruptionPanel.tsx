import { useState } from 'react';
import { DISRUPTIONS } from '../types';
import type { Disruption } from '../types';

interface DisruptionPanelProps {
  onDisrupt: (disruption: Disruption, affectedDay?: number) => void;
  totalDays: number;
}

export default function DisruptionPanel({ onDisrupt, totalDays }: DisruptionPanelProps) {
  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);

  return (
    <section aria-label="Disruption simulator" className="rounded-2xl border-2 border-border bg-surface-light/60 p-6 space-y-5">
      <div>
        <h3 className="font-bold text-base flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-danger/15 flex items-center justify-center text-sm">⚡</span>
          Disruption Engine
        </h3>
        <p className="text-xs text-text-muted mt-2 leading-relaxed">
          Simulate real-time disruptions. AI will intelligently replan only the affected sections.
        </p>
      </div>

      {/* Day selector */}
      <div className="space-y-2">
        <label htmlFor="affected-day" className="text-xs font-semibold text-text-muted uppercase tracking-widest">
          Affected Day
        </label>
        <select
          id="affected-day"
          value={selectedDay ?? ''}
          onChange={e => setSelectedDay(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-border text-sm focus:border-primary outline-none transition-colors"
        >
          <option value="">All days</option>
          {Array.from({ length: totalDays }, (_, i) => (
            <option key={i + 1} value={i + 1}>Day {i + 1}</option>
          ))}
        </select>
      </div>

      {/* Disruption buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {DISRUPTIONS.map(d => (
          <button
            key={d.type}
            onClick={() => onDisrupt(d, selectedDay)}
            aria-label={`Simulate ${d.label}`}
            title={d.description}
            className="flex items-center gap-2 px-3 py-3 rounded-xl border-2 border-border bg-surface hover:bg-danger/10 hover:border-danger/40 transition-all text-sm group cursor-pointer"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{d.icon}</span>
            <span className="text-xs font-semibold text-text-muted group-hover:text-danger transition-colors">{d.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
