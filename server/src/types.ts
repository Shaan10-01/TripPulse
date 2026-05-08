export interface TripConstraints {
  avoidCrowds: boolean;
  budgetSensitive: boolean;
  wheelchairFriendly: boolean;
  rainSafe: boolean;
  familyFriendly: boolean;
  adventureHeavy: boolean;
  vegetarianOnly: boolean;
}

export interface TripSetup {
  destination: string;
  budget: number;
  currency: string;
  duration: number;
  travelStyle: string;
  travelers: number;
  constraints: TripConstraints;
}

export interface Disruption {
  type: string;
  label: string;
  icon: string;
  description: string;
  affectedDay?: number;
}

export function buildConstraintString(constraints: TripConstraints): string {
  const active: string[] = [];
  if (constraints.avoidCrowds) active.push('Avoid crowded tourist spots');
  if (constraints.budgetSensitive) active.push('Prioritize budget-friendly options');
  if (constraints.wheelchairFriendly) active.push('All activities must be wheelchair accessible');
  if (constraints.rainSafe) active.push('Only include indoor or rain-safe activities');
  if (constraints.familyFriendly) active.push('All activities must be family and child friendly');
  if (constraints.adventureHeavy) active.push('Maximize adventure and thrill activities');
  if (constraints.vegetarianOnly) active.push('Only recommend vegetarian-friendly restaurants');
  return active.length > 0 ? active.join('\n') : 'No special constraints';
}
