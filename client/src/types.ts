// ─── Trip Setup Types ─────────────────────────────────────────
export type TravelStyle = 'adventure' | 'cultural' | 'relaxation' | 'backpacker' | 'luxury' | 'family';

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
  travelStyle: TravelStyle;
  travelers: number;
  constraints: TripConstraints;
}

// ─── Itinerary Types ──────────────────────────────────────────
export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'activity' | 'food' | 'travel' | 'rest';
  estimatedCost: number;
  location?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  replaced?: boolean;
  original?: string;
  replacementReason?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  theme: string;
  activities: Activity[];
  estimatedCost: number;
}

export interface Itinerary {
  id: string;
  destination: string;
  totalDays: number;
  totalEstimatedCost: number;
  currency: string;
  days: DayPlan[];
  generatedAt: string;
  version: number;
}

// ─── Disruption Types ─────────────────────────────────────────
export type DisruptionType =
  | 'heavy_rain'
  | 'budget_cut'
  | 'traffic_delay'
  | 'user_exhausted'
  | 'attraction_closed'
  | 'local_event';

export interface Disruption {
  type: DisruptionType;
  label: string;
  icon: string;
  description: string;
  affectedDay?: number;
}

export const DISRUPTIONS: Disruption[] = [
  { type: 'heavy_rain', label: 'Heavy Rain', icon: '🌧️', description: 'Unexpected heavy rainfall — outdoor activities at risk' },
  { type: 'budget_cut', label: 'Budget Cut', icon: '💸', description: 'Budget reduced by 30% — find cheaper alternatives' },
  { type: 'traffic_delay', label: 'Traffic Delay', icon: '🚗', description: 'Major traffic congestion — reroute needed' },
  { type: 'user_exhausted', label: 'User Exhausted', icon: '😴', description: 'Travelers are tired — switch to low-energy activities' },
  { type: 'attraction_closed', label: 'Attraction Closed', icon: '🚫', description: 'A major planned attraction is unexpectedly closed' },
  { type: 'local_event', label: 'Local Event Found', icon: '🎉', description: 'A local festival or event is happening nearby!' },
];

// ─── Budget Types ─────────────────────────────────────────────
export interface BudgetSummary {
  originalBudget: number;
  currentEstimate: number;
  saved: number;
  currency: string;
}

// ─── API Types ────────────────────────────────────────────────
export interface GenerateRequest {
  tripSetup: TripSetup;
}

export interface ReplanRequest {
  itinerary: Itinerary;
  disruption: Disruption;
  tripSetup: TripSetup;
  affectedDay?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
