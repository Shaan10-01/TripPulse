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
    <section aria-label="Disruption simulator" className="rounded-2xl border border-border bg-surface-light/60 p-5 space-y-4">
      <div>
        <h3 className="font-bold text-base flex items-center gap-2">
          <span className="text-lg">⚡</span> Disruption Engine
        </h3>
        <p className="text-xs text-text-muted mt-1">Simulate real-time disruptions. AI will replan dynamically.</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="affected-day" className="text-xs font-medium text-text-muted">Affected Day (optional)</label>
        <select id="affected-day" value={selectedDay ?? ''} onChange={e => setSelectedDay(e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm focus:border-primary outline-none">
          <option value="">All days</option>
          {Array.from({ length: totalDays }, (_, i) => (<option key={i + 1} value={i + 1}>Day {i + 1}</option>))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {DISRUPTIONS.map(d => (
          <button key={d.type} onClick={() => onDisrupt(d, selectedDay)} aria-label={`Simulate ${d.label}`} title={d.description} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-surface hover:bg-danger/10 hover:border-danger/40 transition-all text-sm group">
            <span className="text-lg group-hover:scale-110 transition-transform">{d.icon}</span>
            <span className="text-xs font-medium text-text-muted group-hover:text-danger">{d.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
