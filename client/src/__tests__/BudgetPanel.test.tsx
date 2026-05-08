import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BudgetPanel from '../components/BudgetPanel';

describe('BudgetPanel', () => {
  const underBudget = {
    originalBudget: 50000,
    currentEstimate: 35000,
    saved: 15000,
    currency: 'INR',
  };

  const overBudget = {
    originalBudget: 50000,
    currentEstimate: 65000,
    saved: -15000,
    currency: 'INR',
  };

  it('renders budget tracker heading', () => {
    render(<BudgetPanel budget={underBudget} />);
    expect(screen.getByText('Budget Tracker')).toBeInTheDocument();
  });

  it('displays original budget', () => {
    render(<BudgetPanel budget={underBudget} />);
    expect(screen.getByText('₹50,000')).toBeInTheDocument();
  });

  it('displays current estimate', () => {
    render(<BudgetPanel budget={underBudget} />);
    expect(screen.getByText('₹35,000')).toBeInTheDocument();
  });

  it('shows savings when under budget', () => {
    render(<BudgetPanel budget={underBudget} />);
    expect(screen.getByText(/saved ₹15,000/i)).toBeInTheDocument();
  });

  it('shows warning when over budget', () => {
    render(<BudgetPanel budget={overBudget} />);
    expect(screen.getByText(/over budget/i)).toBeInTheDocument();
  });

  it('has proper accessibility label', () => {
    render(<BudgetPanel budget={underBudget} />);
    expect(screen.getByLabelText('Budget summary')).toBeInTheDocument();
  });
});
