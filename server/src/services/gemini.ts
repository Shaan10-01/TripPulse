import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';
if (!API_KEY) {
  logger.warn('GEMINI_API_KEY not set. AI features will fail.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.8,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
});

/**
 * Call Gemini with structured JSON output.
 * Includes retry logic and JSON sanitization for stability.
 */
export async function callGemini(systemPrompt: string, userPrompt: string, retries = 2): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      logger.info(`Gemini call attempt ${attempt + 1}/${retries + 1}`);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { role: 'model', parts: [{ text: systemPrompt }] },
      });

      const raw = result.response.text();

      // Validate it's parseable JSON before returning
      const sanitized = sanitizeJsonResponse(raw);
      JSON.parse(sanitized); // throws if invalid
      logger.info('Gemini response validated as valid JSON');
      return sanitized;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`Gemini attempt ${attempt + 1} failed: ${message}`);

      if (attempt === retries) {
        throw new Error(`Gemini API failed after ${retries + 1} attempts: ${message}`);
      }
      // Brief pause before retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  throw new Error('Gemini call failed unexpectedly');
}

/**
 * Strip markdown fences and other non-JSON wrapper text that models sometimes add.
 */
function sanitizeJsonResponse(raw: string): string {
  let cleaned = raw.trim();

  // Remove ```json ... ``` wrappers
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Find the first { or [ and last } or ]
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const start = firstBrace === -1 ? firstBracket : firstBracket === -1 ? firstBrace : Math.min(firstBrace, firstBracket);

  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');
  const end = Math.max(lastBrace, lastBracket);

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  return cleaned;
}
