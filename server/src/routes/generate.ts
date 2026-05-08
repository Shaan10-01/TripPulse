import { Request, Response } from 'express';
import { callGemini } from '../services/gemini';
import { buildConstraintString } from '../types';
import type { TripSetup } from '../types';
import { v4 } from '../utils/id';
import { logger } from '../utils/logger';

const SYSTEM_PROMPT = `You are TripPulse, an expert AI travel planner. You generate highly personalized, realistic travel itineraries.

CRITICAL: You MUST return valid JSON matching the exact schema below. No markdown, no explanation, ONLY JSON.

Schema:
{
  "days": [
    {
      "day": <number>,
      "theme": "<string: short theme for the day>",
      "activities": [
        {
          "id": "<unique string id like 'd1a1'>",
          "time": "<HH:MM format>",
          "title": "<string>",
          "description": "<1-2 sentence description>",
          "type": "<one of: activity, food, travel, rest>",
          "estimatedCost": <number in the specified currency>,
          "location": "<specific place name>"
        }
      ],
      "estimatedCost": <number: sum of activity costs>
    }
  ],
  "totalEstimatedCost": <number: sum of all day costs>
}

Rules:
- Each day should have 4-6 activities including meals and travel
- Be specific with real place names, restaurants, and attractions
- Costs must be realistic for the destination and currency
- Time slots should be logical (morning to evening)
- Activities must match the travel style and constraints
- Total cost must stay within or near the given budget`;

export async function generateRoute(req: Request, res: Response) {
  try {
    const { tripSetup } = req.body as { tripSetup: TripSetup };

    if (!tripSetup?.destination) {
      logger.warn('Generate called without destination');
      return res.status(400).json({ success: false, error: 'Missing destination' });
    }

    logger.info(`Generating itinerary for ${tripSetup.destination} (${tripSetup.duration} days, ${tripSetup.budget} ${tripSetup.currency})`);

    const constraintStr = buildConstraintString(tripSetup.constraints);

    const userPrompt = `Generate a ${tripSetup.duration}-day travel itinerary for ${tripSetup.destination}.

Travelers: ${tripSetup.travelers}
Budget: ${tripSetup.budget} ${tripSetup.currency} (total for all travelers)
Travel Style: ${tripSetup.travelStyle}
Constraints:
${constraintStr}

Return ONLY the JSON object matching the schema. Be specific with real places.`;

    const raw = await callGemini(SYSTEM_PROMPT, userPrompt);
    const parsed = JSON.parse(raw);

    // Validate basic structure
    if (!parsed.days || !Array.isArray(parsed.days)) {
      logger.error('Gemini returned invalid structure: missing days array');
      return res.status(500).json({ success: false, error: 'AI returned invalid itinerary structure' });
    }

    const itinerary = {
      id: v4(),
      destination: tripSetup.destination,
      totalDays: tripSetup.duration,
      totalEstimatedCost: parsed.totalEstimatedCost || 0,
      currency: tripSetup.currency,
      days: parsed.days,
      generatedAt: new Date().toISOString(),
      version: 1,
    };

    logger.info(`Itinerary generated: ${itinerary.days.length} days, est. cost ${itinerary.totalEstimatedCost} ${itinerary.currency}`);
    return res.json({ success: true, data: itinerary });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    logger.error(`Generate error: ${message}`);
    return res.status(500).json({ success: false, error: message });
  }
}
