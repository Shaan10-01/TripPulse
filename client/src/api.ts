import type { GenerateRequest, ReplanRequest, Itinerary, ApiResponse } from './types';

const API_BASE = '/api';

export async function generateItinerary(request: GenerateRequest): Promise<Itinerary> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const json: ApiResponse<Itinerary> = await res.json();
  if (!json.success || !json.data) throw new Error(json.error || 'Failed to generate itinerary');
  return json.data;
}

export async function replanItinerary(request: ReplanRequest): Promise<Itinerary> {
  const res = await fetch(`${API_BASE}/replan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const json: ApiResponse<Itinerary> = await res.json();
  if (!json.success || !json.data) throw new Error(json.error || 'Failed to replan itinerary');
  return json.data;
}
