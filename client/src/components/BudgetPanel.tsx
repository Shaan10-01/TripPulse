import type { BudgetSummary } from '../types';

interface BudgetPanelProps {
  budget: BudgetSummary;
}

const currencySymbol: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

export default function BudgetPanel({ budget }: BudgetPanelProps) {
  const sym = currencySymbol[budget.currency] || budget.currency;
  const pct = Math.round((budget.currentEstimate / budget.originalBudget) * 100);
  const isOver = budget.saved < 0;

  return (
    <section aria-label="Budget summary" className="rounded-2xl border border-border bg-surface-light/60 p-5 space-y-4">
      <h3 className="font-bold text-base flex items-center gap-2">
        <span className="text-lg">💰</span> Budget Tracker
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Original Budget</span>
          <span className="font-semibold">{sym}{budget.originalBudget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Current Estimate</span>
          <span className="font-semibold text-accent">{sym}{budget.currentEstimate.toLocaleString()}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-surface overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-danger' : 'bg-success'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>

        <div className={`text-center text-sm font-bold ${isOver ? 'text-danger' : 'text-success'}`}>
          {isOver ? `Over budget: ${sym}${Math.abs(budget.saved).toLocaleString()}` : `Saved: ${sym}${budget.saved.toLocaleString()}`}
        </div>
      </div>
    </section>
  );
}
