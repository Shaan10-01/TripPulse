import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
  it('renders the TripPulse brand name', () => {
    render(<Header />);
    expect(screen.getByText('TripPulse')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Header />);
    expect(screen.getByText('Adaptive AI Travel Copilot')).toBeInTheDocument();
  });

  it('does not render New Trip button when onReset is not provided', () => {
    render(<Header />);
    expect(screen.queryByText('✦ New Trip')).not.toBeInTheDocument();
  });

  it('renders New Trip button when onReset is provided', () => {
    render(<Header onReset={() => {}} />);
    expect(screen.getByText('✦ New Trip')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('has a skip navigation link', () => {
    render(<Header />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('has aria-hidden on decorative icon', () => {
    render(<Header />);
    const icon = screen.getByText('✈');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('has proper aria-label on New Trip button', () => {
    render(<Header onReset={() => {}} />);
    expect(screen.getByLabelText('Start a new trip')).toBeInTheDocument();
  });
});
