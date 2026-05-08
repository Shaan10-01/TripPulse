import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TripSetupForm from '../components/TripSetupForm';

describe('TripSetupForm', () => {
  it('renders the hero heading', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByText(/where to next/i)).toBeInTheDocument();
  });

  it('renders destination input with placeholder', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText(/manali, goa, tokyo/i)).toBeInTheDocument();
  });

  it('renders all travel style options', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('Cultural')).toBeInTheDocument();
    expect(screen.getByText('Relaxation')).toBeInTheDocument();
    expect(screen.getByText('Backpacker')).toBeInTheDocument();
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('renders all constraint options', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByText('Avoid Crowds')).toBeInTheDocument();
    expect(screen.getByText('Budget Sensitive')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair Friendly')).toBeInTheDocument();
    expect(screen.getByText('Rain-Safe Only')).toBeInTheDocument();
    expect(screen.getByText('Family Friendly')).toBeInTheDocument();
    expect(screen.getByText('Adventure Heavy')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian Food')).toBeInTheDocument();
  });

  it('renders the generate button', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByText(/generate ai itinerary/i)).toBeInTheDocument();
  });

  it('has proper form accessibility attributes', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByRole('form', { name: /trip setup/i })).toBeInTheDocument();
  });

  it('renders travel style as radio group', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: /travel style/i })).toBeInTheDocument();
  });

  it('renders constraint toggles as switches', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(7);
  });

  it('allows selecting a different travel style', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    const adventureBtn = screen.getByRole('radio', { name: /adventure/i });
    fireEvent.click(adventureBtn);
    expect(adventureBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles constraint on click', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    const avoidCrowds = screen.getByRole('switch', { name: /avoid crowds/i });
    expect(avoidCrowds).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(avoidCrowds);
    expect(avoidCrowds).toHaveAttribute('aria-checked', 'true');
  });

  it('has required field on destination', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    const input = screen.getByPlaceholderText(/manali/i);
    expect(input).toBeRequired();
  });

  it('renders currency selector with options', () => {
    render(<TripSetupForm onSubmit={() => {}} />);
    const select = screen.getByLabelText('Currency');
    expect(select).toBeInTheDocument();
  });
});
