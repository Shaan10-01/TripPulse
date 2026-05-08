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
    <section aria-label="Budget summary" className="rounded-2xl border-2 border-border bg-surface-light/60 p-6 space-y-5">
      <h3 className="font-bold text-base flex items-center gap-2">
        <span className="w-8 h-8 rounded-xl bg-warning/15 flex items-center justify-center text-sm">💰</span>
        Budget Tracker
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Original Budget</span>
          <span className="font-bold text-base">{sym}{budget.originalBudget.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-muted">Current Estimate</span>
          <span className="font-bold text-base text-accent">{sym}{budget.currentEstimate.toLocaleString()}</span>
        </div>

        {/* Progress bar */}
        <div className="h-3 rounded-full bg-surface overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${isOver ? 'bg-danger' : 'bg-gradient-to-r from-success to-accent'}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>

        <div className={`text-center py-2.5 rounded-xl text-sm font-bold ${isOver ? 'text-danger bg-danger/10' : 'text-success bg-success/10'}`}>
          {isOver
            ? `⚠️ Over budget by ${sym}${Math.abs(budget.saved).toLocaleString()}`
            : `✅ Saved ${sym}${budget.saved.toLocaleString()}`}
        </div>
      </div>
    </section>
  );
}
