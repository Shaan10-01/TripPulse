import { describe, it, expect } from 'vitest';
import { buildConstraintString } from '../types';
import type { TripConstraints } from '../types';

describe('buildConstraintString', () => {
  it('should return "No special constraints" when all constraints are false', () => {
    const constraints: TripConstraints = {
      avoidCrowds: false,
      budgetSensitive: false,
      wheelchairFriendly: false,
      rainSafe: false,
      familyFriendly: false,
      adventureHeavy: false,
      vegetarianOnly: false,
    };
    expect(buildConstraintString(constraints)).toBe('No special constraints');
  });

  it('should include correct constraint text for each enabled flag', () => {
    const constraints: TripConstraints = {
      avoidCrowds: true,
      budgetSensitive: false,
      wheelchairFriendly: true,
      rainSafe: false,
      familyFriendly: false,
      adventureHeavy: false,
      vegetarianOnly: true,
    };
    const result = buildConstraintString(constraints);
    expect(result).toContain('Avoid crowded tourist spots');
    expect(result).toContain('wheelchair accessible');
    expect(result).toContain('vegetarian');
    expect(result).not.toContain('budget-friendly');
    expect(result).not.toContain('rain-safe');
  });

  it('should include all constraints when all flags are true', () => {
    const constraints: TripConstraints = {
      avoidCrowds: true,
      budgetSensitive: true,
      wheelchairFriendly: true,
      rainSafe: true,
      familyFriendly: true,
      adventureHeavy: true,
      vegetarianOnly: true,
    };
    const result = buildConstraintString(constraints);
    const lines = result.split('\n');
    expect(lines).toHaveLength(7);
  });
});
