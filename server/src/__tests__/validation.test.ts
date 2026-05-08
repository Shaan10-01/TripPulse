import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { validateTripSetup, validateReplanInput } from '../middleware/validation';

/** Helper to create mock Express req/res/next */
function createMocks(body: any = {}) {
  const req = { body } as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

const validTripSetup = {
  destination: 'Tokyo',
  budget: 50000,
  currency: 'INR',
  duration: 3,
  travelStyle: 'cultural',
  travelers: 2,
  constraints: {
    avoidCrowds: false,
    budgetSensitive: false,
    wheelchairFriendly: false,
    rainSafe: false,
    familyFriendly: false,
    adventureHeavy: false,
    vegetarianOnly: false,
  },
};

describe('validateTripSetup', () => {
  it('should call next() for valid input', () => {
    const { req, res, next } = createMocks({ tripSetup: validTripSetup });
    validateTripSetup(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should reject missing tripSetup object', () => {
    const { req, res, next } = createMocks({});
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject empty destination', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, destination: '' },
    });
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject destination exceeding max length', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, destination: 'A'.repeat(201) },
    });
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject budget below minimum', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, budget: 50 },
    });
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject non-integer duration', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, duration: 2.5 },
    });
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject duration above max', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, duration: 31 },
    });
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject invalid travel style', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, travelStyle: 'extreme' },
    });
    validateTripSetup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should sanitize HTML tags from destination', () => {
    const { req, res, next } = createMocks({
      tripSetup: { ...validTripSetup, destination: '<script>alert("xss")</script>Tokyo' },
    });
    validateTripSetup(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.tripSetup.destination).toBe('alert("xss")Tokyo');
  });

  it('should accept all valid travel styles', () => {
    const styles = ['adventure', 'cultural', 'relaxation', 'backpacker', 'luxury', 'family'];
    styles.forEach(style => {
      const { req, res, next } = createMocks({
        tripSetup: { ...validTripSetup, travelStyle: style },
      });
      validateTripSetup(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('validateReplanInput', () => {
  const validReplanBody = {
    itinerary: { days: [{ day: 1, activities: [] }], version: 1 },
    disruption: { type: 'weather', label: 'Heavy Rain', icon: '🌧️', description: 'It is raining' },
    tripSetup: validTripSetup,
  };

  it('should call next() for valid replan input', () => {
    const { req, res, next } = createMocks(validReplanBody);
    validateReplanInput(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should reject missing itinerary', () => {
    const { req, res, next } = createMocks({
      ...validReplanBody,
      itinerary: undefined,
    });
    validateReplanInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject itinerary with empty days', () => {
    const { req, res, next } = createMocks({
      ...validReplanBody,
      itinerary: { days: [] },
    });
    validateReplanInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject missing disruption type', () => {
    const { req, res, next } = createMocks({
      ...validReplanBody,
      disruption: { label: 'Rain' },
    });
    validateReplanInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should reject missing tripSetup in replan', () => {
    const { req, res, next } = createMocks({
      ...validReplanBody,
      tripSetup: undefined,
    });
    validateReplanInput(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
