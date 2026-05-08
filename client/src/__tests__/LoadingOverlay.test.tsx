import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from '../components/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders the loading message', () => {
    render(<LoadingOverlay message="Generating itinerary..." />);
    expect(screen.getByText('Generating itinerary...')).toBeInTheDocument();
  });

  it('has a status role for screen readers', () => {
    render(<LoadingOverlay message="Loading..." />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live for dynamic content updates', () => {
    render(<LoadingOverlay message="Loading..." />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });
});
