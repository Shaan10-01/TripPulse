import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Validates the trip setup payload for the /api/generate endpoint.
 * Ensures all required fields are present and properly typed.
 */
export function validateTripSetup(req: Request, res: Response, next: NextFunction): void {
  const { tripSetup } = req.body;

  if (!tripSetup || typeof tripSetup !== 'object') {
    logger.warn('Validation failed: missing tripSetup object');
    res.status(400).json({ success: false, error: 'Missing tripSetup object' });
    return;
  }

  const { destination, budget, duration, travelers, travelStyle } = tripSetup;

  // Required string fields
  if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Destination is required' });
    return;
  }

  if (destination.length > 200) {
    res.status(400).json({ success: false, error: 'Destination too long (max 200 chars)' });
    return;
  }

  // Required numeric fields with bounds
  if (typeof budget !== 'number' || budget < 100 || budget > 10_000_000) {
    res.status(400).json({ success: false, error: 'Budget must be between 100 and 10,000,000' });
    return;
  }

  if (typeof duration !== 'number' || duration < 1 || duration > 30 || !Number.isInteger(duration)) {
    res.status(400).json({ success: false, error: 'Duration must be an integer between 1 and 30' });
    return;
  }

  if (typeof travelers !== 'number' || travelers < 1 || travelers > 20 || !Number.isInteger(travelers)) {
    res.status(400).json({ success: false, error: 'Travelers must be an integer between 1 and 20' });
    return;
  }

  // Travel style validation
  const validStyles = ['adventure', 'cultural', 'relaxation', 'backpacker', 'luxury', 'family'];
  if (!validStyles.includes(travelStyle)) {
    res.status(400).json({ success: false, error: `Invalid travel style. Must be one of: ${validStyles.join(', ')}` });
    return;
  }

  // Sanitize string input (basic XSS prevention)
  tripSetup.destination = tripSetup.destination.trim().replace(/<[^>]*>/g, '');

  next();
}

/**
 * Validates the replan payload for the /api/replan endpoint.
 * Ensures itinerary and disruption data are present.
 */
export function validateReplanInput(req: Request, res: Response, next: NextFunction): void {
  const { itinerary, disruption, tripSetup } = req.body;

  if (!itinerary || typeof itinerary !== 'object') {
    res.status(400).json({ success: false, error: 'Missing itinerary object' });
    return;
  }

  if (!itinerary.days || !Array.isArray(itinerary.days) || itinerary.days.length === 0) {
    res.status(400).json({ success: false, error: 'Itinerary must have at least one day' });
    return;
  }

  if (!disruption || typeof disruption !== 'object' || !disruption.type || !disruption.label) {
    res.status(400).json({ success: false, error: 'Missing or invalid disruption object' });
    return;
  }

  if (!tripSetup || typeof tripSetup !== 'object' || !tripSetup.destination) {
    res.status(400).json({ success: false, error: 'Missing tripSetup context' });
    return;
  }

  next();
}
