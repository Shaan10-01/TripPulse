import { Request, Response } from 'express';
import { callGemini } from '../services/gemini';
import { buildConstraintString } from '../types';
import type { TripSetup, Disruption } from '../types';
import { logger } from '../utils/logger';

const REPLAN_SYSTEM_PROMPT = `You are TripPulse, an expert AI travel replanner. You receive an existing itinerary and a disruption event, and you must intelligently modify ONLY the affected parts.

CRITICAL: Return valid JSON matching the EXACT same schema as the original itinerary. No markdown, no explanation, ONLY JSON.

For activities that are REPLACED due to the disruption, add these extra fields:
- "replaced": true
- "original": "<title of the original activity that was replaced>"
- "replacementReason": "<brief reason for the change>"

For activities that remain UNCHANGED, keep them exactly as-is (do NOT add replaced/original fields).

Rules:
- Only modify activities that are directly affected by the disruption
- Maintain the same time structure where possible
- Keep total cost within the original budget range
- Replacement activities must be realistic and specific
- Preserve the overall travel style and constraints
- Update day estimatedCost and totalEstimatedCost accordingly`;

export async function replanRoute(req: Request, res: Response) {
  try {
    const { itinerary, disruption, tripSetup, affectedDay } = req.body as {
      itinerary: any;
      disruption: Disruption;
      tripSetup: TripSetup;
      affectedDay?: number;
    };

    if (!itinerary || !disruption) {
      logger.warn('Replan called with missing itinerary or disruption');
      return res.status(400).json({ success: false, error: 'Missing itinerary or disruption' });
    }

    logger.info(`Replanning for disruption: ${disruption.label} (day: ${affectedDay || 'all'})`);

    const constraintStr = buildConstraintString(tripSetup.constraints);
    const dayScope = affectedDay ? `Only modify Day ${affectedDay}.` : 'Modify any affected days.';

    const userPrompt = `Here is the current itinerary:
${JSON.stringify(itinerary.days, null, 2)}

DISRUPTION EVENT: ${disruption.label}
Description: ${disruption.description}
${dayScope}

Trip context:
- Destination: ${tripSetup.destination}
- Budget: ${tripSetup.budget} ${tripSetup.currency}
- Travel Style: ${tripSetup.travelStyle}
- Travelers: ${tripSetup.travelers}
- Constraints: ${constraintStr}

Replan the affected sections. Mark replaced activities with "replaced": true, "original": "<old title>", and "replacementReason". Keep unchanged activities exactly as-is.

Return the complete itinerary JSON with the same schema (days array + totalEstimatedCost).`;

    const raw = await callGemini(REPLAN_SYSTEM_PROMPT, userPrompt);
    const parsed = JSON.parse(raw);

    if (!parsed.days || !Array.isArray(parsed.days)) {
      logger.error('Gemini replan returned invalid structure');
      return res.status(500).json({ success: false, error: 'AI returned invalid replan structure' });
    }

    const replacedCount = parsed.days.reduce((sum: number, day: any) =>
      sum + (day.activities?.filter((a: any) => a.replaced)?.length || 0), 0
    );

    const updated = {
      ...itinerary,
      days: parsed.days,
      totalEstimatedCost: parsed.totalEstimatedCost || itinerary.totalEstimatedCost,
      version: (itinerary.version || 1) + 1,
    };

    logger.info(`Replan complete: ${replacedCount} activities replaced, new cost ${updated.totalEstimatedCost}`);
    return res.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Replanning failed';
    logger.error(`Replan error: ${message}`);
    return res.status(500).json({ success: false, error: message });
  }
}
